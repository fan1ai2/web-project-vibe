var downloadService = (function() {
  function download(canvas, format) {
    var mimeMap = { png: 'image/png', jpeg: 'image/jpeg', webp: 'image/webp' };
    var extMap = { png: 'png', jpeg: 'jpg', webp: 'webp' };
    var mime = mimeMap[format];
    var ext = extMap[format];
    var ts = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
    var filename = 'screenshot-' + ts + '.' + ext;

    canvas.toBlob(function(blob) {
      var url = URL.createObjectURL(blob);
      var a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, mime, 0.95);
  }

  async function copyToClipboard(canvas) {
    return new Promise(function(resolve, reject) {
      canvas.toBlob(async function(blob) {
        try {
          await navigator.clipboard.write([
            new ClipboardItem({ [blob.type]: blob })
          ]);
          resolve();
        } catch (e) {
          reject(e);
        }
      });
    });
  }

  return { download: download, copyToClipboard: copyToClipboard };
})();

// UI Wiring
document.addEventListener('DOMContentLoaded', function() {
  var urlInput = document.getElementById('url-input');
  var captureBtn = document.getElementById('capture-btn');
  var urlError = document.getElementById('url-error');
  var viewportGroup = document.getElementById('viewport-group');
  var formatGroup = document.getElementById('format-group');
  var qualitySlider = document.getElementById('quality-slider');
  var qualityValue = document.getElementById('quality-value');
  var fullpageToggle = document.getElementById('fullpage-toggle');
  var previewPlaceholder = document.getElementById('preview-placeholder');
  var previewLoading = document.getElementById('preview-loading');
  var previewImage = document.getElementById('preview-image');
  var previewError = document.getElementById('preview-error');
  var errorText = document.getElementById('error-text');
  var actionBar = document.getElementById('action-bar');
  var downloadBtn = document.getElementById('download-btn');
  var copyBtn = document.getElementById('copy-btn');

  var lastCanvas = null;

  function initSegmented(groupEl) {
    groupEl.addEventListener('click', function(e) {
      var btn = e.target.closest('.seg-btn');
      if (!btn) return;
      var buttons = groupEl.querySelectorAll('.seg-btn');
      for (var i = 0; i < buttons.length; i++) {
        buttons[i].classList.remove('active');
        buttons[i].setAttribute('aria-checked', 'false');
      }
      btn.classList.add('active');
      btn.setAttribute('aria-checked', 'true');
    });
  }
  initSegmented(viewportGroup);
  initSegmented(formatGroup);

  qualitySlider.addEventListener('input', function() {
    qualityValue.textContent = qualitySlider.value + '%';
  });

  function showState(state) {
    previewPlaceholder.classList.toggle('hidden', state !== 'placeholder');
    previewLoading.classList.toggle('hidden', state !== 'loading');
    previewImage.classList.toggle('hidden', state !== 'image');
    previewError.classList.toggle('hidden', state !== 'error');
    actionBar.classList.toggle('hidden', state !== 'image');
  }

  function showToast(msg) {
    var t = document.createElement('div');
    t.className = 'toast';
    t.textContent = msg;
    document.body.appendChild(t);
    setTimeout(function() {
      t.classList.add('toast-out');
      t.addEventListener('animationend', function() { t.remove(); });
    }, 2500);
  }

  captureBtn.addEventListener('click', async function() {
    var url = urlInput.value;
    var validation = screenshotService.validateUrl(url);
    if (!validation.valid) {
      urlError.textContent = validation.error;
      return;
    }
    urlError.textContent = '';

    var activeViewportBtn = viewportGroup.querySelector('.seg-btn.active');
    var viewport = screenshotService.parseViewport(activeViewportBtn.dataset.viewport);

    var activeFormatBtn = formatGroup.querySelector('.seg-btn.active');
    var format = activeFormatBtn.dataset.format;

    var quality = parseInt(qualitySlider.value, 10) / 100;
    var fullPage = fullpageToggle.checked;

    captureBtn.disabled = true;
    showState('loading');

    try {
      var canvas = await screenshotService.capture(validation.url, viewport, format, quality, fullPage);
      lastCanvas = canvas;
      previewImage.src = canvas.toDataURL('image/' + (format === 'jpeg' ? 'jpeg' : 'png'));
      showState('image');
    } catch (err) {
      console.error(err);
      errorText.textContent = err.message || '截图失败，请重试';
      showState('error');
    } finally {
      captureBtn.disabled = false;
    }
  });

  urlInput.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') captureBtn.click();
  });

  downloadBtn.addEventListener('click', function() {
    if (!lastCanvas) return;
    var format = formatGroup.querySelector('.seg-btn.active').dataset.format;
    downloadService.download(lastCanvas, format);
  });

  copyBtn.addEventListener('click', async function() {
    if (!lastCanvas) return;
    try {
      await downloadService.copyToClipboard(lastCanvas);
      showToast('已复制到剪贴板');
    } catch (e) {
      showToast('复制失败，请使用下载功能');
    }
  });
});
