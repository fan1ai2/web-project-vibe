(function () {
  var audio, btnPlay, iconPlay, iconPause, timeCurrent, timeTotal, seekBar, seekProgress, speedSelect;
  var initCalled = false;

  function formatTime(seconds) {
    if (isNaN(seconds)) return '00:00';
    var m = Math.floor(seconds / 60);
    var s = Math.floor(seconds % 60);
    return String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0');
  }

  function init() {
    if (initCalled) return;
    initCalled = true;

    audio = document.getElementById('audioElement');
    btnPlay = document.getElementById('btnPlay');
    iconPlay = document.getElementById('iconPlay');
    iconPause = document.getElementById('iconPause');
    timeCurrent = document.getElementById('timeCurrent');
    timeTotal = document.getElementById('timeTotal');
    seekBar = document.getElementById('seekBar');
    seekProgress = document.getElementById('seekProgress');
    speedSelect = document.getElementById('speedSelect');

    audio.addEventListener('loadedmetadata', function () {
      timeTotal.textContent = formatTime(audio.duration);
    });

    audio.addEventListener('timeupdate', function () {
      timeCurrent.textContent = formatTime(audio.currentTime);
      var pct = (audio.currentTime / audio.duration) * 100 || 0;
      seekProgress.style.width = pct + '%';

      if (typeof window.SoundWiseSimulate !== 'undefined') {
        window.SoundWiseSimulate.highlightSegment(audio.currentTime);
      }
    });

    btnPlay.addEventListener('click', function () {
      if (audio.paused) {
        audio.play();
        iconPlay.style.display = 'none';
        iconPause.style.display = 'block';
      } else {
        audio.pause();
        iconPlay.style.display = 'block';
        iconPause.style.display = 'none';
      }
    });

    audio.addEventListener('ended', function () {
      iconPlay.style.display = 'block';
      iconPause.style.display = 'none';
    });

    seekBar.addEventListener('click', function (e) {
      var rect = seekBar.getBoundingClientRect();
      var pct = (e.clientX - rect.left) / rect.width;
      audio.currentTime = pct * audio.duration;
    });

    speedSelect.addEventListener('change', function () {
      audio.playbackRate = parseFloat(this.value);
    });
  }

  window.SoundWisePlayer = { init: init };
})();
