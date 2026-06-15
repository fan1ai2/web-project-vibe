(function () {
  var uploadArea = document.getElementById('uploadArea');
  var fileInput = document.getElementById('fileInput');
  var uploadInitial = document.getElementById('uploadInitial');
  var uploadSelected = document.getElementById('uploadSelected');
  var uploadProgress = document.getElementById('uploadProgress');
  var btnTranscribe = document.getElementById('btnTranscribe');
  var audio = document.getElementById('audioElement');
  var playerBar = document.getElementById('playerBar');
  var exportBar = document.getElementById('exportBar');
  var transcriptPanel = document.getElementById('transcriptPanel');
  var transcriptContent = document.getElementById('transcriptContent');
  var transcriptEmpty = document.getElementById('transcriptEmpty');
  var progressStatus = document.getElementById('progressStatus');

  var selectedFile = null;

  function formatTime(seconds) {
    var m = Math.floor(seconds / 60);
    var s = Math.floor(seconds % 60);
    return m + ':' + String(s).padStart(2, '0');
  }

  function formatSize(bytes) {
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  }

  function handleFile(file) {
    if (!file) return;
    selectedFile = file;
    document.getElementById('fileName').textContent = file.name;
    document.getElementById('fileSize').textContent = formatSize(file.size);

    audio.src = URL.createObjectURL(file);
    audio.onloadedmetadata = function () {
      document.getElementById('fileDuration').textContent = formatTime(audio.duration);
    };

    uploadInitial.style.display = 'none';
    uploadSelected.style.display = 'block';
  }

  fileInput.addEventListener('change', function (e) {
    handleFile(e.target.files[0]);
  });

  uploadArea.addEventListener('dragover', function (e) {
    e.preventDefault();
    uploadArea.classList.add('drag-over');
  });

  uploadArea.addEventListener('dragleave', function () {
    uploadArea.classList.remove('drag-over');
  });

  uploadArea.addEventListener('drop', function (e) {
    e.preventDefault();
    uploadArea.classList.remove('drag-over');
    handleFile(e.dataTransfer.files[0]);
  });

  btnTranscribe.addEventListener('click', function () {
    if (!selectedFile) return;
    uploadSelected.style.display = 'none';
    uploadProgress.style.display = 'block';

    var statuses = ['status_detecting', 'status_transcribing', 'status_timestamps', 'status_complete'];
    var dots = document.querySelectorAll('.progress-dot');
    var i = 0;
    var statusInterval = setInterval(function () {
      if (i >= statuses.length) {
        clearInterval(statusInterval);
        uploadProgress.style.display = 'none';
        playerBar.style.display = 'block';
        transcriptPanel.style.display = 'block';
        transcriptEmpty.style.display = 'none';
        transcriptContent.style.display = 'block';
        exportBar.style.display = 'flex';

        if (typeof window.SoundWiseSimulate !== 'undefined') {
          window.SoundWiseSimulate.loadTranscript();
        }
        if (typeof window.SoundWisePlayer !== 'undefined') {
          window.SoundWisePlayer.init();
        }
        return;
      }

      var key = statuses[i];
      progressStatus.textContent = getI18n(key);
      for (var d = 0; d < dots.length; d++) {
        dots[d].classList.toggle('active', d <= i);
      }
      i++;
    }, 900);
  });

  function getI18n(key) {
    var map = {
      status_detecting: '正在识别语言…',
      status_transcribing: 'AI 转写中…',
      status_timestamps: '生成时间戳…',
      status_complete: '转录完成'
    };
    return map[key] || key;
  }
})();
