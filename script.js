// 登录模态框功能
const loginModal = document.getElementById('login-modal');
const loginBtn = document.getElementById('login-btn');
const closeModal = document.getElementById('close-modal');
const playBtn = document.getElementById('play-btn');

// 打开模态框
loginBtn.addEventListener('click', () => {
  loginModal.classList.add('active');
  document.body.style.overflow = 'hidden';
});

// 关闭模态框
closeModal.addEventListener('click', () => {
  loginModal.classList.remove('active');
  document.body.style.overflow = 'auto';
});

// 点击模态框外部关闭
loginModal.addEventListener('click', (e) => {
  if (e.target === loginModal) {
    loginModal.classList.remove('active');
    document.body.style.overflow = 'auto';
  }
});

// 立即体验按钮打开登录模态框
playBtn.addEventListener('click', () => {
  loginModal.classList.add('active');
  document.body.style.overflow = 'hidden';
});

// 登录选项卡切换
const authTabs = document.querySelectorAll('.auth-tab');
const authPanels = document.querySelectorAll('.auth-panel');

authTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    const type = tab.getAttribute('data-type');
    
    // 移除所有选项卡的活动状态
    authTabs.forEach(t => t.classList.remove('active'));
    // 添加当前选项卡的活动状态
    tab.classList.add('active');
    
    // 隐藏所有面板
    authPanels.forEach(panel => panel.classList.remove('active'));
    // 显示当前面板
    document.querySelector(`.auth-panel[data-type="${type}"]`).classList.add('active');
  });
});

// 验证码倒计时功能
const btnSendCode = document.getElementById('btn-send-code');
const btnSendEmailCode = document.getElementById('btn-send-email-code');

function startCountdown(button) {
  let countdown = 60;
  button.disabled = true;
  button.textContent = `${countdown}秒后重新发送`;
  
  const timer = setInterval(() => {
    countdown--;
    button.textContent = `${countdown}秒后重新发送`;
    
    if (countdown <= 0) {
      clearInterval(timer);
      button.disabled = false;
      button.textContent = '获取验证码';
    }
  }, 1000);
}

// 手机号验证码
btnSendCode.addEventListener('click', () => {
  const phoneInput = document.getElementById('phone-input');
  const phone = phoneInput.value.trim();
  
  if (!phone) {
    showToast('请输入手机号', 'error');
    return;
  }
  
  if (!/^1[3-9]\d{9}$/.test(phone)) {
    showToast('请输入正确的手机号', 'error');
    return;
  }
  
  // 模拟发送验证码
  showToast('验证码已发送', 'success');
  startCountdown(btnSendCode);
});

// 邮箱验证码
btnSendEmailCode.addEventListener('click', () => {
  const emailInput = document.getElementById('email-input');
  const email = emailInput.value.trim();
  
  if (!email) {
    showToast('请输入邮箱', 'error');
    return;
  }
  
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    showToast('请输入正确的邮箱地址', 'error');
    return;
  }
  
  // 模拟发送验证码
  showToast('验证码已发送', 'success');
  startCountdown(btnSendEmailCode);
});

// 手机号登录
const btnPhoneLogin = document.getElementById('btn-phone-login');
btnPhoneLogin.addEventListener('click', () => {
  const phoneInput = document.getElementById('phone-input');
  const codeInput = document.getElementById('code-input');
  const phone = phoneInput.value.trim();
  const code = codeInput.value.trim();
  
  if (!phone) {
    showToast('请输入手机号', 'error');
    return;
  }
  
  if (!/^1[3-9]\d{9}$/.test(phone)) {
    showToast('请输入正确的手机号', 'error');
    return;
  }
  
  if (!code) {
    showToast('请输入验证码', 'error');
    return;
  }
  
  if (code.length !== 6) {
    showToast('请输入6位验证码', 'error');
    return;
  }
  
  // 模拟登录
  showToast('登录成功', 'success');
  setTimeout(() => {
    loginModal.classList.remove('active');
    document.body.style.overflow = 'auto';
    // 跳转到游戏页面
    window.location.href = 'Lobby_Module/index.html';
  }, 1000);
});

// 邮箱登录
const btnEmailLogin = document.getElementById('btn-email-login');
btnEmailLogin.addEventListener('click', () => {
  const emailInput = document.getElementById('email-input');
  const emailCodeInput = document.getElementById('email-code-input');
  const email = emailInput.value.trim();
  const code = emailCodeInput.value.trim();
  
  if (!email) {
    showToast('请输入邮箱', 'error');
    return;
  }
  
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    showToast('请输入正确的邮箱地址', 'error');
    return;
  }
  
  if (!code) {
    showToast('请输入验证码', 'error');
    return;
  }
  
  if (code.length !== 6) {
    showToast('请输入6位验证码', 'error');
    return;
  }
  
  // 模拟登录
  showToast('登录成功', 'success');
  setTimeout(() => {
    loginModal.classList.remove('active');
    document.body.style.overflow = 'auto';
    // 跳转到游戏页面
    window.location.href = 'Lobby_Module/index.html';
  }, 1000);
});

// 社交登录
const socialButtons = document.querySelectorAll('.btn-social');
socialButtons.forEach(button => {
  button.addEventListener('click', () => {
    const platform = button.getAttribute('data-platform');
    showToast(`${platform === 'wechat' ? '微信' : platform === 'alipay' ? '支付宝' : '抖音'}登录中...`, 'success');
    
    // 模拟登录
    setTimeout(() => {
      showToast('登录成功', 'success');
      setTimeout(() => {
        loginModal.classList.remove('active');
        document.body.style.overflow = 'auto';
        // 跳转到游戏页面
        window.location.href = 'Lobby_Module/index.html';
      }, 1000);
    }, 1500);
  });
});

// 访客模式
const btnGuest = document.getElementById('btn-guest');
btnGuest.addEventListener('click', () => {
  showToast('进入访客模式', 'success');
  setTimeout(() => {
    loginModal.classList.remove('active');
    document.body.style.overflow = 'auto';
    // 跳转到游戏页面
    window.location.href = 'Lobby_Module/index.html';
  }, 1000);
});

// 提示消息
function showToast(message, type = 'info') {
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;
  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.style.animation = 'toastSlideIn 0.3s ease reverse';
    setTimeout(() => {
      document.body.removeChild(toast);
    }, 300);
  }, 3000);
}

// 导航栏滚动效果
const header = document.querySelector('.header');
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    header.style.background = 'rgba(255, 255, 255, 0.98)';
    header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
  } else {
    header.style.background = 'rgba(255, 255, 255, 0.95)';
    header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
  }
});

// 平滑滚动
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const targetId = this.getAttribute('href');
    const targetElement = document.querySelector(targetId);
    
    if (targetElement) {
      const headerHeight = header.offsetHeight;
      const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
      
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    }
  });
});

// 了解更多按钮
const learnMoreBtn = document.getElementById('learn-more-btn');
if (learnMoreBtn) {
  learnMoreBtn.addEventListener('click', () => {
    const featuresSection = document.getElementById('features');
    if (featuresSection) {
      const headerHeight = header.offsetHeight;
      const targetPosition = featuresSection.getBoundingClientRect().top + window.pageYOffset - headerHeight;
      
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    }
  });
}

// 页面加载动画
window.addEventListener('load', () => {
  document.body.classList.add('loaded');
});

// 响应式导航
const nav = document.querySelector('.nav');
const menuBtn = document.createElement('button');
menuBtn.className = 'menu-btn';
menuBtn.innerHTML = '☰';
menuBtn.style.display = 'none';
header.querySelector('.header-content').appendChild(menuBtn);

function toggleNav() {
  nav.classList.toggle('active');
}

menuBtn.addEventListener('click', toggleNav);

// 响应式调整
function handleResize() {
  if (window.innerWidth <= 768) {
    menuBtn.style.display = 'block';
    nav.style.display = 'none';
    nav.style.position = 'absolute';
    nav.style.top = '100%';
    nav.style.left = '0';
    nav.style.right = '0';
    nav.style.background = 'var(--white)';
    nav.style.flexDirection = 'column';
    nav.style.padding = '1rem';
    nav.style.boxShadow = '0 10px 20px rgba(0, 0, 0, 0.1)';
    nav.style.zIndex = '999';
  } else {
    menuBtn.style.display = 'none';
    nav.style.display = 'flex';
    nav.style.position = 'static';
    nav.style.flexDirection = 'row';
    nav.style.padding = '0';
    nav.style.boxShadow = 'none';
  }
}

window.addEventListener('resize', handleResize);
handleResize();

// 动画效果
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('fade-in-up');
    }
  });
}, observerOptions);

// 观察需要动画的元素
document.querySelectorAll('.feature-card, .screenshot-item, .hero-text, .hero-image').forEach(el => {
  observer.observe(el);
});