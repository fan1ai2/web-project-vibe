// API 客户端 — 统一管理后端接口请求
(function() {
  'use strict';

  // 后端地址（部署时改为实际 IP:33101）
  var API_BASE = window.API_BASE || 'http://10.100.1.235:33101';

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
    login:        function(email, password, captchaId, captchaCode) {
      var body = { username: email, password: password };
      if (captchaId) { body.captcha_id = captchaId; body.captcha_code = captchaCode; }
      return req('POST', '/api/auth/login', body);
    },
    register:     function(email, password, captchaId, captchaCode) {
      var body = { username: email, password: password };
      if (captchaId) { body.captcha_id = captchaId; body.captcha_code = captchaCode; }
      return req('POST', '/api/auth/register', body);
    },
    logout:       function()                   { return req('POST', '/api/auth/logout'); },

    // User
    me:           function()                   { return req('GET',  '/api/me'); },
    updateMe:     function(data)               { return req('PUT',  '/api/me', data); },
    updatePwd:    function(oldPwd, newPwd)     { return req('PUT',  '/api/me/password', { old_password: oldPwd, new_password: newPwd }); },

    // Content
    articles:     function()                   { return req('GET',  '/api/content/articles'); },
    article:      function(id)                 { return req('GET',  '/api/content/articles/' + id); },
    packages:     function()                   { return req('GET',  '/api/content/packages'); },
    about:        function()                   { return req('GET',  '/api/content/about'); },
    contact:      function()                   { return req('GET',  '/api/content/contact'); },

    // Site
    friendLinks:  function()                   { return req('GET',  '/api/site/friend-links'); },

    // Feedback
    feedback:     function(data)               { return req('POST', '/api/feedback', data); },

    // Captcha
    captcha:      function()                   { return req('POST', '/api/captcha/generate'); },

    // Health
    health:       function()                   { return req('GET',  '/api/health'); }
  };
})();
