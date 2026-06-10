var screenshotService = (function() {
  function validateUrl(raw) {
    var url = raw.trim();
    if (!url) return { valid: false, error: '请输入网址' };
    if (!/^https?:\/\//i.test(url)) url = 'https://' + url;
    try {
      var parsed = new URL(url);
      if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
        return { valid: false, error: '仅支持 http 和 https 链接' };
      }
      return { valid: true, url: parsed.href };
    } catch (e) {
      return { valid: false, error: '请输入有效的网址（以 http:// 或 https:// 开头）' };
    }
  }

  function parseViewport(raw) {
    var parts = raw.split('x');
    return { width: parseInt(parts[0], 10) || 1440, height: parseInt(parts[1], 10) || 900 };
  }

  async function capture(targetUrl, viewport, format, quality, fullPage) {
    var html = await proxyService.fetchPage(targetUrl);

    var iframe = document.createElement('iframe');
    iframe.style.cssText = 'position:fixed;top:-9999px;left:-9999px;';
    iframe.sandbox = 'allow-same-origin';
    document.body.appendChild(iframe);

    try {
      var doc = iframe.contentDocument || iframe.contentWindow.document;
      doc.open();
      doc.write(html);
      doc.close();

      await new Promise(function(resolve) {
        if (doc.readyState === 'complete') resolve();
        else iframe.addEventListener('load', resolve, { once: true });
      });

      var body = doc.body;
      var canvasHeight = fullPage ? body.scrollHeight : viewport.height;

      var canvas = await html2canvas(body, {
        width: viewport.width,
        height: canvasHeight,
        windowWidth: viewport.width,
        windowHeight: canvasHeight,
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
      });

      return canvas;
    } finally {
      document.body.removeChild(iframe);
    }
  }

  return { validateUrl: validateUrl, parseViewport: parseViewport, capture: capture };
})();
