(function() {
  'use strict';
  var hero = document.getElementById('hero-zone');
  if (!hero) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var light = document.createElement('div');
  light.className = 'hero-light';
  light.style.opacity = '0';
  hero.appendChild(light);

  var ticking = false;

  hero.addEventListener('mouseenter', function() {
    light.style.opacity = '1';
  });

  hero.addEventListener('mouseleave', function() {
    light.style.opacity = '0';
  });

  hero.addEventListener('mousemove', function(e) {
    if (!ticking) {
      requestAnimationFrame(function() {
        var rect = hero.getBoundingClientRect();
        var x = ((e.clientX - rect.left) / rect.width * 100).toFixed(1);
        var y = ((e.clientY - rect.top) / rect.height * 100).toFixed(1);
        light.style.background = 'radial-gradient(ellipse 500px 350px at ' + x + '% ' + y + '%, rgba(255,255,255,0.08), transparent 70%)';
        ticking = false;
      });
      ticking = true;
    }
  });
})();
