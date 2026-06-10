// Homepage — collage magazine motion & interaction
(function() {
  'use strict';

  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return;

  // --- Stagger entrance on load ---
  function staggerEntrance() {
    var targets = document.querySelectorAll('.hero-content, .showcase-card, .step, .cta-block');
    targets.forEach(function(el, i) {
      if (el.classList.contains('stagger-in')) return;
      el.classList.add('stagger-in');
      el.style.animationDelay = (i * 80) + 'ms';
      requestAnimationFrame(function() {
        el.classList.add('visible');
      });
    });
  }

  // --- Intersection Observer for scroll reveals ---
  function initScrollReveal() {
    if (!window.IntersectionObserver) return;
    var revealTargets = document.querySelectorAll('.showcase-card, .step, .cta-block');
    if (!revealTargets.length) return;

    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    revealTargets.forEach(function(el) {
      el.classList.add('stagger-in');
      observer.observe(el);
    });
  }

  // --- Character jump on hero headline hover ---
  function initCharJump() {
    var line2 = document.querySelector('.hero-line-2');
    if (!line2) return;

    var text = line2.textContent;
    var wrapped = '';
    for (var i = 0; i < text.length; i++) {
      wrapped += '<span class="char-jump">' + text[i] + '</span>';
    }
    line2.innerHTML = wrapped;
  }

  // --- Scroll-based reveal for steps watermark ---
  function initWatermarkReveal() {
    if (!window.IntersectionObserver) return;
    var watermarks = document.querySelectorAll('.steps-watermark');
    if (!watermarks.length) return;

    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.style.transition = 'opacity 1.2s ease-out';
          entry.target.style.opacity = '0.06';
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    watermarks.forEach(function(w) { observer.observe(w); });
  }

  // --- Init ---
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      staggerEntrance();
      initScrollReveal();
      initCharJump();
      initWatermarkReveal();
    });
  } else {
    staggerEntrance();
    initScrollReveal();
    initCharJump();
    initWatermarkReveal();
  }
})();
