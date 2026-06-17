(function() {
  const script = document.createElement('script');
  script.src = 'https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js';
  script.onload = () => {
    mermaid.initialize({ startOnLoad: false, theme: 'default' });

    const codeEl = document.getElementById('mermaid-code');
    const previewEl = document.getElementById('mermaid-preview');
    if (codeEl && previewEl) {
      renderMermaid(codeEl.textContent, previewEl);
    }

    const aiResultCode = document.getElementById('ai-result-code');
    const aiResultPreview = document.getElementById('ai-result-preview');
    if (aiResultCode && aiResultPreview) {
      const observer = new MutationObserver(() => {
        const code = aiResultCode.textContent;
        if (code && code.trim()) {
          renderMermaid(code, aiResultPreview);
        }
      });
      observer.observe(aiResultCode, { childList: true, characterData: true, subtree: true });
    }
  };
  document.head.appendChild(script);

  window.renderMermaid = async function(code, container) {
    try {
      const id = 'mermaid-' + Math.random().toString(36).substr(2, 9);
      const { svg } = await mermaid.render(id, code);
      container.innerHTML = svg;
    } catch (e) {
      container.innerHTML = '<p style="color:var(--color-text-secondary)">图表渲染失败，请检查代码</p>';
    }
  };

  document.getElementById('ai-submit-btn')?.addEventListener('click', () => {
    const input = document.getElementById('ai-input-field');
    const chartType = document.getElementById('ai-chart-type');
    const panel = document.getElementById('ai-result-panel');
    const codeEl = document.getElementById('ai-result-code');
    const previewEl = document.getElementById('ai-result-preview');

    if (!input.value.trim()) return;

    const apiBase = window.__API_BASE || '/api';
    panel.hidden = false;
    codeEl.textContent = '生成中...';

    fetch(apiBase + '/generate-diagram', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: input.value, type: chartType.value })
    })
    .then(r => r.json())
    .then(data => {
      if (data.code) {
        codeEl.textContent = data.code;
        renderMermaid(data.code, previewEl);
      } else {
        codeEl.textContent = '# 生成失败: ' + (data.error || '未知错误');
      }
    })
    .catch(err => {
      codeEl.textContent = '# 请求失败: ' + err.message;
    });
  });

  document.getElementById('ai-close-result')?.addEventListener('click', () => {
    document.getElementById('ai-result-panel').hidden = true;
  });

  document.getElementById('ai-input-field')?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      document.getElementById('ai-submit-btn')?.click();
    }
  });

  const exportBtn = document.getElementById('ai-export-png') || document.getElementById('export-mermaid');
  exportBtn?.addEventListener('click', () => {
    const preview = document.getElementById('ai-result-preview') || document.getElementById('mermaid-preview');
    if (!preview) return;
    const loadHtml2canvas = () => new Promise((resolve) => {
      if (window.html2canvas) return resolve();
      const s = document.createElement('script');
      s.src = 'https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js';
      s.onload = resolve;
      document.head.appendChild(s);
    });
    loadHtml2canvas().then(() => {
      html2canvas(preview).then(canvas => {
        const link = document.createElement('a');
        link.download = 'diagram.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
      });
    });
  });
})();
