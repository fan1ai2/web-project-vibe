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
    var tabs = document.querySelectorAll('.auth-tab');

    tabs.forEach(function(t) {
      t.classList.toggle('active', t.dataset.tab === tab);
    });

    if (tab === 'login') {
      if (loginForm) loginForm.style.display = '';
      if (registerForm) registerForm.style.display = 'none';
    } else {
      if (loginForm) loginForm.style.display = 'none';
      if (registerForm) registerForm.style.display = '';
    }
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
      btn.textContent = loading ? '请稍候...' : (form.id === 'loginForm' ? '登录' : '注册');
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
