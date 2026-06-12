// API 客户端 — 统一管理后端接口请求
(function() {
  'use strict';

  var API_BASE = window.API_BASE || 'http://10.100.1.235:33104';

  function req(method, path, body) {
    var opts = {
      method: method,
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include'
    };
    if (body) opts.body = JSON.stringify(body);
    return fetch(API_BASE + path, opts).then(function(r) {
      return r.json().then(function(data) {
        if (!r.ok) throw { status: r.status, message: data.message || data.error || '请求失败', data: data };
        return data;
      });
    });
  }

  window.API = {
    // Auth
    sendCode:     function(email)                 { return req('POST', '/api/auth/send-code', { email: email }); },
    login:        function(email, password)       { return req('POST', '/api/auth/login', { username: email, password: password }); },
    register:     function(email, password, code) { return req('POST', '/api/auth/register', { username: email, password: password, captcha_code: code }); },
    me:           function()                      { return req('GET',  '/api/auth/me'); },

    // Health
    health:       function()                      { return req('GET',  '/api/health'); }
  };
})();
