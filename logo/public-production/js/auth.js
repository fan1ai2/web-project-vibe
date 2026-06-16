(function() {
  'use strict';

  // Use port 18110 in dev (Hugo on 1313), relative /api in production
  var API = window.location.port === '1313'
    ? window.location.protocol + '//' + window.location.hostname + ':18110'
    : '';

  var currentUser = null;
  var authReadyCallbacks = [];
  var captchaId = '';
  var captchaImage = '';
  var authRequired = false;

  function isLoggedIn() { return !!currentUser; }
  function getUser() { return currentUser; }

  function onAuthReady(fn) {
    if (currentUser !== null) { fn(currentUser); }
    else { authReadyCallbacks.push(fn); }
  }

  function notifyReady(user) {
    authReadyCallbacks.forEach(function(fn) { fn(user); });
    authReadyCallbacks = [];
  }

  function displayName(user) {
    return user.nickname || user.username || '';
  }

  function updateUI() {
    var userEl = document.getElementById('authUser');
    var loginBtn = document.getElementById('authLoginBtn');
    var logoutBtn = document.getElementById('authLogoutBtn');

    if (currentUser) {
      if (userEl) { userEl.textContent = displayName(currentUser); userEl.style.display = ''; }
      if (loginBtn) loginBtn.style.display = 'none';
      if (logoutBtn) logoutBtn.style.display = '';
    } else {
      if (userEl) userEl.style.display = 'none';
      if (loginBtn) loginBtn.style.display = '';
      if (logoutBtn) logoutBtn.style.display = 'none';
    }
  }

  function api(path, method, body) {
    var opts = {
      method: method || 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include'
    };
    if (body) opts.body = JSON.stringify(body);

    return fetch(API + path, opts).then(function(res) {
      return res.json().then(function(data) {
        if (data.code !== 200) throw new Error(data.msg || '请求失败');
        return data.data;
      });
    });
  }

  function showModal(required) {
    authRequired = !!required;
    var modal = document.getElementById('authModal');
    if (modal) { modal.classList.add('open'); refreshCaptcha(); }
  }

  function hideModal() {
    var modal = document.getElementById('authModal');
    if (modal) modal.classList.remove('open');
    if (authRequired && !currentUser) {
      authRequired = false;
      window.location.href = '/';
    }
  }

  function switchTab(tab) {
    var loginForm = document.getElementById('loginForm');
    var registerForm = document.getElementById('registerForm');
    var tabs = document.querySelectorAll('.auth-tab');

    tabs.forEach(function(t) { t.classList.toggle('active', t.dataset.tab === tab); });
    if (loginForm) loginForm.style.display = tab === 'login' ? '' : 'none';
    if (registerForm) registerForm.style.display = tab === 'register' ? '' : 'none';
    [loginForm, registerForm].forEach(function(f) { if (f) setFormError(f, ''); });
    if (tab === 'register') refreshCaptcha();
  }

  function setFormError(form, msg) {
    var el = form.querySelector('.auth-form-error');
    if (el) { el.textContent = msg; el.style.display = msg ? '' : 'none'; }
  }

  function setFormLoading(form, loading) {
    var btn = form.querySelector('button[type="submit"]');
    if (btn) {
      btn.disabled = loading;
      var labels = { 'loginForm': '登录', 'registerForm': '注册' };
      btn.textContent = loading ? '请稍候...' : (labels[form.id] || '提交');
    }
  }

  function refreshCaptcha() {
    api('/api/captcha/generate', 'POST').then(function(data) {
      captchaId = data.captcha_id;
      captchaImage = data.captcha_image;
      var img = document.getElementById('captchaImg');
      if (img) { img.src = captchaImage; img.style.display = ''; }
      var codeInput = document.getElementById('registerCaptcha');
      if (codeInput) codeInput.value = '';
    }).catch(function() {
      // captcha may be disabled server-side, hide the image
      var img = document.getElementById('captchaImg');
      if (img) img.style.display = 'none';
    });
  }

  function init() {
    // Check existing session via /api/me
    api('/api/me').then(function(data) {
      currentUser = data.member;
      updateUI();
      notifyReady(currentUser);
    }).catch(function() {
      currentUser = null;
      updateUI();
      notifyReady(null);
    });

    // Modal events
    var modal = document.getElementById('authModal');
    if (modal) {
      modal.addEventListener('click', function(e) { if (e.target === modal) hideModal(); });
    }

    // Login button
    var loginBtn = document.getElementById('authLoginBtn');
    if (loginBtn) {
      loginBtn.addEventListener('click', function() { showModal(); switchTab('login'); });
    }

    // Logout button
    var logoutBtn = document.getElementById('authLogoutBtn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', function() {
        api('/api/auth/logout', 'POST').then(function() {
          currentUser = null;
          updateUI();
          window.location.reload();
        }).catch(function() {
          currentUser = null;
          updateUI();
          window.location.reload();
        });
      });
    }

    // Tab switching
    document.addEventListener('click', function(e) {
      var tab = e.target.closest('.auth-tab');
      if (tab) switchTab(tab.dataset.tab);
    });

    var closeBtn = document.getElementById('authModalClose');
    if (closeBtn) closeBtn.addEventListener('click', hideModal);

    // Login form
    var loginForm = document.getElementById('loginForm');
    if (loginForm) {
      loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        setFormError(loginForm, '');
        setFormLoading(loginForm, true);

        var username = loginForm.querySelector('[name="username"]').value.trim();
        var password = loginForm.querySelector('[name="password"]').value;

        if (!username) { setFormError(loginForm, '请输入用户名'); setFormLoading(loginForm, false); return; }
        if (!password) { setFormError(loginForm, '请输入密码'); setFormLoading(loginForm, false); return; }

        api('/api/auth/login', 'POST', { username: username, password: password })
          .then(function(data) {
            currentUser = data.member;
            updateUI();
            hideModal();
            if (window._onAuthSuccess) window._onAuthSuccess();
          })
          .catch(function(err) {
            setFormError(loginForm, err.message);
            setFormLoading(loginForm, false);
          });
      });
    }

    // Register form
    var registerForm = document.getElementById('registerForm');
    if (registerForm) {
      registerForm.addEventListener('submit', function(e) {
        e.preventDefault();
        setFormError(registerForm, '');
        setFormLoading(registerForm, true);

        var username = registerForm.querySelector('[name="username"]').value.trim();
        var password = registerForm.querySelector('[name="password"]').value;
        var confirm = registerForm.querySelector('[name="confirm"]').value;
        var captchaCode = registerForm.querySelector('[name="captchaCode"]');

        if (!username) { setFormError(registerForm, '请输入用户名'); setFormLoading(registerForm, false); return; }
        if (password.length < 6) { setFormError(registerForm, '密码至少 6 位'); setFormLoading(registerForm, false); return; }
        if (password !== confirm) { setFormError(registerForm, '两次密码输入不一致'); setFormLoading(registerForm, false); return; }
        if (captchaId && captchaCode && !captchaCode.value.trim()) {
          setFormError(registerForm, '请输入验证码'); setFormLoading(registerForm, false); return;
        }

        var body = { username: username, password: password };
        if (captchaId) { body.captchaId = captchaId; body.captchaCode = captchaCode ? captchaCode.value.trim() : ''; }

        api('/api/auth/register', 'POST', body)
          .then(function(data) {
            // Auto-login after registration
            return api('/api/auth/login', 'POST', { username: username, password: password });
          })
          .then(function(data) {
            currentUser = data.member;
            updateUI();
            hideModal();
            if (window._onAuthSuccess) window._onAuthSuccess();
          })
          .catch(function(err) {
            setFormError(registerForm, err.message);
            setFormLoading(registerForm, false);
            refreshCaptcha();
          });
      });
    }

    // Captcha click to refresh
    var captchaImg = document.getElementById('captchaImg');
    if (captchaImg) {
      captchaImg.addEventListener('click', refreshCaptcha);
    }
  }

  // Expose
  window.LogoForgeAuth = {
    isLoggedIn: isLoggedIn,
    getUser: getUser,
    onAuthReady: onAuthReady,
    showModal: showModal,
    hideModal: hideModal,
    logout: function() {
      api('/api/auth/logout', 'POST').then(function() {
        currentUser = null;
        updateUI();
      }).catch(function() {
        currentUser = null;
        updateUI();
      });
    }
  };

  init();
})();
