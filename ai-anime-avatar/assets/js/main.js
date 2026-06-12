// === Dark Mode Toggle ===
(function() {
  var toggle = document.getElementById('theme-toggle');
  var html = document.documentElement;
  var stored = localStorage.getItem('theme');
  if (stored) {
    html.setAttribute('data-theme', stored);
  }
  if (toggle) {
    toggle.addEventListener('click', function() {
      var current = html.getAttribute('data-theme');
      var next = current === 'dark' ? 'light' : 'dark';
      html.setAttribute('data-theme', next);
      localStorage.setItem('theme', next);
      toggle.setAttribute('aria-label', next === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
    });
  }
})();

// === Header scroll effect ===
(function() {
  var header = document.getElementById('header');
  if (header) {
    window.addEventListener('scroll', function() {
      if (window.scrollY > 10) {
        header.classList.add('header--scrolled');
      } else {
        header.classList.remove('header--scrolled');
      }
    }, { passive: true });
  }
})();

// === Mobile Menu ===
(function() {
  var menuBtn = document.getElementById('menu-btn');
  var mobileNav = document.getElementById('mobile-nav');
  var menuIcon = menuBtn ? menuBtn.querySelector('svg') : null;
  var closeIcon = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>';
  var hamburgerIcon = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M3 12h18M3 6h18M3 18h18"/></svg>';

  if (menuBtn && mobileNav) {
    menuBtn.addEventListener('click', function() {
      var active = mobileNav.classList.toggle('active');
      menuBtn.setAttribute('aria-expanded', active);
      menuBtn.innerHTML = active ? closeIcon : hamburgerIcon;
    });

    var mobileLinks = mobileNav.querySelectorAll('.header__mobile-link');
    mobileLinks.forEach(function(link) {
      link.addEventListener('click', function() {
        mobileNav.classList.remove('active');
        menuBtn.setAttribute('aria-expanded', 'false');
        menuBtn.innerHTML = hamburgerIcon;
      });
    });
  }
})();

// === FAQ Accordion ===
(function() {
  var faqItems = document.querySelectorAll('.faq__item');
  faqItems.forEach(function(item) {
    var question = item.querySelector('.faq__question');
    if (question) {
      question.addEventListener('click', function() {
        var active = item.classList.contains('active');
        faqItems.forEach(function(i) { i.classList.remove('active'); });
        if (!active) {
          item.classList.add('active');
        }
      });
    }
  });
})();

// === Upload Functionality ===
(function() {
  var uploadArea = document.getElementById('upload-area');
  var fileInput = document.getElementById('file-input');
  var browseBtn = document.getElementById('browse-btn');
  var preview = document.getElementById('upload-preview');
  var previewImg = document.getElementById('preview-img');
  var previewRemove = document.getElementById('preview-remove');
  var progress = document.getElementById('upload-progress');
  var progressFill = document.getElementById('progress-fill');
  var generating = document.getElementById('upload-generating');
  var resultsSection = document.getElementById('results');
  var shareSection = document.getElementById('share-section');

  // Store generated image data URLs keyed by style
  var generatedImages = {};

  // Free generation counter
  var freeCounter = document.getElementById('free-count');
  var today = new Date().toDateString();
  var storedDate = localStorage.getItem('freeDate');
  if (storedDate !== today) {
    localStorage.setItem('freeCount', '3');
    localStorage.setItem('freeDate', today);
  }
  var count = parseInt(localStorage.getItem('freeCount') || '3', 10);
  if (freeCounter) freeCounter.textContent = count;

  function updateFreeCount() {
    count = parseInt(localStorage.getItem('freeCount') || '0', 10);
    if (freeCounter) freeCounter.textContent = count;
  }

  if (browseBtn) {
    browseBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      if (fileInput) fileInput.click();
    });
  }

  if (uploadArea) {
    uploadArea.addEventListener('click', function() {
      if (fileInput) fileInput.click();
    });

    uploadArea.addEventListener('dragover', function(e) {
      e.preventDefault();
      uploadArea.classList.add('drag-over');
    });

    uploadArea.addEventListener('dragleave', function() {
      uploadArea.classList.remove('drag-over');
    });

    uploadArea.addEventListener('drop', function(e) {
      e.preventDefault();
      uploadArea.classList.remove('drag-over');
      var files = e.dataTransfer.files;
      if (files.length > 0) handleFile(files[0]);
    });
  }

  if (fileInput) {
    fileInput.addEventListener('change', function() {
      if (fileInput.files.length > 0) handleFile(fileInput.files[0]);
    });
  }

  if (previewRemove) {
    previewRemove.addEventListener('click', function(e) {
      e.stopPropagation();
      if (preview) preview.classList.remove('active');
      if (fileInput) fileInput.value = '';
    });
  }

  // Wire up download buttons in results — triggers payment for HD unlock
  var downloadButtons = document.querySelectorAll('.results__card-btn');
  var pendingStyle = null;

  downloadButtons.forEach(function(btn) {
    btn.addEventListener('click', function(e) {
      var style = this.getAttribute('data-style');
      window.__pendingHDStyle = style;
    });
  });

  // Hook into payment modal submit to unlock HD after payment
  var paymentForm = document.querySelector('.payment-modal__form');
  if (paymentForm) {
    paymentForm.addEventListener('submit', function(e) {
      e.preventDefault();
      var style = window.__pendingHDStyle;
      if (!style) return;

      // Unlock HD: remove blur and watermark
      var cardImage = document.querySelector('.results__card-image[data-style="' + style + '"]');
      if (cardImage) {
        cardImage.classList.add('results__card-image--hd');
      }

      // Trigger HD download
      var dataUrl = generatedImages[style];
      if (dataUrl) {
        var link = document.createElement('a');
        link.href = dataUrl;
        link.download = 'ai-anime-avatar-' + style + '-hd.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }

      // Close payment modal
      var modal = document.getElementById('payment-modal');
      if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
      }

      window.__pendingHDStyle = null;
    });
  }

  function handleFile(file) {
    if (!file.type.match(/^image\/(jpeg|png|webp)$/)) {
      alert('Please upload a JPG, PNG, or WebP file.');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      alert('File size must be under 10MB.');
      return;
    }

    // Read file and store for generation
    var reader = new FileReader();
    reader.onload = function(e) {
      var imageDataUrl = e.target.result;
      if (previewImg) previewImg.src = imageDataUrl;
      if (preview) preview.classList.add('active');

      // Store the uploaded image as the generated result for each style
      // (In production, each style would be a separately AI-generated image)
      var styles = ['styleJP', 'styleKR', 'styleUS', 'styleQ', 'stylePixel', 'styleCyber'];
      styles.forEach(function(style) {
        generatedImages[style] = imageDataUrl;
      });
    };
    reader.readAsDataURL(file);

    simulateGeneration();
  }

  function simulateGeneration() {
    if (progress) progress.classList.add('active');
    if (progressFill) progressFill.style.width = '0%';

    var width = 0;
    var interval = setInterval(function() {
      width += Math.random() * 15;
      if (width >= 100) {
        width = 100;
        clearInterval(interval);
        if (progress) progress.classList.remove('active');
        if (generating) generating.classList.add('active');

        setTimeout(function() {
          if (generating) generating.classList.remove('active');

          // Populate result card images with low-res preview
          var styles = ['styleJP', 'styleKR', 'styleUS', 'styleQ', 'stylePixel', 'styleCyber'];
          styles.forEach(function(style) {
            var img = document.querySelector('.results__card-image[data-style="' + style + '"]');
            if (img && generatedImages[style]) {
              img.src = generatedImages[style];
            }
          });

          // Mark grid as loaded
          var grid = document.getElementById('results-list');
          if (grid) grid.classList.add('results__grid--loaded');

          if (shareSection) shareSection.classList.add('active');

          // Update free count
          count = Math.max(0, count - 1);
          localStorage.setItem('freeCount', count.toString());
          updateFreeCount();

          // Scroll to results
          if (resultsSection) {
            resultsSection.scrollIntoView({ behavior: 'smooth' });
          }
        }, 2000);
      }
      if (progressFill) progressFill.style.width = width + '%';
    }, 300);
  }
})();

// === Share Functionality ===
(function() {
  var weiboBtn = document.getElementById('share-weibo');
  var copyBtn = document.getElementById('share-copy');

  if (weiboBtn) {
    weiboBtn.addEventListener('click', function() {
      var url = encodeURIComponent(window.location.href);
      var title = encodeURIComponent(document.title);
      window.open('https://service.weibo.com/share/share.php?url=' + url + '&title=' + title, '_blank');
      addFreeGeneration();
    });
  }

  if (copyBtn) {
    copyBtn.addEventListener('click', function() {
      navigator.clipboard.writeText(window.location.href).then(function() {
        copyBtn.classList.add('copied');
        var copyText = copyBtn.querySelector('.share__copy-text');
        if (copyText) copyText.textContent = copyBtn.getAttribute('data-copied') || 'Copied!';
        addFreeGeneration();
        setTimeout(function() {
          copyBtn.classList.remove('copied');
          if (copyText) copyText.textContent = copyBtn.getAttribute('data-original') || 'Copy Link';
        }, 2000);
      });
    });
  }

  function addFreeGeneration() {
    var count = parseInt(localStorage.getItem('freeCount') || '0', 10);
    localStorage.setItem('freeCount', (count + 1).toString());
    var freeCounter = document.getElementById('free-count');
    if (freeCounter) freeCounter.textContent = count + 1;
  }
})();

// === Payment Modal ===
(function() {
  var modal = document.getElementById('payment-modal');
  var openButtons = document.querySelectorAll('[data-open-payment]');
  var closeBtn = document.getElementById('payment-modal-close');
  var overlay = document.getElementById('payment-modal-overlay');

  if (openButtons.length > 0 && modal) {
    openButtons.forEach(function(btn) {
      btn.addEventListener('click', function() {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
      });
    });

    function closeModal() {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }

    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (overlay) overlay.addEventListener('click', closeModal);

    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') closeModal();
    });
  }
})();

// === Auth Modal ===
(function() {
  var modal = document.getElementById('auth-modal');
  var openBtn = document.getElementById('auth-btn');
  var mobileOpenBtn = document.getElementById('mobile-auth-btn');
  var closeBtn = document.getElementById('auth-modal-close');
  var overlay = document.getElementById('auth-modal-overlay');
  var tabLogin = document.getElementById('auth-tab-login');
  var tabRegister = document.getElementById('auth-tab-register');
  var formLogin = document.getElementById('auth-form-login');
  var formRegister = document.getElementById('auth-form-register');
  var mobileNav = document.getElementById('mobile-nav');
  var menuBtn = document.getElementById('menu-btn');

  // Auth gate: intercept clicks on gated elements
  var pendingRedirect = '';
  document.querySelectorAll('[data-gate]').forEach(function(el) {
    el.addEventListener('click', function(e) {
      if (!localStorage.getItem('user')) {
        e.preventDefault();
        pendingRedirect = this.getAttribute('data-gate') || this.getAttribute('href');
        openModal(e);
      }
    });
  });

  function openModal(e) {
    e.preventDefault();
    if (modal) {
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
      refreshAuthCaptcha();
    }
    if (mobileNav && mobileNav.classList.contains('active')) {
      mobileNav.classList.remove('active');
      if (menuBtn) {
        menuBtn.setAttribute('aria-expanded', 'false');
        menuBtn.innerHTML = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M3 12h18M3 6h18M3 18h18"/></svg>';
      }
    }
  }

  function closeModal() {
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  if (openBtn) openBtn.addEventListener('click', openModal);
  if (mobileOpenBtn) mobileOpenBtn.addEventListener('click', openModal);
  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (overlay) overlay.addEventListener('click', closeModal);

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
      closeModal();
    }
  });

  var authCaptchaId = '';

  function refreshAuthCaptcha() {
    if (typeof API === 'undefined') return;
    API.captcha().then(function(data) {
      authCaptchaId = data.data.captcha_id;
      var img = data.data.captcha_image;
      var loginImg = document.getElementById('auth-login-captcha-img');
      var regImg = document.getElementById('auth-register-captcha-img');
      if (loginImg) loginImg.src = img;
      if (regImg) regImg.src = img;
    }).catch(function() {});
  }

  var loginCaptchaImg = document.getElementById('auth-login-captcha-img');
  var regCaptchaImg = document.getElementById('auth-register-captcha-img');
  if (loginCaptchaImg) loginCaptchaImg.addEventListener('click', refreshAuthCaptcha);
  if (regCaptchaImg) regCaptchaImg.addEventListener('click', refreshAuthCaptcha);

  if (tabLogin && tabRegister && formLogin && formRegister) {
    tabLogin.addEventListener('click', function() {
      tabLogin.classList.add('auth-modal__tab--active');
      tabRegister.classList.remove('auth-modal__tab--active');
      formLogin.classList.add('auth-modal__form--active');
      formRegister.classList.remove('auth-modal__form--active');
      tabLogin.setAttribute('aria-selected', 'true');
      tabRegister.setAttribute('aria-selected', 'false');
      refreshAuthCaptcha();
    });

    tabRegister.addEventListener('click', function() {
      tabRegister.classList.add('auth-modal__tab--active');
      tabLogin.classList.remove('auth-modal__tab--active');
      formRegister.classList.add('auth-modal__form--active');
      formLogin.classList.remove('auth-modal__form--active');
      tabRegister.setAttribute('aria-selected', 'true');
      tabLogin.setAttribute('aria-selected', 'false');
      refreshAuthCaptcha();
    });
  }

  // Auth form submissions — calls backend API
  if (formLogin) {
    formLogin.addEventListener('submit', function(e) {
      e.preventDefault();
      var email = document.getElementById('auth-login-email').value.trim();
      var pwd = document.getElementById('auth-login-password').value;
      var captchaInput = document.getElementById('auth-login-captcha');
      var captchaCode = captchaInput ? captchaInput.value.trim() : '';
      var btn = formLogin.querySelector('button');
      if (!email || !pwd) { showAuthToast('Please fill in all fields', 'error'); return; }

      btn.disabled = true; btn.textContent = 'Logging in...';
      API.login(email, pwd, captchaCode ? authCaptchaId : '', captchaCode).then(function(data) {
        localStorage.setItem('user', JSON.stringify(data.data.member || data.data));
        showAuthToast('Login successful!', 'success');
        setTimeout(function() {
          closeModal();
          if (pendingRedirect) {
            window.location.href = pendingRedirect;
            pendingRedirect = '';
          }
        }, 800);
      }).catch(function(err) {
        showAuthToast(err.message || 'Login failed', 'error');
        refreshAuthCaptcha();
        if (captchaInput) captchaInput.value = '';
      }).finally(function() {
        btn.disabled = false; btn.textContent = 'Login';
      });
    });
  }

  if (formRegister) {
    formRegister.addEventListener('submit', function(e) {
      e.preventDefault();
      var email = document.getElementById('auth-register-email').value.trim();
      var pwd = document.getElementById('auth-register-password').value;
      var confirm = document.getElementById('auth-register-confirm').value;
      var captchaInput = document.getElementById('auth-register-captcha');
      var captchaCode = captchaInput ? captchaInput.value.trim() : '';
      var btn = formRegister.querySelector('button');
      if (!email || !pwd) { showAuthToast('Please fill in all fields', 'error'); return; }
      if (pwd !== confirm) { showAuthToast('Passwords do not match', 'error'); return; }
      if (pwd.length < 8) { showAuthToast('Password must be at least 8 characters', 'error'); return; }

      btn.disabled = true; btn.textContent = 'Registering...';
      API.register(email, pwd, captchaCode ? authCaptchaId : '', captchaCode).then(function(data) {
        showAuthToast('Registration successful! Please log in.', 'success');
        tabLogin.click();
      }).catch(function(err) {
        showAuthToast(err.message || 'Registration failed', 'error');
        refreshAuthCaptcha();
        if (captchaInput) captchaInput.value = '';
      }).finally(function() {
        btn.disabled = false; btn.textContent = 'Register';
      });
    });
  }

  function showAuthToast(msg, type) {
    var t = document.createElement('div');
    t.className = 'auth-toast' + (type === 'error' ? ' auth-toast--error' : '');
    t.textContent = msg;
    t.style.cssText = 'position:fixed;top:20px;left:50%;transform:translateX(-50%);padding:12px 24px;border-radius:8px;z-index:99999;font-size:0.9rem;' +
      (type === 'error' ? 'background:#fee;color:#c00;border:1px solid #fcc;' : 'background:#efe;color:#060;border:1px solid#cfc;');
    document.body.appendChild(t);
    setTimeout(function(){ t.style.opacity = '0'; t.style.transition = 'opacity 0.3s'; }, 2000);
    setTimeout(function(){ t.remove(); }, 2500);
  }
})();

// === Smooth Scroll for Anchor Links ===
(function() {
  document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
    anchor.addEventListener('click', function(e) {
      var targetId = this.getAttribute('href');
      if (targetId === '#') return;
      var target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
})();
