const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
const twilio = require('twilio');
require('dotenv').config();

// 初始化Twilio
const twilioClient = process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN 
    ? twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN) 
    : null;

const app = express();
app.use(cors());
app.use(express.json());

// 初始化 Supabase
// 确保你的 .env 文件里有 SUPABASE_URL 和 SUPABASE_KEY
// 或者使用下面的默认值（仅用于测试）
const supabaseUrl = process.env.SUPABASE_URL || 'https://example.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY || '************************************************************************************************************************************************************************************************************************';
const supabase = createClient(supabaseUrl, supabaseKey);

// --- 内存级风控记录 (重启后重置，生产环境建议用 Redis) ---
// 格式: { "192.168.1.1": { count: 1, firstTime: 171234567890 } }
const IPRegistry = {};

// --- 核心接口：统一认证中心 (支持手机号/第三方) ---
app.post('/api/auth/register', async (req, res) => {
    const { type, identifier, code, source_platform } = req.body;
    const clientIP = req.ip || req.connection.remoteAddress;
    const currentTime = Date.now();

    console.log(`📩 [注册请求] IP=${clientIP}, Type=${type}, ID=${identifier}`);

    // 1. IP 风控检查 (策略: 3次封禁 72小时)
    if (!IPRegistry[clientIP]) {
        IPRegistry[clientIP] = { count: 0, firstTime: currentTime };
    }

    const ipRecord = IPRegistry[clientIP];
    
    // 检查是否在72小时管控期内
    if (currentTime - ipRecord.firstTime < 72 * 60 * 60 * 1000) {
        if (ipRecord.count >= 3) {
            return res.status(403).json({
                success: false,
                message: "操作频繁，该IP已被管控 72 小时",
                code: "IP_BLOCKED"
            });
        }
    } else {
        // 超过72小时，重置计数
        ipRecord.count = 0;
        ipRecord.firstTime = currentTime;
    }

    // 2. 验证逻辑分流
    let isVerified = false;

    // 策略1 & 2: 手机号/邮箱 -> 固定验证码 888888
    if (type === 'phone' || type === 'email') {
        if (code === '888888') {
            isVerified = true;
        } else {
            return res.status(401).json({ success: false, message: "验证码错误" });
        }
    } 
    // 策略3: 第三方 (微信/支付宝/抖音等) -> 直接信任，自动注册
    else if (['wechat', 'alipay', 'douyin', 'kuaishou', 'xiaohongshu', 'taobao', 'pdd', 'jd'].includes(type)) {
        isVerified = true; 
    } else {
        return res.status(400).json({ success: false, message: "不支持的注册类型" });
    }

    if (!isVerified) {
        return res.status(401).json({ success: false, message: "验证失败" });
    }

    // 3. 数据库查重与自动注册 (策略4 & 5)
    // 我们查询 Supabase，看这个标识符（手机号/邮箱/第三方ID）是否存在
    let { data: user, error } = await supabase
        .from('users')
        .select('*')
        .eq(type === 'phone' ? 'phone' : (type === 'email' ? 'email' : 'union_id'), identifier)
        .single();

    let isNew = false;

    if (!user) {
        // --- 新用户：自动创建 ---
        const newUser = {
            username: `茶友_${Math.floor(Math.random() * 10000)}`, // 随机昵称
            phone: type === 'phone' ? identifier : null,
            email: type === 'email' ? identifier : null,
            union_id: ['wechat', 'alipay', 'douyin', 'kuaishou', 'xiaohongshu', 'taobao', 'pdd', 'jd'].includes(type) ? identifier : null,
            source_platform: source_platform || type,
            is_auto_generated: true,
            created_at: new Date().toISOString()
        };

        const { data: createdUser, error: insertError } = await supabase
            .from('users')
            .insert([newUser])
            .select()
            .single();

        if (insertError) {
            console.error("注册失败:", insertError);
            // 如果数据库操作失败，使用内存存储作为 fallback
            return res.status(500).json({ success: false, message: "注册失败，数据库连接异常" });
        }
        
        user = createdUser;
        isNew = true;
        
        // 只有新用户才增加 IP 计数 (老用户登录不算)
        ipRecord.count += 1;
        console.log(`🆕 [新用户注册] ID=${user.id}, 来源=${type}`);
    } else {
        console.log(`✅ [老用户登录] ID=${user.id}, 来源=${type}`);
    }

    // 4. 返回 Token (策略6: 方便管理)
    res.json({
        success: true,
        data: {
            token: `token_${user.id}`, // 真实环境请用 jwt.sign
            user_id: user.id,
            username: user.username,
            is_new_user: isNew
        }
    });
});

// --- 发送短信验证码接口 ---
app.post('/api/auth/send-sms', async (req, res) => {
    const { phone } = req.body;
    const clientIP = req.ip || req.connection.remoteAddress;
    const currentTime = Date.now();

    console.log(`📩 [发送短信验证码] IP=${clientIP}, Phone=${phone}`);

    // 1. IP 风控检查
    if (!IPRegistry[clientIP]) {
        IPRegistry[clientIP] = { count: 0, firstTime: currentTime };
    }

    const ipRecord = IPRegistry[clientIP];
    if (currentTime - ipRecord.firstTime < 60 * 60 * 1000) {
        if (ipRecord.count >= 5) {
            return res.status(403).json({
                success: false,
                message: "操作频繁，该IP已被限制 1 小时",
                code: "IP_BLOCKED"
            });
        }
    } else {
        ipRecord.count = 0;
        ipRecord.firstTime = currentTime;
    }

    // 2. 验证手机号格式
    if (!/^1[3-9]\d{9}$/.test(phone)) {
        return res.status(400).json({ success: false, message: "手机号格式错误" });
    }

    // 3. 生成验证码
    const code = '888888'; // 测试环境固定验证码

    // 4. 发送短信
    if (twilioClient && process.env.TWILIO_PHONE_NUMBER) {
        try {
            await twilioClient.messages.create({
                body: `您的茶海心遇验证码是: ${code}，有效期10分钟`,
                from: process.env.TWILIO_PHONE_NUMBER,
                to: `+86${phone}`
            });
            console.log(`✅ [短信发送成功] Phone=${phone}, Code=${code}`);
        } catch (error) {
            console.error("短信发送失败:", error);
            // 短信发送失败不影响流程，返回成功
        }
    }

    // 5. 增加IP计数
    ipRecord.count += 1;

    // 6. 返回成功
    res.json({
        success: true,
        message: "验证码已发送",
        code: code // 测试环境返回验证码
    });
});

// --- 发送邮箱验证码接口 ---
app.post('/api/auth/send-email', async (req, res) => {
    const { email } = req.body;
    const clientIP = req.ip || req.connection.remoteAddress;
    const currentTime = Date.now();

    console.log(`📩 [发送邮箱验证码] IP=${clientIP}, Email=${email}`);

    // 1. IP 风控检查
    if (!IPRegistry[clientIP]) {
        IPRegistry[clientIP] = { count: 0, firstTime: currentTime };
    }

    const ipRecord = IPRegistry[clientIP];
    if (currentTime - ipRecord.firstTime < 60 * 60 * 1000) {
        if (ipRecord.count >= 5) {
            return res.status(403).json({
                success: false,
                message: "操作频繁，该IP已被限制 1 小时",
                code: "IP_BLOCKED"
            });
        }
    } else {
        ipRecord.count = 0;
        ipRecord.firstTime = currentTime;
    }

    // 2. 验证邮箱格式
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).json({ success: false, message: "邮箱格式错误" });
    }

    // 3. 生成验证码
    const code = '888888'; // 测试环境固定验证码

    // 4. 模拟发送邮件
    console.log(`📧 [邮件发送] Email=${email}, Code=${code}`);
    // 实际项目中可以使用Nodemailer发送邮件

    // 5. 增加IP计数
    ipRecord.count += 1;

    // 6. 返回成功
    res.json({
        success: true,
        message: "验证码已发送",
        code: code // 测试环境返回验证码
    });
});

// --- 社交登录接口 (占位) ---
app.post('/api/auth/social', async (req, res) => {
    const { platform, code } = req.body;
    const clientIP = req.ip || req.connection.remoteAddress;
    const currentTime = Date.now();

    console.log(`📩 [社交登录] IP=${clientIP}, Platform=${platform}`);

    // 1. IP 风控检查
    if (!IPRegistry[clientIP]) {
        IPRegistry[clientIP] = { count: 0, firstTime: currentTime };
    }

    const ipRecord = IPRegistry[clientIP];
    if (currentTime - ipRecord.firstTime < 60 * 60 * 1000) {
        if (ipRecord.count >= 10) {
            return res.status(403).json({
                success: false,
                message: "操作频繁，该IP已被限制 1 小时",
                code: "IP_BLOCKED"
            });
        }
    } else {
        ipRecord.count = 0;
        ipRecord.firstTime = currentTime;
    }

    // 2. 验证平台
    const validPlatforms = ['wechat', 'alipay', 'douyin', 'kuaishou', 'xiaohongshu', 'taobao', 'pdd', 'jd'];
    if (!validPlatforms.includes(platform)) {
        return res.status(400).json({ success: false, message: "不支持的平台" });
    }

    // 3. 模拟社交登录流程
    // 实际项目中，这里应该调用对应平台的API进行验证
    const unionId = `${platform}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

    // 4. 数据库查重与自动注册
    let { data: user, error } = await supabase
        .from('users')
        .select('*')
        .eq('union_id', unionId)
        .single();

    let isNew = false;

    if (!user) {
        // 新用户
        const newUser = {
            username: `${platform === 'wechat' ? '微信' : platform === 'alipay' ? '支付宝' : platform === 'douyin' ? '抖音' : '社交'}用户_${Math.floor(Math.random() * 10000)}`,
            union_id: unionId,
            source_platform: platform,
            is_auto_generated: true,
            created_at: new Date().toISOString()
        };

        const { data: createdUser, error: insertError } = await supabase
            .from('users')
            .insert([newUser])
            .select()
            .single();

        if (insertError) {
            console.error("注册失败:", insertError);
            return res.status(500).json({ success: false, message: "注册失败，数据库连接异常" });
        }
        
        user = createdUser;
        isNew = true;
        ipRecord.count += 1;
        console.log(`🆕 [新用户注册] ID=${user.id}, 来源=${platform}`);
    } else {
        console.log(`✅ [老用户登录] ID=${user.id}, 来源=${platform}`);
    }

    // 5. 返回 Token
    res.json({
        success: true,
        data: {
            token: `token_${user.id}`,
            user_id: user.id,
            username: user.username,
            is_new_user: isNew
        }
    });
});

// --- 兼容旧代码：抖音登录接口 (建议后续合并到上面) ---
app.post('/api/auth/login', async (req, res) => {
    // 这里保留你之前的逻辑作为兼容，或者重定向到上面的 /register 接口
    res.json({ message: "请使用 /api/auth/register 接口进行统一登录/注册" });
});

// --- 其他业务接口 ---
app.get('/api/shop/list', (req, res) => {
    res.json({ message: "电商接口开发中...", data: [] });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`🚀 茶海虾王后端服务已启动: http://localhost:${PORT}`);
    console.log(`🔗 接口文档: POST /api/auth/register`);
});
