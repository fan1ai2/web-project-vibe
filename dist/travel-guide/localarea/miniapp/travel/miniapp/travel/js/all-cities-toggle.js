(function () {
  var btn = document.getElementById('toggle-all-cities');
  var section = document.getElementById('all-cities-full');
  var featured = document.getElementById('cities-featured');
  if (!btn || !section) return;

  var expanded = false;

  function isLoggedIn() {
    var userStr = localStorage.getItem('user');
    if (!userStr) return false;
    try {
      var user = JSON.parse(userStr);
      return !!user;
    } catch (e) {
      return false;
    }
  }

  btn.addEventListener('click', function () {
    if (!expanded && !isLoggedIn()) {
      window.location.href = (window.__BASEPATH || '') + '/login/?redirect=' + encodeURIComponent(window.location.pathname);
      return;
    }

    expanded = !expanded;
    section.hidden = !expanded;
    if (featured) featured.hidden = expanded;
    btn.classList.toggle('expanded', expanded);
    btn.setAttribute('aria-expanded', String(expanded));
    btn.querySelector('.btn-toggle-text').textContent = expanded ? '收起' : '查看全部城市';
    var icon = btn.querySelector('.btn-toggle-icon');
    if (icon) {
      icon.textContent = expanded ? '▲' : '▼';
    }
    if (expanded) section.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
})();
