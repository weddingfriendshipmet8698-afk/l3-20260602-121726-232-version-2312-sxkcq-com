(function () {
  window.initPlayer = function (videoId, source, buttonId, coverId) {
    var video = document.getElementById(videoId);
    var button = document.getElementById(buttonId);
    var cover = document.getElementById(coverId);
    var attached = false;

    function attach() {
      if (attached || !video) {
        return;
      }
      attached = true;
      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = source;
      } else if (window.Hls && window.Hls.isSupported()) {
        var hls = new window.Hls({ enableWorker: true, lowLatencyMode: true });
        hls.loadSource(source);
        hls.attachMedia(video);
      } else {
        video.src = source;
      }
    }

    function start() {
      attach();
      if (cover) {
        cover.hidden = true;
      }
      video.setAttribute('controls', 'controls');
      var playTask = video.play();
      if (playTask && typeof playTask.catch === 'function') {
        playTask.catch(function () {
          video.setAttribute('controls', 'controls');
        });
      }
    }

    if (button) {
      button.addEventListener('click', start);
    }
    if (cover) {
      cover.addEventListener('click', start);
    }
    if (video) {
      video.addEventListener('play', function () {
        if (cover) {
          cover.hidden = true;
        }
      });
    }
  };
})();
