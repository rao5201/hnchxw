const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// 初始化 Supabase
// 确保你的 .env 文件里有 SUPABASE_URL 和 SUPABASE_KEY
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

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
            union_id: ['wechat', 'alipay', 'douyin'].includes(type) ? identifier : null, // 简单映射，实际可细分
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
            return res.status(500).json({ success: false, message: "注册失败", error: insertError });
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

// --- 兼容旧代码：抖音登录接口 (建议后续合并到上面) ---
app.post('/api/auth/login', async (req, res) => {
    // 这里保留你之前的逻辑作为兼容，或者重定向到上面的 /register 接口
    res.json({ message: "请使用 /api/auth/register 接口进行统一登录/注册" });
});

// --- 其他业务接口 ---
app.get('/api/shop/list', (req, res) => {
    res.json({ message: "电商接口开发中...", data: [] });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 茶海虾王后端服务已启动: http://localhost:${PORT}`);
    console.log(`🔗 接口文档: POST /api/auth/register`);
});
