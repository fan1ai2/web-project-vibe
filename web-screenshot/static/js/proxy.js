var proxyService = (function() {
  var PROXIES = [
    function(url) { return 'https://api.allorigins.win/raw?url=' + encodeURIComponent(url); },
    function(url) { return 'https://corsproxy.io/?' + encodeURIComponent(url); },
  ];

  var TIMEOUT_MS = 30000;

  function fetchWithTimeout(url, timeoutMs) {
    var controller = new AbortController();
    var timer = setTimeout(function() { controller.abort(); }, timeoutMs);
    return fetch(url, { signal: controller.signal }).then(function(res) {
      clearTimeout(timer);
      if (!res.ok) throw new Error('HTTP ' + res.status);
      return res.text();
    }).catch(function(e) {
      clearTimeout(timer);
      throw e;
    });
  }

  function fetchPage(url) {
    var errors = [];
    // Try each proxy in sequence until one works
    function tryProxy(index) {
      if (index >= PROXIES.length) {
        return Promise.reject(new Error('截图失败，目标网站可能拒绝访问'));
      }
      return fetchWithTimeout(PROXIES[index](url), TIMEOUT_MS).then(function(html) {
        if (html && html.length > 100) return html;
        errors.push('empty response');
        return tryProxy(index + 1);
      }).catch(function(e) {
        errors.push(e.name === 'AbortError' ? 'timeout' : e.message);
        return tryProxy(index + 1);
      });
    }
    return tryProxy(0);
  }

  return { fetchPage: fetchPage };
})();
