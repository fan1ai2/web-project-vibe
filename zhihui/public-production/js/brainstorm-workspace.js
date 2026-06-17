(function() {
  const ws = document.getElementById('brainstorm-workspace');
  if (!ws) return;

  const tool = ws.dataset.tool;
  const area = document.getElementById('ws-area');
  const timerDisplay = document.querySelector('.timer-display');

  function initWorkspace() {
    area.innerHTML = '';
    switch (tool) {
      case 'swot':
        createMatrixWorkspace(['优势 Strengths', '劣势 Weaknesses', '机会 Opportunities', '威胁 Threats']);
        break;
      case 'thinking-hats':
        createMatrixWorkspace(['白帽 事实', '红帽 情感', '黑帽 风险', '黄帽 价值', '绿帽 创意', '蓝帽 流程']);
        break;
      case 'journey-map':
        createColumnWorkspace(['阶段1', '阶段2', '阶段3', '阶段4', '阶段5']);
        break;
      case 'five-whys':
        createWhyWorkspace();
        break;
      default:
        createColumnWorkspace(['列1', '列2', '列3']);
    }
    loadState();
  }

  function createMatrixWorkspace(headers) {
    area.style.gridTemplateColumns = `repeat(${Math.ceil(headers.length/2)}, 1fr)`;
    headers.forEach(h => {
      const col = document.createElement('div');
      col.className = 'workspace-col';
      col.innerHTML = `<div class="workspace-col-header">${h}</div>`;
      col.addEventListener('dragover', e => e.preventDefault());
      col.addEventListener('drop', e => {
        e.preventDefault();
        const id = e.dataTransfer.getData('text/plain');
        const sticky = document.getElementById(id);
        if (sticky) col.appendChild(sticky);
        saveState();
      });
      area.appendChild(col);
    });
  }

  function createColumnWorkspace(headers) {
    area.style.gridTemplateColumns = `repeat(${headers.length}, 1fr)`;
    headers.forEach(h => {
      const col = document.createElement('div');
      col.className = 'workspace-col';
      col.innerHTML = `<div class="workspace-col-header">${h}</div>`;
      col.addEventListener('dragover', e => e.preventDefault());
      col.addEventListener('drop', e => {
        e.preventDefault();
        const id = e.dataTransfer.getData('text/plain');
        const sticky = document.getElementById(id);
        if (sticky) col.appendChild(sticky);
        saveState();
      });
      area.appendChild(col);
    });
  }

  function createWhyWorkspace() {
    area.style.gridTemplateColumns = '1fr';
    const col = document.createElement('div');
    col.className = 'workspace-col';
    col.innerHTML = '<div class="workspace-col-header">5 Why 根因分析</div>' +
      Array.from({length:5}, (_,i) => `<div class="workspace-sticky" contenteditable="true" draggable="true" id="why-${i}">Why ${i+1}: 点击输入...</div>`).join('');
    col.addEventListener('dragover', e => e.preventDefault());
    col.addEventListener('drop', e => { e.preventDefault(); const id = e.dataTransfer.getData('text/plain'); const s = document.getElementById(id); if (s) col.appendChild(s); saveState(); });
    area.appendChild(col);
  }

  document.getElementById('ws-add-card')?.addEventListener('click', () => {
    const cols = area.querySelectorAll('.workspace-col');
    if (cols.length === 0) return;
    const sticky = document.createElement('div');
    sticky.className = 'workspace-sticky';
    sticky.contentEditable = 'true';
    sticky.draggable = 'true';
    sticky.id = 'sticky-' + Date.now();
    sticky.textContent = '新便签';
    sticky.addEventListener('dragstart', e => {
      e.dataTransfer.setData('text/plain', sticky.id);
      sticky.style.opacity = '0.5';
    });
    sticky.addEventListener('dragend', () => { sticky.style.opacity = '1'; saveState(); });
    sticky.addEventListener('input', saveState);
    cols[0].appendChild(sticky);
    sticky.focus();
    saveState();
  });

  document.getElementById('ws-reset')?.addEventListener('click', () => {
    if (confirm('确定清空所有内容？')) {
      localStorage.removeItem('zhihui_ws_' + tool);
      initWorkspace();
    }
  });

  document.getElementById('ws-export-png')?.addEventListener('click', () => {
    const s = document.createElement('script');
    s.src = 'https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js';
    s.onload = () => html2canvas(area).then(c => { const a = document.createElement('a'); a.download = 'brainstorm.png'; a.href = c.toDataURL(); a.click(); });
    document.head.appendChild(s);
  });

  document.getElementById('ws-copy-text')?.addEventListener('click', () => {
    const text = Array.from(area.querySelectorAll('.workspace-sticky')).map(s => s.textContent).join('\n');
    navigator.clipboard.writeText(text).then(() => {
      const btn = document.getElementById('ws-copy-text');
      btn.textContent = '已复制!';
      setTimeout(() => btn.textContent = '复制结果', 2000);
    });
  });

  let timerInterval;
  let timerSeconds = 25 * 60;
  document.getElementById('ws-timer-start')?.addEventListener('click', function() {
    if (timerInterval) { clearInterval(timerInterval); timerInterval = null; this.textContent = '开始计时'; return; }
    this.textContent = '暂停';
    timerInterval = setInterval(() => {
      timerSeconds--;
      const m = Math.floor(timerSeconds / 60);
      const s = timerSeconds % 60;
      if (timerDisplay) timerDisplay.textContent = `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
      if (timerSeconds <= 0) { clearInterval(timerInterval); timerInterval = null; this.textContent = '开始计时'; }
    }, 1000);
  });

  function saveState() {
    const html = area.innerHTML;
    localStorage.setItem('zhihui_ws_' + tool, html);
  }

  function loadState() {
    const saved = localStorage.getItem('zhihui_ws_' + tool);
    if (saved) area.innerHTML = saved;
    area.querySelectorAll('.workspace-sticky').forEach(sticky => {
      sticky.addEventListener('dragstart', e => {
        e.dataTransfer.setData('text/plain', sticky.id);
        sticky.style.opacity = '0.5';
      });
      sticky.addEventListener('dragend', () => { sticky.style.opacity = '1'; saveState(); });
      sticky.addEventListener('input', saveState);
    });
  }

  initWorkspace();
})();
