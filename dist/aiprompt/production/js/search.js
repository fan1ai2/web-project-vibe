(function() {
  'use strict';

  // Hero search — must run before the early return below
  var heroInput = document.getElementById('hero-search-input');
  var heroBtn = document.getElementById('hero-search-btn');
  if (heroInput && heroBtn) {
    function doHeroSearch() {
      window.location.href = (window.__BASEPATH || '') + '/tools/prompt-generator/';
    }
    heroBtn.addEventListener('click', doHeroSearch);
    heroInput.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') doHeroSearch();
    });
  }

  var searchInput = document.getElementById('prompts-search');
  var grid = document.getElementById('prompts-grid');
  if (!searchInput || !grid) return;

  var CARDS = Array.from(grid.querySelectorAll('.prompt-card'));
  if (!CARDS.length) return;

  var INDEX = CARDS.map(function(card) {
    var title = (card.querySelector('.prompt-card-title') || {}).textContent || '';
    var desc = (card.querySelector('.prompt-card-desc') || {}).textContent || '';
    var tags = Array.from(card.querySelectorAll('.tag')).map(function(t) { return t.textContent; });
    return {
      card: card,
      text: (title + ' ' + desc + ' ' + tags.join(' ')).toLowerCase()
    };
  });

  var lastQuery = '';

  function filter(query) {
    var q = query.toLowerCase().trim();
    if (q === lastQuery) return;
    lastQuery = q;
    INDEX.forEach(function(item) {
      if (!q || item.text.indexOf(q) !== -1) {
        item.card.style.display = '';
      } else {
        item.card.style.display = 'none';
      }
    });
  }

  searchInput.addEventListener('input', function() {
    filter(this.value);
  });

  if (window.location.search) {
    var params = new URLSearchParams(window.location.search);
    var q = params.get('q');
    if (q && searchInput) {
      searchInput.value = q;
      filter(q);
    }
  }
})();
