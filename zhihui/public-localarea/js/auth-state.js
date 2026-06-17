(function() {
  const basepath = window.__BASEPATH || '';
  const authKey = 'zhihui_auth_token';
  const token = localStorage.getItem(authKey);
  window.__AUTH_TOKEN = token;
  window.__IS_LOGGED_IN = !!token;

  if (token) {
    const navLogin = document.querySelector('.nav-link-login');
    if (navLogin) {
      navLogin.textContent = '我的';
      navLogin.href = basepath + '/dashboard/';
    }
  }
})();
