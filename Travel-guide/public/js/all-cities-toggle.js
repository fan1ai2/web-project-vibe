(function () {
  var btn = document.getElementById('toggle-all-cities');
  var section = document.getElementById('all-cities-full');
  if (!btn || !section) return;
  var expanded = false;
  btn.addEventListener('click', function () {
    expanded = !expanded;
    section.hidden = !expanded;
    btn.textContent = expanded ? '收起 ▲' : '查看全部城市';
    btn.setAttribute('aria-expanded', String(expanded));
    if (expanded) section.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
})();
