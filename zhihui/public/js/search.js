(function() {
  const searchInput = document.getElementById('template-search');
  const categoryFilter = document.getElementById('category-filter');
  const difficultyFilter = document.getElementById('difficulty-filter');
  if (!searchInput) return;

  const cards = document.querySelectorAll('.template-card');

  function filterCards() {
    const query = searchInput.value.trim().toLowerCase();
    const category = categoryFilter?.value || '';
    const difficulty = difficultyFilter?.value || '';

    cards.forEach(card => {
      let visible = true;
      if (category) {
        const cardCat = card.querySelector('.badge-category')?.textContent;
        const catMatch = cardCat && cardCat.toLowerCase() === category;
        visible = visible && catMatch;
      }
      if (difficulty) {
        const diffEl = card.querySelector('.badge-difficulty');
        const diffMatch = diffEl && diffEl.textContent === difficulty;
        visible = visible && diffMatch;
      }
      if (query) {
        const text = card.textContent.toLowerCase();
        visible = visible && text.includes(query);
      }
      card.style.display = visible ? '' : 'none';
    });

    const visibleCount = document.querySelectorAll('.template-card[style*="display: none"]').length;
    const allHidden = visibleCount === cards.length;
    const empty = document.querySelector('.empty-state');
    if (allHidden && !empty) {
      const el = document.createElement('p');
      el.className = 'empty-state';
      el.textContent = '未找到匹配的模板';
      document.querySelector('.template-grid')?.after(el);
    } else if (!allHidden && empty) {
      empty.remove();
    }
  }

  searchInput.addEventListener('input', filterCards);
  categoryFilter?.addEventListener('change', filterCards);
  difficultyFilter?.addEventListener('change', filterCards);
})();
