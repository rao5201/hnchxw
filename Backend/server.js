const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// 初始化 Supabase
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// --- 核心接口：抖音登录 ---
app.post('/api/auth/login', async (req, res) => {
    const { code } = req.body; // 抖音前端传来的 code
    
    // 1. 这里将来需要调用抖音接口换取 open_id
    // 模拟：假设我们拿到了 open_id
    const mockOpenId = "user_" + code; 

    // 2. 在数据库中查找或创建用户
    const { data: user, error } = await supabase
        .from('users')
        .select('*')
        .eq('open_id', mockOpenId)
        .single();

    if (error && error.code !== 'PGRST116') {
        return res.status(500).json({ error: error.message });
    }

    let userId = user ? user.id : null;

    if (!user) {
        // 如果是新用户，插入数据库
        const { data: newUser, error: insertError } = await supabase
            .from('users')
            .insert([{ open_id: mockOpenId, nickname: '茶友_' + Math.floor(Math.random()*1000) }])
            .select()
            .single();
        
        if (insertError) return res.status(500).json({ error: insertError.message });
        userId = newUser.id;
    }

    // 3. 返回 Token 给前端
    // 注意：真实环境请使用 jsonwebtoken 库生成 JWT，这里为了演示简单直接返回 ID
    res.json({ 
        success: true, 
        token: userId, 
        message: "登录成功，欢迎回到茶海虾王" 
    });
});

// --- 预留接口：电商 ---
app.get('/api/shop/list', (req, res) => {
    res.json({ message: "电商接口开发中...", data: [] });
});

// --- 预留接口：镜心 ---
app.get('/api/mirror/match', (req, res) => {
    res.json({ message: "镜心匹配算法开发中..." });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 茶海虾王后端服务已启动: http://localhost:${PORT}`);
});