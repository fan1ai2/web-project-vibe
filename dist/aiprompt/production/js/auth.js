(function() {
  'use strict';

  var container = document.getElementById('auth-container');
  if (!container) return;

  // ===== API helpers =====
  var API = window.__API_BASE || (window.location.hostname === 'localhost' ? 'http://localhost:18110/api' : '/api');

  function api(path, method, body) {
    var opts = {
      method: method,
      headers: { 'Content-Type': 'application/json' },
      credentials: 'same-origin'
    };
    if (body) opts.body = JSON.stringify(body);
    opts.credentials = 'include';
    return fetch(API + path, opts).then(function(r) { return r.json(); });
  }

  // ===== State =====
  var currentMode = 'login';
  var captchaId = '';

  // ===== DOM refs =====
  var tabLogin = container.querySelector('[data-tab="login"]');
  var tabRegister = container.querySelector('[data-tab="register"]');
  var formLogin = container.querySelector('#auth-form-login');
  var formRegister = container.querySelector('#auth-form-register');
  var captchaInputs = container.querySelectorAll('.captcha-input');
  var msgError = container.querySelector('#auth-error');
  var msgSuccess = container.querySelector('#auth-success');
  var switchLinks = container.querySelectorAll('.auth-switch a');

  // ===== Helpers =====
  function clearMessage() {
    msgError.textContent = '';
    msgSuccess.textContent = '';
  }

  function showError(msg) {
    msgError.textContent = msg;
    msgSuccess.textContent = '';
  }

  function showSuccess(msg) {
    msgSuccess.textContent = msg;
    msgError.textContent = '';
  }

  // ===== Tab switching =====
  function switchTab(mode) {
    currentMode = mode;
    if (mode === 'login') {
      tabLogin.classList.add('active');
      tabRegister.classList.remove('active');
      formLogin.classList.remove('hidden');
      formRegister.classList.add('hidden');
    } else {
      tabRegister.classList.add('active');
      tabLogin.classList.remove('active');
      formRegister.classList.remove('hidden');
      formLogin.classList.add('hidden');
    }
    clearMessage();
    loadCaptcha();
  }

  tabLogin.addEventListener('click', function() { switchTab('login'); });
  tabRegister.addEventListener('click', function() { switchTab('register'); });
  switchLinks.forEach(function(link) {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      switchTab(link.getAttribute('data-switch'));
    });
  });

  // ===== Captcha =====
  var captchaImgs = container.querySelectorAll('.captcha-img');

  function loadCaptcha() {
    if (!captchaImgs.length) return;
    captchaImgs.forEach(function(img) { img.style.display = 'none'; });
    api('/captcha/generate', 'POST').then(function(res) {
      if (res.code === 200 && res.data) {
        captchaId = res.data.captcha_id || '';
        var src = res.data.captcha_image || '';
        captchaImgs.forEach(function(img) {
          if (src) { img.src = src; img.style.display = ''; }
        });
      } else {
        showError('验证码加载失败: ' + (res.msg || '未知错误'));
      }
    }).catch(function(err) {
      showError('验证码请求失败，请检查网络');
      console.error(err);
    });
  }

  captchaImgs.forEach(function(img) {
    img.addEventListener('click', loadCaptcha);
    img.style.cursor = 'pointer';
  });

  // ===== Login =====
  formLogin.addEventListener('submit', function(e) {
    e.preventDefault();
    clearMessage();

    var username = formLogin.querySelector('[name="email"]').value.trim();
    var password = formLogin.querySelector('[name="password"]').value;

    if (!username) { showError('请输入邮箱地址'); return; }
    if (!password) { showError('请输入密码'); return; }

    api('/auth/login', 'POST', {
      username: username,
      password: password
    }).then(function(res) {
      if (res.code === 200) {
        showSuccess('登录成功！正在跳转...');
        setTimeout(function() { window.location.href = (window.__BASEPATH || '') + '/'; }, 600);
      } else {
        showError(res.msg || '登录失败');
      }
    }).catch(function(err) {
      showError('登录请求失败，请检查网络');
      console.error(err);
    });
  });

  // ===== Register =====
  formRegister.addEventListener('submit', function(e) {
    e.preventDefault();
    clearMessage();

    var username = formRegister.querySelector('[name="email"]').value.trim();
    var password = formRegister.querySelector('[name="password"]').value;
    var confirm = formRegister.querySelector('[name="confirm"]').value;
    var captcha = formRegister.querySelector('.captcha-input').value.trim();

    if (!username) { showError('请输入邮箱地址'); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(username)) { showError('邮箱格式不正确'); return; }
    if (!password || password.length < 6) { showError('密码至少需要6位'); return; }
    if (password !== confirm) { showError('两次密码输入不一致'); return; }
    if (!captcha) { showError('请输入验证码'); return; }

    api('/auth/register', 'POST', {
      username: username,
      password: password,
      captcha_id: captchaId,
      captcha_code: captcha
    }).then(function(res) {
      if (res.code === 200) {
        showSuccess('注册成功！请登录');
        formRegister.reset();
        captchaInputs.forEach(function(inp) { inp.value = ''; });
        loadCaptcha();
        setTimeout(function() { switchTab('login'); }, 1000);
      } else {
        showError(res.msg || '注册失败');
        loadCaptcha();
      }
    }).catch(function(err) {
      showError('注册请求失败，请检查网络');
      console.error(err);
    });
  });

  // ===== Init =====
  loadCaptcha();
})();
