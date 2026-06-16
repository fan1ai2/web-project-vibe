(function() {
  'use strict';

  function redirect() {
    window.location.href = (window.__BASEPATH || '') + '/login/';
  }

  window.requireAuth = function() {
    if (window.__auth && window.__auth.loggedIn) return true;
    redirect();
    return false;
  };

  document.addEventListener('click', function(e) {
    var gate = e.target.closest('.auth-gate');
    if (!gate) return;
    if (window.__auth && window.__auth.loggedIn) return;
    e.preventDefault();
    redirect();
  });
})();
