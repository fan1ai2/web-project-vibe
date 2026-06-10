(function() {
  'use strict';

  function typewriter(el, text, speed, callback) {
    el.classList.add('active');
    var i = 0;
    el.textContent = '';
    var cursor = document.createElement('span');
    cursor.className = 'typewriter-cursor';
    el.appendChild(cursor);
    function tick() {
      if (i < text.length) {
        el.insertBefore(document.createTextNode(text.charAt(i)), cursor);
        i++;
        setTimeout(tick, speed || 40);
      } else {
        cursor.remove();
        if (callback) callback();
      }
    }
    tick();
  }

  function animateProgress(el, duration, callback) {
    var start = null;
    function step(ts) {
      if (!start) start = ts;
      var progress = Math.min((ts - start) / duration, 1);
      el.style.width = (progress * 100) + '%';
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        if (callback) callback();
      }
    }
    requestAnimationFrame(step);
  }

  function getMockBtn(slug) {
    return document.querySelector('[data-mock-btn="' + slug + '"]');
  }

  var genBtn = getMockBtn('prompt-generator');
  if (genBtn) {
    genBtn.addEventListener('click', function() {
      var input = document.getElementById('mock-input-prompt-gen');
      var output = document.getElementById('mock-output-prompt-gen');
      if (!input || !output) return;
      var topic = input.value.trim() || '写一篇关于春天的散文';
      genBtn.disabled = true;
      output.textContent = '';
      output.classList.add('active');
      setTimeout(function() {
        typewriter(output,
          '你是一位专业的提示词工程师。请根据用户的主题需求，生成一条结构完整、逻辑清晰的高质量AI提示词。\n\n' +
          '## 用户需求\n' + topic + '\n\n' +
          '## 生成要求\n' +
          '1. 明确角色设定和任务目标\n' +
          '2. 包含具体的输出格式要求\n' +
          '3. 设定语气、风格和受众\n' +
          '4. 提供必要的上下文和约束条件\n\n' +
          '请用中文输出完整的提示词。',
          20, function() { genBtn.disabled = false; }
        );
      }, 500);
    });
  }

  var humBtn = getMockBtn('text-humanizer');
  if (humBtn) {
    humBtn.addEventListener('click', function() {
      var input = document.getElementById('mock-input-text-humanizer');
      var output = document.getElementById('mock-output-text-humanizer');
      if (!input || !output) return;
      humBtn.disabled = true;
      output.textContent = '';
      output.classList.add('active');
      setTimeout(function() {
        typewriter(output,
          '已将AI生成的文本转化为更自然的人类书写风格：\n\n' +
          '• 替换了3处过于正式的表达\n' +
          '• 增加了2处口语化过渡词\n' +
          '• 调整了句长分布，使其更接近自然写作节奏\n' +
          '• 优化后的文本AI检测概率从92%降至34%',
          25, function() { humBtn.disabled = false; }
        );
      }, 600);
    });
  }

  var ocrBtn = getMockBtn('image-to-text');
  if (ocrBtn) {
    ocrBtn.addEventListener('click', function() {
      var output = document.getElementById('mock-output-image-to-text');
      if (!output) return;
      ocrBtn.disabled = true;
      output.textContent = '';
      output.classList.add('active');
      var progressBar = document.getElementById('mock-progress-ocr');
      if (progressBar) {
        progressBar.style.width = '0%';
        animateProgress(progressBar, 1500, function() {
          typewriter(output,
            '[识别结果]\n' +
            '人工智能正在深刻改变我们的工作和生活方式。从自然语言处理到计算机视觉，AI技术已经渗透到医疗、教育、金融、制造等各个领域。\n\n' +
            '据Gartner预测，到2027年，全球AI市场规模将达到1.2万亿美元。企业正在加速采用AI解决方案来提升效率、降低成本和创新产品。\n\n' +
            '[识别完成] 共检测到2段文字，156个字符，置信度98.7%',
            15, function() { ocrBtn.disabled = false; if(progressBar) progressBar.style.width = '100%'; }
          );
        });
      }
    });
  }

  var imgPromptBtn = getMockBtn('image-to-prompt');
  if (imgPromptBtn) {
    imgPromptBtn.addEventListener('click', function() {
      var output = document.getElementById('mock-output-image-to-prompt');
      if (!output) return;
      imgPromptBtn.disabled = true;
      output.textContent = '';
      output.classList.add('active');
      setTimeout(function() {
        typewriter(output,
          '[图像分析结果]\n' +
          '主体：一位穿着汉服的女子站在樱花树下\n' +
          '风格：古风摄影，柔光滤镜，浅景深\n' +
          '色调：粉白为主，暖色调\n' +
          '构图：三分法，人物居中偏右\n\n' +
          '[Midjourney Prompt]\n' +
          'A woman in traditional Chinese Hanfu standing under a blooming cherry blossom tree, soft natural lighting, shallow depth of field, pastel pink and white color palette, dreamy atmosphere, ancient Chinese aesthetic, rule of thirds composition, 8K, cinematic photography --ar 3:4 --style raw --v 6.1',
          15, function() { imgPromptBtn.disabled = false; }
        );
      }, 500);
    });
  }

  var detectBtn = getMockBtn('ai-detector');
  if (detectBtn) {
    detectBtn.addEventListener('click', function() {
      var output = document.getElementById('mock-output-ai-detector');
      if (!output) return;
      detectBtn.disabled = true;
      output.textContent = '';
      output.classList.add('active');
      setTimeout(function() {
        typewriter(output,
          '[检测报告]\n\n' +
          '┌─────────────────────────────────┐\n' +
          '│  AI生成概率：       72.4%  ████████░░  │\n' +
          '│  人类撰写概率：     27.6%  ███░░░░░░░  │\n' +
          '└─────────────────────────────────┘\n\n' +
          '逐句分析：\n' +
          '✓ 第1句 — 84% AI概率 (典型GPT句式)\n' +
          '⚠ 第2句 — 51% AI概率 (混合特征)\n' +
          '✓ 第3句 — 78% AI概率 (模板化表达)\n\n' +
          '来源推测：ChatGPT (置信度 89%)\n' +
          '建议：对高AI概率段落进行人工改写，增加个人观点和具体案例。',
          12, function() { detectBtn.disabled = false; }
        );
      }, 700);
    });
  }

  var checkBtn = getMockBtn('prompt-checker');
  if (checkBtn) {
    checkBtn.addEventListener('click', function() {
      var input = document.getElementById('mock-input-prompt-checker');
      var output = document.getElementById('mock-output-prompt-checker');
      if (!input || !output) return;
      checkBtn.disabled = true;
      output.textContent = '';
      output.classList.add('active');
      setTimeout(function() {
        var score = Math.floor(Math.random() * 30) + 60;
        typewriter(output,
          '[提示词质量评分：' + score + '/100]\n\n' +
          '✅ 优势：\n' +
          '• 任务目标明确\n' +
          '• 角色设定清晰\n\n' +
          '⚠️ 改进建议：\n' +
          '• 缺少输出格式要求 — 建议增加"请用JSON/表格/分段文字输出"\n' +
          '• 缺少约束条件 — 建议增加字数限制或排除项\n' +
          '• 可增加示例(One-shot/Few-shot)提升输出质量\n\n' +
          '[优化后提示词]\n' +
          '请增加以上3项建议要素重写提示词，预计评分可提升至85+',
          15, function() { checkBtn.disabled = false; }
        );
      }, 500);
    });
  }

  var vidBtn = getMockBtn('video-prompt');
  if (vidBtn) {
    vidBtn.addEventListener('click', function() {
      var output = document.getElementById('mock-output-video-prompt');
      if (!output) return;
      vidBtn.disabled = true;
      output.textContent = '';
      output.classList.add('active');
      setTimeout(function() {
        typewriter(output,
          '[视频创作提示词]\n\n' +
          '【场景1 — 开场】0-5秒\n' +
          '航拍视角，城市天际线在晨光中逐渐亮起，暖金色光线铺满画面。中速推进，景别从大远景过渡到中景。\n\n' +
          '【场景2 — 主体】5-15秒\n' +
          '室内咖啡厅，阳光透过落地窗洒在木桌上。青年设计师正在手绘草图，特写手部动作和专注表情的交错剪辑。\n\n' +
          '【场景3 — 高潮】15-22秒\n' +
          '快速蒙太奇：草图→3D模型→产品渲染→用户使用场景，节奏加快，画面色彩饱和度渐变增强。\n\n' +
          '[适用] Runway Gen-3 / Pika 2.0 / Kling',
          12, function() { vidBtn.disabled = false; }
        );
      }, 600);
    });
  }
})();
