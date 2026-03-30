// 茶海虾王 - 官方网站脚本

// DOM元素
const loginBtn = document.getElementById('login-btn');
const closeModal = document.getElementById('close-modal');
const loginModal = document.getElementById('login-modal');
const playBtn = document.getElementById('play-btn');
const learnMoreBtn = document.getElementById('learn-more-btn');

// 登录方式切换
const authTabs = document.querySelectorAll('.auth-tab');
const authPanels = document.querySelectorAll('.auth-panel');

// 验证码按钮
const btnSendCode = document.getElementById('btn-send-code');
const btnSendEmailCode = document.getElementById('btn-send-email-code');

// 登录按钮
const btnPhoneLogin = document.getElementById('btn-phone-login');
const btnEmailLogin = document.getElementById('btn-email-login');
const btnGuest = document.getElementById('btn-guest');

// 社交登录按钮
const socialButtons = document.querySelectorAll('.btn-social');

// 模态框显示/隐藏
loginBtn.addEventListener('click', () => {
  loginModal.classList.add('show');
  document.body.style.overflow = 'hidden';
});

closeModal.addEventListener('click', () => {
  loginModal.classList.remove('show');
  document.body.style.overflow = 'auto';
});

// 点击模态框外部关闭
loginModal.addEventListener('click', (e) => {
  if (e.target === loginModal) {
    loginModal.classList.remove('show');
    document.body.style.overflow = 'auto';
  }
});

// 登录方式切换
authTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    const type = tab.dataset.type;
    
    // 更新标签状态
    authTabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    
    // 更新面板显示
    authPanels.forEach(panel => panel.classList.remove('active'));
    document.querySelector(`.auth-panel[data-type="${type}"]`).classList.add('active');
  });
});

// 验证码倒计时
function startCountdown(btn) {
  let seconds = 60;
  btn.disabled = true;
  btn.textContent = `${seconds}秒后重新获取`;
  
  const interval = setInterval(() => {
    seconds--;
    btn.textContent = `${seconds}秒后重新获取`;
    if (seconds <= 0) {
      clearInterval(interval);
      btn.disabled = false;
      btn.textContent = '获取验证码';
    }
  }, 1000);
}

// 发送手机验证码
btnSendCode.addEventListener('click', async () => {
  const phone = document.getElementById('phone-input').value.trim();
  if (!phone) {
    alert('请输入手机号');
    return;
  }
  if (!/^1[3-9]\d{9}$/.test(phone)) {
    alert('请输入正确的手机号');
    return;
  }
  
  try {
    // 模拟发送验证码
    console.log('发送短信验证码:', phone);
    alert('验证码已发送（测试环境验证码：888888）');
    startCountdown(btnSendCode);
  } catch (error) {
    console.error('发送短信验证码失败:', error);
    alert('验证码已发送（测试环境验证码：888888）');
    startCountdown(btnSendCode);
  }
});

// 发送邮箱验证码
btnSendEmailCode.addEventListener('click', async () => {
  const email = document.getElementById('email-input').value.trim();
  if (!email) {
    alert('请输入邮箱');
    return;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    alert('请输入正确的邮箱地址');
    return;
  }
  
  try {
    // 模拟发送验证码
    console.log('发送邮箱验证码:', email);
    alert('验证码已发送（测试环境验证码：888888）');
    startCountdown(btnSendEmailCode);
  } catch (error) {
    console.error('发送邮箱验证码失败:', error);
    alert('验证码已发送（测试环境验证码：888888）');
    startCountdown(btnSendEmailCode);
  }
});

// 手机号登录
btnPhoneLogin.addEventListener('click', async () => {
  const phone = document.getElementById('phone-input').value.trim();
  const code = document.getElementById('code-input').value.trim();
  
  if (!phone) { alert('请输入手机号'); return; }
  if (!/^1[3-9]\d{9}$/.test(phone)) { alert('请输入正确的手机号'); return; }
  if (!code) { alert('请输入验证码'); return; }
  if (code.length !== 6) { alert('验证码为6位数字'); return; }
  
  try {
    // 模拟登录
    console.log('手机号登录:', phone, code);
    alert('登录成功！');
    loginModal.classList.remove('show');
    document.body.style.overflow = 'auto';
    // 跳转到游戏页面
    window.location.href = '../Xinyu_Web/index.html';
  } catch (error) {
    console.error('登录失败:', error);
    alert('登录失败，请重试');
  }
});

// 邮箱登录
btnEmailLogin.addEventListener('click', async () => {
  const email = document.getElementById('email-input').value.trim();
  const code = document.getElementById('email-code-input').value.trim();
  
  if (!email) { alert('请输入邮箱'); return; }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { alert('请输入正确的邮箱地址'); return; }
  if (!code) { alert('请输入验证码'); return; }
  if (code.length !== 6) { alert('验证码为6位数字'); return; }
  
  try {
    // 模拟登录
    console.log('邮箱登录:', email, code);
    alert('登录成功！');
    loginModal.classList.remove('show');
    document.body.style.overflow = 'auto';
    // 跳转到游戏页面
    window.location.href = '../Xinyu_Web/index.html';
  } catch (error) {
    console.error('登录失败:', error);
    alert('登录失败，请重试');
  }
});

// 社交登录
socialButtons.forEach(btn => {
  btn.addEventListener('click', async () => {
    const platform = btn.dataset.platform;
    alert(`${platform === 'wechat' ? '微信' : platform === 'alipay' ? '支付宝' : '抖音'}登录中...`);
    
    try {
      // 模拟社交登录
      console.log('社交登录:', platform);
      setTimeout(() => {
        alert('登录成功！');
        loginModal.classList.remove('show');
        document.body.style.overflow = 'auto';
        // 跳转到游戏页面
        window.location.href = '../Xinyu_Web/index.html';
      }, 1000);
    } catch (error) {
      console.error('社交登录失败:', error);
      alert('登录失败，请重试');
    }
  });
});

// 访客模式
btnGuest.addEventListener('click', () => {
  alert('进入访客模式');
  loginModal.classList.remove('show');
  document.body.style.overflow = 'auto';
  // 跳转到游戏页面
  window.location.href = '../Xinyu_Web/index.html';
});

// 立即体验按钮
playBtn.addEventListener('click', () => {
  loginModal.classList.add('show');
  document.body.style.overflow = 'hidden';
});

// 了解更多按钮
learnMoreBtn.addEventListener('click', () => {
  document.getElementById('features').scrollIntoView({ behavior: 'smooth' });
});

// 平滑滚动
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    document.querySelector(this.getAttribute('href')).scrollIntoView({ behavior: 'smooth' });
  });
});

// 页面加载完成后执行
window.addEventListener('DOMContentLoaded', () => {
  console.log('茶海虾王官方网站加载完成');
});