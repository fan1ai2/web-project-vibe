// User navigation state management
(function() {
  'use strict';

  var navLinks = document.querySelector('.nav-links');
  if (!navLinks) return;

  var userStr = localStorage.getItem('user');
  var user = null;
  try { user = JSON.parse(userStr); } catch(e) {}

  // Find the login link
  var loginLink = navLinks.querySelector('.nav-login-btn');
  if (!loginLink) return;

  if (user) {
    // User is logged in — replace login link with user menu
    var li = loginLink.parentElement;
    li.innerHTML = '<span class="nav-user-name">' + (user.username || user.email || user.nickname || '用户') + '</span>' +
      '<a href="#" class="nav-logout-btn" id="nav-logout-btn">退出</a>';
    li.classList.add('nav-user-menu');

    document.getElementById('nav-logout-btn').addEventListener('click', function(e) {
      e.preventDefault();
      API.logout().catch(function(){}); // Fire-and-forget API logout
      localStorage.removeItem('user');
      window.location.reload();
    });
  } else {
    // Ensure login link is visible
    loginLink.href = (window.__BASEPATH || '') + '/login/';
    loginLink.textContent = '登录 / 注册';
  }
})();
