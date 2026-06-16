// Dark/light theme toggle
(function() {
  'use strict';

  var STORAGE_KEY = 'logoforge-theme';
  var current = localStorage.getItem(STORAGE_KEY) || 'light';

  function applyTheme(theme) {
    if (theme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  }

  // Apply on load to avoid flash
  applyTheme(current);

  document.addEventListener('DOMContentLoaded', function() {
    var btn = document.getElementById('themeToggle');
    if (!btn) return;

    btn.addEventListener('click', function() {
      current = current === 'dark' ? 'light' : 'dark';
      applyTheme(current);
      localStorage.setItem(STORAGE_KEY, current);
    });
  });
})();
