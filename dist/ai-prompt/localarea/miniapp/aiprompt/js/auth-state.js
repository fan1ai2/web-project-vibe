(function() {
  'use strict';

  window.__auth = { ready: false, loggedIn: false };

  var loginLink = document.querySelector('.nav-link-login');
  if (!loginLink) return;

  var API = window.__API_BASE || (window.location.hostname === 'localhost' ? 'http://localhost:18110/api' : '/api');

  fetch(API + '/me', { credentials: 'include' })
    .then(function(r) { return r.json(); })
    .then(function(res) {
      if (res.code === 200 && res.data && res.data.username) {
        window.__auth.loggedIn = true;
        loginLink.textContent = res.data.username.split('@')[0];
        loginLink.href = '#';
        loginLink.title = '点击退出登录';
        loginLink.classList.add('logged-in');

        loginLink.addEventListener('click', function(e) {
          e.preventDefault();
          fetch(API + '/auth/logout', { method: 'POST', credentials: 'include' })
            .then(function() {
              window.__auth.loggedIn = false;
              loginLink.textContent = '登录';
              loginLink.href = (window.__BASEPATH || '') + '/login/';
              loginLink.classList.remove('logged-in');
              loginLink.title = '';
            });
        });
      }
    })
    .catch(function(err) {
      console.error('auth-state: session check failed', err);
    })
    .finally(function() {
      window.__auth.ready = true;
    });
})();
