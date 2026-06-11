(function() {
  'use strict';

  var API = 'http://localhost:8080';
  var TOKEN_KEY = 'logoforge_token';
  var USER_KEY = 'logoforge_user';

  var currentUser = null;
  var authReadyCallbacks = [];

  function getToken() {
    return localStorage.getItem(TOKEN_KEY);
  }

  function setAuth(token, user) {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    currentUser = user;
    updateUI();
  }

  function clearAuth() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    currentUser = null;
    updateUI();
  }

  function isLoggedIn() {
    return !!getToken();
  }

  function getUser() {
    if (currentUser) return currentUser;
    try {
      var u = JSON.parse(localStorage.getItem(USER_KEY));
      if (u) currentUser = u;
    } catch(e) {}
    return currentUser;
  }

  function onAuthReady(fn) {
    if (currentUser !== undefined) {
      fn(currentUser);
    } else {
      authReadyCallbacks.push(fn);
    }
  }

  function notifyReady(user) {
    authReadyCallbacks.forEach(function(fn) { fn(user); });
    authReadyCallbacks = [];
  }

  function updateUI() {
    var userEl = document.getElementById('authUser');
    var loginBtn = document.getElementById('authLoginBtn');
    var logoutBtn = document.getElementById('authLogoutBtn');

    if (currentUser) {
      if (userEl) {
        userEl.textContent = currentUser.email;
        userEl.style.display = '';
      }
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
      headers: { 'Content-Type': 'application/json' }
    };
    var token = getToken();
    if (token) opts.headers['Authorization'] = 'Bearer ' + token;
    if (body) opts.body = JSON.stringify(body);

    return fetch(API + path, opts).then(function(res) {
      return res.json().then(function(data) {
        if (!res.ok) throw new Error(data.error || '请求失败');
        return data;
      });
    });
  }

  function showModal() {
    var modal = document.getElementById('authModal');
    if (modal) modal.classList.add('open');
  }

  function hideModal() {
    var modal = document.getElementById('authModal');
    if (modal) modal.classList.remove('open');
  }

  function switchTab(tab) {
    var loginForm = document.getElementById('loginForm');
    var registerForm = document.getElementById('registerForm');
    var codeForm = document.getElementById('codeForm');
    var tabs = document.querySelectorAll('.auth-tab');

    tabs.forEach(function(t) {
      t.classList.toggle('active', t.dataset.tab === tab);
    });

    if (loginForm) loginForm.style.display = tab === 'login' ? '' : 'none';
    if (codeForm) codeForm.style.display = tab === 'code' ? '' : 'none';
    if (registerForm) registerForm.style.display = tab === 'register' ? '' : 'none';

    // Clear errors on tab switch
    [loginForm, registerForm, codeForm].forEach(function(f) {
      if (f) setFormError(f, '');
    });
  }

  function setFormError(form, msg) {
    var el = form.querySelector('.auth-form-error');
    if (el) {
      el.textContent = msg;
      el.style.display = msg ? '' : 'none';
    }
  }

  function setFormLoading(form, loading) {
    var btn = form.querySelector('button[type="submit"]');
    if (btn) {
      btn.disabled = loading;
      var labels = {
        'loginForm': '登录',
        'registerForm': '注册',
        'codeForm': '验证登录'
      };
      var label = labels[form.id] || '提交';
      btn.textContent = loading ? '请稍候...' : label;
    }
  }

  function init() {
    var token = getToken();
    if (token) {
      api('/api/me').then(function(user) {
        currentUser = user;
        updateUI();
        notifyReady(user);
      }).catch(function() {
        clearAuth();
        notifyReady(null);
      });
    } else {
      currentUser = null;
      notifyReady(null);
    }

    // Modal events
    var modal = document.getElementById('authModal');
    if (modal) {
      modal.addEventListener('click', function(e) {
        if (e.target === modal) hideModal();
      });
    }

    // Login button
    var loginBtn = document.getElementById('authLoginBtn');
    if (loginBtn) {
      loginBtn.addEventListener('click', function() {
        showModal();
        switchTab('login');
      });
    }

    // Logout button
    var logoutBtn = document.getElementById('authLogoutBtn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', function() {
        clearAuth();
        window.location.reload();
      });
    }

    // Tab switching
    document.addEventListener('click', function(e) {
      var tab = e.target.closest('.auth-tab');
      if (tab) switchTab(tab.dataset.tab);
    });

    // Close modal button
    var closeBtn = document.getElementById('authModalClose');
    if (closeBtn) {
      closeBtn.addEventListener('click', hideModal);
    }

    // Login form
    var loginForm = document.getElementById('loginForm');
    if (loginForm) {
      loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        setFormError(loginForm, '');
        setFormLoading(loginForm, true);

        var email = loginForm.querySelector('[name="email"]').value;
        var password = loginForm.querySelector('[name="password"]').value;

        api('/api/login', 'POST', { email: email, password: password })
          .then(function(data) {
            setAuth(data.token, data.user);
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

        var email = registerForm.querySelector('[name="email"]').value;
        var password = registerForm.querySelector('[name="password"]').value;
        var confirm = registerForm.querySelector('[name="confirm"]').value;

        if (password !== confirm) {
          setFormError(registerForm, '两次密码输入不一致');
          setFormLoading(registerForm, false);
          return;
        }

        if (password.length < 6) {
          setFormError(registerForm, '密码至少 6 位');
          setFormLoading(registerForm, false);
          return;
        }

        api('/api/register', 'POST', { email: email, password: password })
          .then(function(data) {
            setAuth(data.token, data.user);
            hideModal();
            if (window._onAuthSuccess) window._onAuthSuccess();
          })
          .catch(function(err) {
            setFormError(registerForm, err.message);
            setFormLoading(registerForm, false);
          });
      });
    }

    // Send code button
    var sendCodeBtn = document.getElementById('sendCodeBtn');
    var codeTimer = null;
    if (sendCodeBtn) {
      sendCodeBtn.addEventListener('click', function() {
        var emailEl = document.getElementById('codeEmail');
        if (!emailEl || !emailEl.value) {
          var codeForm = document.getElementById('codeForm');
          setFormError(codeForm, '请先输入邮箱地址');
          return;
        }
        // Mock: simulate sending code
        sendCodeBtn.disabled = true;
        var secs = 60;
        sendCodeBtn.textContent = secs + 's 后重发';
        codeTimer = setInterval(function() {
          secs--;
          if (secs <= 0) {
            clearInterval(codeTimer);
            sendCodeBtn.disabled = false;
            sendCodeBtn.textContent = '发送验证码';
          } else {
            sendCodeBtn.textContent = secs + 's 后重发';
          }
        }, 1000);
      });
    }

    // Code form
    var codeForm = document.getElementById('codeForm');
    if (codeForm) {
      codeForm.addEventListener('submit', function(e) {
        e.preventDefault();
        setFormError(codeForm, '');
        setFormLoading(codeForm, true);

        var email = codeForm.querySelector('[name="email"]').value;
        var code = codeForm.querySelector('[name="code"]').value;

        // Mock verification: accept any 6-digit code
        if (code.length !== 6) {
          setFormError(codeForm, '请输入 6 位验证码');
          setFormLoading(codeForm, false);
          return;
        }

        api('/api/login', 'POST', { email: email, password: code })
          .then(function(data) {
            setAuth(data.token, data.user);
            hideModal();
            if (window._onAuthSuccess) window._onAuthSuccess();
          })
          .catch(function() {
            // Mock fallback: create demo session
            setAuth('demo-token', { email: email });
            hideModal();
            if (window._onAuthSuccess) window._onAuthSuccess();
          });
      });
    }
  }

  // Expose
  window.LogoForgeAuth = {
    isLoggedIn: isLoggedIn,
    getUser: getUser,
    getToken: getToken,
    onAuthReady: onAuthReady,
    showModal: showModal,
    hideModal: hideModal,
    logout: clearAuth
  };

  init();
})();
