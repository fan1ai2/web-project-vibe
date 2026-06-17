document.addEventListener('click', function(e) {
  const btn = e.target.closest('[data-copy]');
  if (!btn) return;
  const target = document.querySelector(btn.dataset.copy);
  if (!target) return;
  const text = target.textContent || target.value;
  navigator.clipboard.writeText(text).then(() => {
    const orig = btn.textContent;
    btn.textContent = '已复制!';
    setTimeout(() => btn.textContent = orig, 2000);
  });
});

document.getElementById('copy-mermaid')?.addEventListener('click', () => {
  const code = document.getElementById('mermaid-code')?.textContent;
  if (code) navigator.clipboard.writeText(code).then(() => {
    const btn = document.getElementById('copy-mermaid');
    btn.textContent = '已复制!';
    setTimeout(() => btn.textContent = '复制代码', 2000);
  });
});

document.getElementById('ai-copy-code')?.addEventListener('click', () => {
  const code = document.getElementById('ai-result-code')?.textContent;
  if (code) navigator.clipboard.writeText(code).then(() => {
    const btn = document.getElementById('ai-copy-code');
    btn.textContent = '已复制!';
    setTimeout(() => btn.textContent = '复制代码', 2000);
  });
});
