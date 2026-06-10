(function() {
  'use strict';

  var state = {
    industry: null,
    style: null,
    colorScheme: [],
    fontStyle: null,
    layoutType: null,
    brandName: '',
    extraConditions: '',
    history: [],
    isGenerating: false
  };

  var $ = function(sel) { return document.querySelector(sel); };
  var $$ = function(sel) { return document.querySelectorAll(sel); };

  var brandInput = $('#brandName');
  var charCount = $('#charCount');
  var generateBtn = $('#generateBtn');
  var generateBtnOverflow = $('#generateBtnOverflow');
  var previewCanvas = $('#previewCanvas');
  var canvasWrapper = document.querySelector('.preview-canvas-wrapper');
  var previewEmpty = $('#previewEmpty');
  var previewTemplate = $('#previewTemplate');
  var previewLoading = $('#previewLoading');
  var previewResult = $('#previewResult');
  var previewSvg = $('#previewSvg');
  var previewPrompt = $('#previewPrompt');
  var promptCode = $('#promptCode');
  var resultImage = $('#resultImage');
  var historyList = $('#historyList');
  var filterPanel = $('#filterPanel');

  function init() {
    if (brandInput) {
      brandInput.addEventListener('input', function() {
        state.brandName = this.value.trim();
        if (charCount) charCount.textContent = this.value.length + '/20';
        updateGenerateButton();
        updatePreview();
      });
    }

    var extraEl = $('#extraConditions');
    if (extraEl) {
      extraEl.addEventListener('input', function() {
        state.extraConditions = this.value.trim();
        updatePreview();
      });
    }

    $$('[data-dimension]').forEach(function(group) {
      group.addEventListener('click', function(e) {
        var chip = e.target.closest('[data-value]');
        if (!chip) return;
        var dim = group.dataset.dimension;
        var val = chip.dataset.value;

        if (dim === 'colorScheme') {
          handleColorSelect(chip, val);
        } else {
          handleSingleSelect(group, chip, dim, val);
        }
        updatePreview();
        updateGenerateButton();
      });
    });

    if (generateBtn) generateBtn.addEventListener('click', generate);
    if (generateBtnOverflow) generateBtnOverflow.addEventListener('click', generate);

    // Stagger entrance for filter panel
    requestAnimationFrame(function() {
      document.querySelectorAll('.filter-group').forEach(function(g, i) {
        g.classList.add('stagger-in');
        g.style.animationDelay = (i * 80) + 'ms';
        requestAnimationFrame(function() { g.classList.add('visible'); });
      });
    });

    document.addEventListener('click', function(e) {
      var btn = e.target.closest('.copy-btn');
      if (!btn) return;
      var text = btn.dataset.copy;
      if (!text) return;
      navigator.clipboard.writeText(text).then(function() {
        var orig = btn.textContent;
        btn.textContent = '已复制';
        setTimeout(function() { btn.textContent = orig; }, 2000);
      });
    });

    var dlBtn = $('#downloadBtn');
    if (dlBtn) dlBtn.addEventListener('click', downloadResult);
    var shBtn = $('#shareBtn');
    if (shBtn) shBtn.addEventListener('click', shareResult);
    var reBtn = $('#regenerateBtn');
    if (reBtn) reBtn.addEventListener('click', generate);

    loadUrlParams();
    updateGenerateButton();
  }

  function handleSingleSelect(group, chip, dim, val) {
    group.querySelectorAll('.selected').forEach(function(c) { c.classList.remove('selected'); });
    if (state[dim] === val) {
      state[dim] = null;
    } else {
      state[dim] = val;
      chip.classList.add('selected');
    }
  }

  function handleColorSelect(chip, val) {
    var idx = state.colorScheme.indexOf(val);
    if (idx > -1) {
      state.colorScheme.splice(idx, 1);
      chip.classList.remove('selected');
    } else {
      if (state.colorScheme.length >= 2) {
        var oldest = state.colorScheme.shift();
        var oldChip = document.querySelector('[data-dimension="colorScheme"] [data-value="' + oldest + '"]');
        if (oldChip) oldChip.classList.remove('selected');
      }
      state.colorScheme.push(val);
      chip.classList.add('selected');
    }
  }

  function updateGenerateButton() {
    var canGenerate = state.brandName.length > 0 &&
      state.industry && state.style && state.layoutType && state.fontStyle;
    var disabled = !canGenerate || state.isGenerating;
    if (generateBtn) generateBtn.disabled = disabled;
    if (generateBtnOverflow) generateBtnOverflow.disabled = disabled;
  }

  function updatePreview() {
    var hasSelection = state.industry || state.style || state.colorScheme.length ||
      state.fontStyle || state.layoutType;

    if (!hasSelection && !state.brandName) {
      showPreviewState('empty');
      if (previewPrompt) previewPrompt.style.display = 'none';
      return;
    }

    showPreviewState('template');
    renderPreviewSvg();

    var prompt = buildPrompt();
    if (prompt && promptCode) {
      promptCode.textContent = prompt;
      if (previewPrompt) {
        previewPrompt.style.display = 'block';
        var copyBtn = previewPrompt.querySelector('.copy-btn');
        if (copyBtn) copyBtn.dataset.copy = prompt;
      }
    }
  }

  function renderPreviewSvg() {
    if (!previewSvg) return;
    var colors = state.colorScheme.length ? getColorsForScheme(state.colorScheme[0]) : ['#D4532A'];
    var brand = state.brandName || 'Brand';
    var initial = brand.charAt(0).toUpperCase();
    var layout = state.layoutType || '图标型';

    var svg = '';
    if (layout === '图标型') {
      svg = '<circle cx="300" cy="180" r="80" fill="none" stroke="' + colors[0] + '" stroke-width="8"/><polygon points="300,120 340,200 260,200" fill="' + colors[0] + '" opacity="0.8"/>';
    } else if (layout === '文字型') {
      svg = '<text x="300" y="260" text-anchor="middle" font-family="' + getFontFamily(state.fontStyle) + '" font-size="' + (brand.length > 4 ? '56' : '72') + '" font-weight="700" fill="' + colors[0] + '" letter-spacing="0.02em">' + escapeXml(brand) + '</text>';
    } else if (layout === '徽章型') {
      svg = '<circle cx="300" cy="220" r="120" fill="none" stroke="' + colors[0] + '" stroke-width="3"/><circle cx="300" cy="220" r="108" fill="none" stroke="' + colors[0] + '" stroke-width="1" stroke-dasharray="4 3"/><text x="300" y="230" text-anchor="middle" font-family="' + getFontFamily(state.fontStyle) + '" font-size="48" font-weight="700" fill="' + colors[0] + '">' + escapeXml(initial) + '</text>';
    } else {
      svg = '<rect x="180" y="120" width="240" height="240" rx="16" fill="none" stroke="' + colors[0] + '" stroke-width="6"/><text x="300" y="200" text-anchor="middle" font-family="' + getFontFamily(state.fontStyle) + '" font-size="52" font-weight="700" fill="' + colors[0] + '">' + escapeXml(initial) + '</text><text x="300" y="320" text-anchor="middle" font-family="Inter, sans-serif" font-size="20" fill="' + (colors[1] || colors[0]) + '" letter-spacing="0.1em">' + escapeXml(brand) + '</text>';
    }

    previewSvg.innerHTML = svg;
  }

  function showPreviewState(st) {
    if (previewEmpty) previewEmpty.style.display = st === 'empty' ? '' : 'none';
    if (previewTemplate) previewTemplate.style.display = st === 'template' ? '' : 'none';
    if (previewLoading) previewLoading.style.display = st === 'loading' ? '' : 'none';
    if (previewResult) previewResult.style.display = st === 'result' ? '' : 'none';
  }

  function buildPrompt() {
    if (!state.industry && !state.style) return '';
    var parts = [];
    parts.push('A ' + (state.style || 'modern') + ' logo');
    if (state.industry) parts.push('for a ' + state.industry + ' brand');
    if (state.brandName) parts.push('called "' + state.brandName + '"');
    if (state.layoutType) parts.push('in a ' + state.layoutType + ' composition');
    if (state.fontStyle) parts.push('using ' + state.fontStyle + ' typography');
    if (state.extraConditions) parts.push(state.extraConditions);
    parts.push('vector logo design, centered composition, professional brand identity.');
    return parts.join(', ') + '.';
  }

  function generate() {
    if (state.isGenerating || (generateBtn && generateBtn.disabled)) return;

    state.isGenerating = true;
    updateGenerateButton();
    showPreviewState('loading');
    if (previewPrompt) previewPrompt.style.display = 'none';

    // Shake canvas on generate
    if (previewCanvas) {
      previewCanvas.classList.add('shaking');
      setTimeout(function() { previewCanvas.classList.remove('shaking'); }, 500);
    }

    var prompt = buildPrompt();

    setTimeout(function() {
      renderPreviewSvg();
      var svgData = previewSvg ? previewSvg.innerHTML : '';

      var svgBlob = new Blob([
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 500" width="600" height="500">' + svgData + '</svg>'
      ], { type: 'image/svg+xml' });
      var url = URL.createObjectURL(svgBlob);

      if (resultImage) {
        resultImage.src = url;
        resultImage.alt = '生成的 Logo - ' + state.brandName;
        resultImage.classList.remove('reveal');
        void resultImage.offsetWidth;
        resultImage.classList.add('reveal');
      }

      showPreviewState('result');

      if (promptCode) {
        promptCode.textContent = prompt;
      }
      if (previewPrompt) {
        previewPrompt.style.display = 'block';
        var copyBtn = previewPrompt.querySelector('.copy-btn');
        if (copyBtn) copyBtn.dataset.copy = prompt;
      }

      addHistory(prompt, url);

      state.isGenerating = false;
      updateGenerateButton();
    }, 2000);
  }

  function addHistory(prompt, imageUrl) {
    var item = {
      prompt: prompt,
      imageUrl: imageUrl,
      timestamp: Date.now(),
      params: {
        industry: state.industry,
        style: state.style,
        colorScheme: state.colorScheme.slice(),
        fontStyle: state.fontStyle,
        layoutType: state.layoutType,
        brandName: state.brandName,
        extraConditions: state.extraConditions
      }
    };
    state.history.unshift(item);
    if (state.history.length > 20) state.history.pop();
    renderHistory();
  }

  function renderHistory() {
    if (!historyList) return;
    if (!state.history.length) {
      historyList.innerHTML = '<p class="text-body history-empty">尚未生成任何 Logo</p>';
      return;
    }
    historyList.innerHTML = state.history.map(function(item, i) {
      return '<button class="history-item" data-index="' + i + '">' +
        '<span class="history-thumb">' + escapeHtml((item.params.brandName || 'L').charAt(0)) + '</span>' +
        '<span class="history-name">' + escapeHtml(item.params.brandName || 'Logo') + '</span>' +
        '</button>';
    }).join('');

    historyList.querySelectorAll('.history-item').forEach(function(btn) {
      btn.addEventListener('click', function() {
        var item = state.history[parseInt(this.dataset.index)];
        if (!item) return;
        restoreState(item.params);
      });
    });
  }

  function restoreState(params) {
    state.industry = params.industry;
    state.style = params.style;
    state.colorScheme = params.colorScheme || [];
    state.fontStyle = params.fontStyle;
    state.layoutType = params.layoutType;
    state.brandName = params.brandName;
    state.extraConditions = params.extraConditions;

    if (brandInput) brandInput.value = state.brandName;
    var extraEl = $('#extraConditions');
    if (extraEl) extraEl.value = state.extraConditions;
    if (charCount) charCount.textContent = state.brandName.length + '/20';

    $$('[data-dimension] .selected').forEach(function(c) { c.classList.remove('selected'); });
    ['industry', 'style', 'fontStyle', 'layoutType'].forEach(function(dim) {
      if (state[dim]) {
        var chip = document.querySelector('[data-dimension="' + dim + '"] [data-value="' + state[dim] + '"]');
        if (chip) chip.classList.add('selected');
      }
    });
    state.colorScheme.forEach(function(cs) {
      var chip = document.querySelector('[data-dimension="colorScheme"] [data-value="' + cs + '"]');
      if (chip) chip.classList.add('selected');
    });

    updatePreview();
    updateGenerateButton();
  }

  function loadUrlParams() {
    var params = new URLSearchParams(window.location.search);
    var brand = params.get('brand');
    if (brand && brandInput) {
      brandInput.value = brand;
      state.brandName = brand;
      if (charCount) charCount.textContent = brand.length + '/20';
    }
    setFilterFromParam('industry', params.get('industry'));
    setFilterFromParam('style', params.get('style'));
    setFilterFromParam('fontStyle', params.get('font'));
    setFilterFromParam('layoutType', params.get('layout'));
    var colorParam = params.get('color');
    if (colorParam) {
      var chips = document.querySelectorAll('[data-dimension="colorScheme"] [data-value="' + colorParam + '"]');
      chips.forEach(function(c) { c.click(); });
    }
    updatePreview();
    updateGenerateButton();
  }

  function setFilterFromParam(dim, val) {
    if (!val) return;
    var chip = document.querySelector('[data-dimension="' + dim + '"] [data-value="' + decodeURIComponent(val) + '"]');
    if (chip) chip.click();
  }

  function downloadResult() {
    var img = resultImage;
    if (!img || !img.src) return;
    var a = document.createElement('a');
    a.href = img.src;
    a.download = (state.brandName || 'logo') + '-logo.svg';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  function shareResult() {
    var url = window.location.origin + '/generator/?' + buildShareUrl();
    if (navigator.share) {
      navigator.share({ title: state.brandName + ' Logo', url: url }).catch(function() {});
    } else {
      navigator.clipboard.writeText(url).then(function() {
        var btn = $('#shareBtn');
        if (btn) {
          var orig = btn.textContent;
          btn.textContent = '链接已复制';
          setTimeout(function() { btn.textContent = orig; }, 2000);
        }
      });
    }
  }

  function buildShareUrl() {
    var params = new URLSearchParams();
    if (state.brandName) params.set('brand', state.brandName);
    if (state.industry) params.set('industry', state.industry);
    if (state.style) params.set('style', state.style);
    if (state.colorScheme.length) params.set('color', state.colorScheme.join(','));
    if (state.fontStyle) params.set('font', state.fontStyle);
    if (state.layoutType) params.set('layout', state.layoutType);
    return params.toString();
  }

  function getColorsForScheme(scheme) {
    var map = {
      '单色渐变红': ['#CF0A2C'], '单色橙': ['#FF6900'], '蓝白双色': ['#003DA5'],
      '金黑红': ['#C9A963', '#1A1A1A'], '极致黑白': ['#000000'], '红黑撞色': ['#E60012'],
      '多色跳跃': ['#325AB4', '#FF5C8A'], '胭脂粉黛': ['#C4375E'],
      '大地暖灰': ['#8B8682'], '黑白金': ['#1A1A1A', '#D4AF37'], '黄黑撞色': ['#FFD700'],
      '自然色系': ['#2E8B57'], '科技蓝渐变': ['#0066CC'], '单色强调红': ['#EE1C25'],
      '红白双色': ['#E2231A'], '蓝红双色': ['#0066FF'], '经典绿金': ['#006633'],
      '冰雪蓝白红': ['#0066CC'], '羊绒暖棕': ['#8B7355'], '茶韵暖棕': ['#5D4037']
    };
    return map[scheme] || ['#D4532A'];
  }

  function getFontFamily(fontStyle) {
    var map = {
      '无衬线几何': 'Inter, sans-serif', '无衬线圆角': 'Inter, sans-serif',
      '无衬线现代': 'Inter, sans-serif', '无衬线粗体': 'Inter, sans-serif',
      '无衬线极简': 'Inter, sans-serif', '无衬线动感': 'Inter, sans-serif',
      '中文宋体': "'Noto Serif SC', serif", '中文楷体': "'Noto Serif SC', serif",
      '中文书法': "'Noto Serif SC', serif"
    };
    return map[fontStyle] || 'Inter, sans-serif';
  }

  function escapeXml(s) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
  }

  function escapeHtml(s) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function setupMobile() {
    if (window.innerWidth > 768) return;
    var area = document.querySelector('.preview-area');
    if (!area) return;
    var toggleBtn = document.createElement('button');
    toggleBtn.className = 'filter-toggle-btn';
    toggleBtn.textContent = '筛选参数';
    toggleBtn.setAttribute('aria-expanded', 'false');
    toggleBtn.addEventListener('click', function() {
      if (!filterPanel) return;
      var open = filterPanel.classList.toggle('open');
      toggleBtn.setAttribute('aria-expanded', String(open));
      toggleBtn.textContent = open ? '关闭筛选' : '筛选参数';
    });
    area.appendChild(toggleBtn);
  }

  init();
  setupMobile();
})();

// --- Scroll-triggered animations for case wall ---
(function initScrollAnimations() {
  if (!window.IntersectionObserver) return;
  var cards = document.querySelectorAll('.case-card');
  if (!cards.length) return;

  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry, i) {
      if (entry.isIntersecting) {
        entry.target.style.animationDelay = (i % 10) * 60 + 'ms';
        entry.target.style.animationPlayState = 'running';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

  cards.forEach(function(card) {
    card.style.animationPlayState = 'paused';
    observer.observe(card);
  });
})();

// --- Case wall style filter (homepage) ---
(function initCaseWallFilter() {
  var filterBar = document.querySelector('.case-filter-bar');
  if (!filterBar) return;

  filterBar.addEventListener('click', function(e) {
    var tag = e.target.closest('[data-filter]');
    if (!tag) return;

    filterBar.querySelectorAll('.tag').forEach(function(t) {
      t.classList.remove('selected');
      t.setAttribute('aria-selected', 'false');
    });
    tag.classList.add('selected');
    tag.setAttribute('aria-selected', 'true');

    var filter = tag.dataset.filter;

    document.querySelectorAll('.case-card').forEach(function(card) {
      if (filter === 'all') {
        card.style.display = '';
        return;
      }
      var cardStyle = card.dataset.style;
      if (!cardStyle) return;
      var normalizedStyle = cardStyle.replace(/\s+/g, '-').toLowerCase();
      if (normalizedStyle === filter || cardStyle === filter) {
        card.style.display = '';
      } else {
        card.style.display = 'none';
      }
    });
  });
})();
