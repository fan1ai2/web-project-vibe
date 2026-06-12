---
title: "使用条款"
description: "LogoForge 使用条款 — 使用我们的服务即表示你同意以下条款和条件"
---

<div id="legalContent">
<p><strong>最后更新日期：2026年6月</strong></p>

<h2>1. 服务说明</h2>
<p>LogoForge 是一个 AI 驱动的品牌 Logo 生成工具。我们提供在线创作平台，帮助你快速生成品牌标识。</p>

<h2>2. 账号注册</h2>
<p>使用创作台功能需要注册账号。你须提供真实、准确的信息，并对账号下的所有活动负责。请妥善保管密码，如发现未经授权使用，请立即通知我们。</p>

<h2>3. 使用规则</h2>
<p>你同意不会：</p>
<ul>
  <li>生成侵犯他人商标权、著作权或其他知识产权的 Logo</li>
  <li>生成包含违法、侵权、诽谤、淫秽或其他不当内容的 Logo</li>
  <li>对服务进行反向工程、破解或尝试获取源代码</li>
  <li>使用自动化方式（机器人、爬虫等）访问服务</li>
</ul>

<h2>4. 知识产权</h2>
<p>通过 LogoForge 生成的 Logo 设计，其知识产权归属于你。但 LogoForge 保留将生成结果用于服务展示和推广的权利（可选择退出）。</p>

<h2>5. 免责声明</h2>
<p>LogoForge 按"现状"提供服务，不保证生成结果一定能满足你的特定需求。我们不保证服务不会中断、及时、安全或无错误。AI 生成结果可能存在相似性，最终使用前请自行核实。</p>

<h2>6. 责任限制</h2>
<p>在法律允许的最大范围内，LogoForge 不对因使用本服务而产生的任何间接、附带、特殊或后果性损害承担责任。</p>

<h2>7. 终止</h2>
<p>我们保留因违反本条款而暂停或终止你账号的权利。你可以随时通过联系我们来删除账号。</p>

<h2>8. 联系我们</h2>
<p>如对本条款有任何疑问，请联系：<a href="mailto:hello@logoforge.app">hello@logoforge.app</a></p>
</div>

<script>
(function() {
  var API = window.location.port === '1313'
    ? window.location.protocol + '//' + window.location.hostname + ':18110'
    : '';
  fetch(API + '/api/content/pages/user_agreement', { credentials: 'include' })
    .then(function(res) { return res.json(); })
    .then(function(data) {
      if (data.code === 200 && data.data && data.data.content) {
        document.getElementById('legalContent').innerHTML = data.data.content;
        document.title = '使用条款 — LogoForge';
      }
    })
    .catch(function() {});
})();
</script>
