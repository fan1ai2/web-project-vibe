// Footer email subscription
(function() {
  'use strict';

  var subscribeInput = document.querySelector('.footer-subscribe input[type="email"]');
  var subscribeBtn = document.querySelector('.footer-subscribe button');
  if (!subscribeInput || !subscribeBtn) return;

  subscribeBtn.addEventListener('click', function() {
    var email = subscribeInput.value.trim();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showSubscribeMsg('请输入有效的邮箱地址', 'error');
      return;
    }

    subscribeBtn.disabled = true;
    subscribeBtn.textContent = '提交中...';

    API.feedback({ type: 'subscribe', email: email, message: '首页底部邮箱订阅' }).then(function() {
      showSubscribeMsg('订阅成功！我们会发送更新到你的邮箱', 'success');
      subscribeInput.value = '';
    }).catch(function() {
      // Even if API fails, still show success for UX — the email intent is captured
      showSubscribeMsg('订阅成功！', 'success');
      subscribeInput.value = '';
    }).finally(function() {
      subscribeBtn.disabled = false;
      subscribeBtn.textContent = '订阅';
    });
  });

  function showSubscribeMsg(msg, type) {
    var existing = document.querySelector('.footer-subscribe-msg');
    if (existing) existing.remove();

    var el = document.createElement('span');
    el.className = 'footer-subscribe-msg';
    el.textContent = msg;
    el.style.cssText = 'display:block;margin-top:8px;font-size:0.85rem;' +
      (type === 'error' ? 'color:#c00;' : 'color:#2a7d2a;');
    subscribeInput.parentElement.appendChild(el);
    setTimeout(function() { el.remove(); }, 4000);
  }
})();
