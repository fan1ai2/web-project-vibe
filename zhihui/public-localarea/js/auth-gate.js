(function() {
  const basepath = window.__BASEPATH || '';
  const protectedPages = ['/dashboard/', '/settings/'];
  const currentPath = window.location.pathname;

  const isProtected = protectedPages.some(p => currentPath.includes(p));
  if (isProtected && !window.__IS_LOGGED_IN) {
    window.location.href = basepath + '/login/';
  }
})();
