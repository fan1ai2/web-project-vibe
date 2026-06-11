(function() {
  'use strict';

  var container = document.getElementById('auth-container');
  if (!container) return;

  // --- API config (replace with real backend later) ---
  var API_BASE = ''; // e.g. 'https://api.aiprompt.cc'
  var QR_REFRESH_INTERVAL = 120; // seconds, QR expiry

  // --- State ---
  var currentMode = 'login'; // 'login' | 'register'
  var qrPollTimer = null;

  // --- DOM refs ---
  var tabLogin = container.querySelector('[data-tab="login"]');
  var tabRegister = container.querySelector('[data-tab="register"]');
  var formLogin = container.querySelector('#auth-form-login');
  var formRegister = container.querySelector('#auth-form-register');
  var qrSection = container.querySelector('#qr-section');
  var qrContainer = container.querySelector('#qr-container');
  var qrError = container.querySelector('#auth-error');
  var qrSuccess = container.querySelector('#auth-success');
  var switchLinks = container.querySelectorAll('.auth-switch a');

  // --- Tab switching ---
  function switchTab(mode) {
    currentMode = mode;
    if (mode === 'login') {
      tabLogin.classList.add('active');
      tabRegister.classList.remove('active');
      formLogin.classList.remove('hidden');
      formRegister.classList.add('hidden');
    } else {
      tabRegister.classList.add('active');
      tabLogin.classList.remove('active');
      formRegister.classList.remove('hidden');
      formLogin.classList.add('hidden');
    }
    clearMessage();
  }

  tabLogin.addEventListener('click', function() { switchTab('login'); });
  tabRegister.addEventListener('click', function() { switchTab('register'); });
  switchLinks.forEach(function(link) {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      switchTab(link.getAttribute('data-switch'));
    });
  });

  // --- QR Code rendering ---
  function renderQRCode(data) {
    qrContainer.innerHTML = '';
    if (!data) {
      var ph = document.createElement('div');
      ph.className = 'qr-placeholder';
      ph.innerHTML = '<svg class="qr-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="16" y="16" width="5" height="5" rx="1"/><line x1="14" y1="14" x2="14" y2="18"/><line x1="14" y1="18" x2="18" y2="18"/></svg><span>请使用微信扫码</span>';
      qrContainer.appendChild(ph);
      return;
    }
    // Simple QR via canvas (or replace with external QR lib later)
    var canvas = document.createElement('canvas');
    canvas.width = 180;
    canvas.height = 180;
    var ctx = canvas.getContext('2d');
    ctx.fillStyle = '#F6F3EC';
    ctx.fillRect(0, 0, 180, 180);

    // Draw a placeholder pattern
    var size = 18;
    var cell = 10;
    var offset = 0;
    ctx.fillStyle = '#2C2C2C';
    // Three position markers (corners)
    drawMarker(ctx, 0, 0, cell);
    drawMarker(ctx, 180 - cell * 7, 0, cell);
    drawMarker(ctx, 0, 180 - cell * 7, cell);

    // Some random-ish data cells (placeholder until real QR)
    ctx.fillStyle = '#5C3D2E';
    for (var i = 0; i < size; i++) {
      for (var j = 0; j < size; j++) {
        if (Math.sin(i * j * 0.7 + 3) > 0.3 && !isInMarker(i, j, size, cell)) {
          ctx.fillRect(i * cell, j * cell, cell * 0.7, cell * 0.7);
        }
      }
    }
    qrContainer.appendChild(canvas);
    ctx.fillStyle = '#2C2C2C';
  }

  function drawMarker(ctx, x, y, cell) {
    ctx.fillRect(x, y, cell * 7, cell * 7);
    ctx.fillStyle = '#F6F3EC';
    ctx.fillRect(x + cell, y + cell, cell * 5, cell * 5);
    ctx.fillStyle = '#2C2C2C';
    ctx.fillRect(x + cell * 2, y + cell * 2, cell * 3, cell * 3);
  }

  function isInMarker(i, j, size, cell) {
    var ms = 7;
    return (i < ms && j < ms) || (i >= size - ms && j < ms) || (i < ms && j >= size - ms);
  }

  // --- API calls (stubs for backend) ---
  function clearMessage() {
    qrError.textContent = '';
    qrSuccess.textContent = '';
  }

  function showError(msg) {
    qrError.textContent = msg;
    qrSuccess.textContent = '';
  }

  function showSuccess(msg) {
    qrSuccess.textContent = msg;
    qrError.textContent = '';
  }

  async function apiCall(endpoint, data) {
    if (!API_BASE) {
      // Backend not configured — simulate for demo
      console.log('[Auth] API not configured, endpoint:', endpoint, 'data:', data);
      return { ok: true, _demo: true };
    }
    var resp = await fetch(API_BASE + endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return resp.json();
  }

  async function requestQRCode(mode) {
    clearMessage();
    renderQRCode(null); // show placeholder first
    try {
      var result = await apiCall('/auth/qr/request', { mode: mode });
      if (result.qr_data) {
        renderQRCode(result.qr_data);
        startQRPolling(result.token);
      } else if (result._demo) {
        // Demo mode: show placeholder QR
        setTimeout(function() { renderQRCode('demo'); }, 300);
        showSuccess('演示模式 — 后端接口就绪后将显示真实二维码');
      }
    } catch(e) {
      showError('网络错误，请稍后重试');
    }
  }

  function startQRPolling(token) {
    if (qrPollTimer) clearInterval(qrPollTimer);
    var attempts = 0;
    var maxAttempts = (QR_REFRESH_INTERVAL * 1000) / 2000;
    qrPollTimer = setInterval(async function() {
      attempts++;
      if (attempts > maxAttempts) {
        clearInterval(qrPollTimer);
        showError('二维码已过期，请刷新');
        return;
      }
      try {
        var result = await apiCall('/auth/qr/check', { token: token });
        if (result.status === 'confirmed') {
          clearInterval(qrPollTimer);
          showSuccess('登录成功！正在跳转...');
          if (result.redirect) {
            setTimeout(function() { window.location.href = result.redirect; }, 800);
          }
        } else if (result.status === 'scanned') {
          showSuccess('已扫描，请在手机上确认...');
        }
      } catch(e) {
        // silent poll error
      }
    }, 2000);
  }

  // --- Form submission ---
  formLogin.addEventListener('submit', async function(e) {
    e.preventDefault();
    clearMessage();
    var btn = formLogin.querySelector('.auth-submit');
    btn.disabled = true;
    btn.textContent = '登录中...';
    try {
      var result = await apiCall('/auth/login', {
        email: formLogin.querySelector('[name="email"]').value,
        password: formLogin.querySelector('[name="password"]').value
      });
      if (result.ok || result._demo) {
        showSuccess('登录成功！');
        if (result._demo) showSuccess('演示模式 — 后端接口就绪后可正常登录');
      } else {
        showError(result.error || '登录失败');
      }
    } catch(e) {
      showError('网络错误，请稍后重试');
    }
    btn.disabled = false;
    btn.textContent = '登录';
  });

  formRegister.addEventListener('submit', async function(e) {
    e.preventDefault();
    clearMessage();
    var btn = formRegister.querySelector('.auth-submit');
    btn.disabled = true;
    btn.textContent = '注册中...';
    try {
      var result = await apiCall('/auth/register', {
        email: formRegister.querySelector('[name="email"]').value,
        password: formRegister.querySelector('[name="password"]').value,
        confirm: formRegister.querySelector('[name="confirm"]').value
      });
      if (result.ok || result._demo) {
        showSuccess('注册成功！');
        if (result._demo) showSuccess('演示模式 — 后端接口就绪后可正常注册');
      } else {
        showError(result.error || '注册失败');
      }
    } catch(e) {
      showError('网络错误，请稍后重试');
    }
    btn.disabled = false;
    btn.textContent = '注册';
  });

  // --- Init: load QR for default tab ---
  requestQRCode('login');
})();
