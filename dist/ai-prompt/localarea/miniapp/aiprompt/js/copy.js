(function() {
  'use strict';

  document.addEventListener('click', function(e) {
    var btn = e.target.closest('.copy-btn');
    if (!btn) return;

    var text = btn.getAttribute('data-copy') || '';
    if (!text) return;

    navigator.clipboard.writeText(text).then(function() {
      var copyIcon = btn.querySelector('.copy-icon');
      var checkIcon = btn.querySelector('.check-icon');
      if (copyIcon) copyIcon.style.display = 'none';
      if (checkIcon) checkIcon.style.display = '';
      btn.classList.add('copied');

      setTimeout(function() {
        if (copyIcon) copyIcon.style.display = '';
        if (checkIcon) checkIcon.style.display = 'none';
        btn.classList.remove('copied');
      }, 2000);
    }).catch(function() {
      var ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.left = '-9999px';
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand('copy'); } catch(e) {}
      document.body.removeChild(ta);
    });
  });
})();
