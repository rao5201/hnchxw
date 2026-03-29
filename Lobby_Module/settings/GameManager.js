const { _decorator, Component, Node, sys } = require('cc');
const { ccclass, property } = _decorator;

@ccclass('GameManager')
export class GameManager extends Component {
    // 后端地址 (本地调试用 localhost，上线后换成 Render 地址)
    API_URL = "http://localhost:3000"; 

    start() {
        console.log("🍵 茶海虾王大厅已启动");
        this.checkLoginStatus();
    }

    // 检查是否已登录
    checkLoginStatus() {
        const token = sys.localStorage.getItem('teahaixin_token');
        if (token) {
            console.log("用户已登录，Token:", token);
            // 这里可以更新 UI，显示用户昵称等
        }
    }

    // 模拟抖音登录（实际开发中这里会调用抖音 SDK）
    loginWithDouyin() {
        // 模拟一个 code
        const mockCode = "123456"; 
        
        fetch(`${this.API_URL}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code: mockCode })
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                sys.localStorage.setItem('teahaixin_token', data.token);
                alert("登录成功！");
            }
        })
        .catch(err => console.error(err));
    }

    // --- 跳转逻辑 ---

    // 去往心遇
    goToXinyu() {
        const token = sys.localStorage.getItem('teahaixin_token');
        if (!token) {
            this.loginWithDouyin(); // 没登录先登录
            return;
        }

        // 构造带 Token 的链接
        const xinyuUrl = `./Xinyu_Web/index.html?token=${token}`;
        console.log("跳转至心遇:", xinyuUrl);
        
        // 注意：在 Cocos 中打开本地 HTML 比较复杂，
        // 实际上线后，这里会调用 tt.navigateToMiniProgram
        // 或者打开 Webview 组件加载你的 PWA 网址
        alert("正在前往 茶海心遇...");
    }

    // 去往镜心 (预留)
    goToMirror() {
        alert("🔮 镜心·Mirror Soul 正在筹备中，敬请期待...");
    }

    // 去往商城 (预留)
    goToShop() {
        alert("🛒 虾王商城 正在筹备中...");
    }
}