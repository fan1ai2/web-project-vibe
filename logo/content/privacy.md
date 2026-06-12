---
title: "隐私政策"
description: "LogoForge 隐私政策 — 了解我们如何收集、使用和保护你的个人信息"
---

<div id="legalContent">
<p><strong>最后更新日期：2026年6月</strong></p>

<h2>1. 信息收集</h2>
<p>当你注册账号时，我们收集以下信息：</p>
<ul>
  <li><strong>用户名</strong> — 用于标识你的账号</li>
  <li><strong>密码</strong> — 经过加密存储，我们无法读取明文</li>
</ul>

<h2>2. 信息使用</h2>
<p>我们使用你的信息来：</p>
<ul>
  <li>提供、维护和改进我们的 Logo 生成服务</li>
  <li>验证你的身份并保护账号安全</li>
  <li>向你发送与服务相关的通知</li>
</ul>

<h2>3. 信息存储</h2>
<p>你的账号信息存储在中国境内的服务器上。我们采用业界标准的安全措施保护你的数据，包括加密传输和加密存储。</p>

<h2>4. 信息共享</h2>
<p>我们不会将你的个人信息出售、交易或出租给第三方。我们仅在以下情况下共享信息：</p>
<ul>
  <li>获得你的明确同意</li>
  <li>法律法规要求</li>
</ul>

<h2>5. 你的权利</h2>
<p>你有权：</p>
<ul>
  <li>访问和更新你的账号信息</li>
  <li>删除你的账号及相关数据</li>
  <li>导出你的数据</li>
</ul>

<h2>6. 联系我们</h2>
<p>如对本隐私政策有任何疑问，请联系：<a href="mailto:hello@logoforge.app">hello@logoforge.app</a></p>
</div>

<script>
(function() {
  var API = window.location.port === '1313'
    ? window.location.protocol + '//' + window.location.hostname + ':18110'
    : '';
  fetch(API + '/api/content/pages/privacy_policy', { credentials: 'include' })
    .then(function(res) { return res.json(); })
    .then(function(data) {
      if (data.code === 200 && data.data && data.data.content) {
        document.getElementById('legalContent').innerHTML = data.data.content;
        document.title = '隐私政策 — LogoForge';
      }
    })
    .catch(function() {});
})();
</script>
