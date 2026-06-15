(function () {
  var segments = [];
  var activeSegmentIdx = -1;
  var audio = document.getElementById('audioElement');

  function loadTranscript() {
    var container = document.getElementById('transcriptSegments');
    var titleEl = document.getElementById('transcriptTitle');

    fetch('/transcript_sample.json')
      .then(function (r) { return r.json(); })
      .then(function (data) {
        segments = data.segments;
        titleEl.textContent = data.title;
        renderSegments();
      })
      .catch(function () {
        fetch('/data/transcript_sample.json')
          .then(function (r) { return r.json(); })
          .then(function (d) {
            segments = d.segments;
            titleEl.textContent = d.title;
            renderSegments();
          });
      });
  }

  function renderSegments() {
    var container = document.getElementById('transcriptSegments');
    var html = '';
    segments.forEach(function (seg, idx) {
      var wordsHtml = seg.text;

      html += '<div class="transcript-segment" data-seg="' + idx + '" data-start="' + seg.start + '">' +
        '<span class="segment-time">' + formatTime(seg.start) + '</span>' +
        '<div class="segment-body">' +
          '<div class="segment-speaker speaker-' + seg.speaker + '">Speaker ' + seg.speaker + '</div>' +
          '<p class="segment-text">' + wordsHtml + '</p>' +
        '</div>' +
      '</div>';
    });
    container.innerHTML = html;

    container.addEventListener('click', function (e) {
      var segEl = e.target.closest('.transcript-segment');
      if (segEl) {
        var t = parseFloat(segEl.getAttribute('data-start'));
        if (!isNaN(t) && audio) {
          audio.currentTime = t;
          if (audio.paused) audio.play();
          document.getElementById('iconPlay').style.display = 'none';
          document.getElementById('iconPause').style.display = 'block';
        }
      }
    });
  }

  function highlightSegment(currentTime) {
    var newIdx = -1;
    for (var i = 0; i < segments.length; i++) {
      if (currentTime >= segments[i].start && currentTime <= segments[i].end) {
        newIdx = i;
        break;
      }
    }
    if (newIdx === activeSegmentIdx) return;

    var allSegs = document.querySelectorAll('.transcript-segment');
    for (var j = 0; j < allSegs.length; j++) {
      allSegs[j].classList.remove('active');
    }

    if (newIdx >= 0) {
      var active = document.querySelector('.transcript-segment[data-seg="' + newIdx + '"]');
      if (active) {
        active.classList.add('active');
        active.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
    activeSegmentIdx = newIdx;
  }

  function formatTime(seconds) {
    var m = Math.floor(seconds / 60);
    var s = Math.floor(seconds % 60);
    return String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0');
  }

  // Export functionality
  document.addEventListener('DOMContentLoaded', function () {
    var exportBtns = document.querySelectorAll('.export-btn');
    for (var i = 0; i < exportBtns.length; i++) {
      exportBtns[i].addEventListener('click', function () {
        var format = this.getAttribute('data-format');
        doExport(format);
      });
    }
  });

  function doExport(format) {
    if (segments.length === 0) return;
    var content = '';
    var filename = 'transcript';
    var mime = 'text/plain';

    switch (format) {
      case 'txt':
        content = segments.map(function (s) {
          return '[' + formatTime(s.start) + '] Speaker ' + s.speaker + ': ' + s.text;
        }).join('\n\n');
        filename += '.txt';
        break;
      case 'srt':
        content = segments.map(function (s, i) {
          return (i + 1) + '\n' +
            srtTime(s.start) + ' --> ' + srtTime(s.end) + '\n' +
            'Speaker ' + s.speaker + ': ' + s.text;
        }).join('\n\n');
        filename += '.srt';
        break;
      case 'docx':
        content = '【转录稿 — 此为模拟导出】\n\n' +
          segments.map(function (s) {
            return '[' + formatTime(s.start) + '] Speaker ' + s.speaker + ': ' + s.text;
          }).join('\n\n');
        filename += '.txt';
        mime = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
        break;
      case 'pdf':
        content = '【转录稿 — 此为模拟导出】\n\n' +
          segments.map(function (s) {
            return '[' + formatTime(s.start) + '] Speaker ' + s.speaker + ': ' + s.text;
          }).join('\n\n');
        filename += '.txt';
        mime = 'application/pdf';
        break;
    }

    var blob = new Blob([content], { type: mime });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function srtTime(seconds) {
    var h = Math.floor(seconds / 3600);
    var m = Math.floor((seconds % 3600) / 60);
    var s = Math.floor(seconds % 60);
    var ms = Math.floor((seconds % 1) * 1000);
    return String(h).padStart(2, '0') + ':' +
      String(m).padStart(2, '0') + ':' +
      String(s).padStart(2, '0') + ',' +
      String(ms).padStart(3, '0');
  }

  window.SoundWiseSimulate = {
    loadTranscript: loadTranscript,
    highlightSegment: highlightSegment
  };
})();
