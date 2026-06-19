(function () {
  function ready(fn) {
    if (document.readyState !== 'loading') {
      fn();
    } else {
      document.addEventListener('DOMContentLoaded', fn);
    }
  }

  function setupMenu() {
    var button = document.querySelector('.menu-toggle');
    var panel = document.querySelector('.mobile-panel');
    if (!button || !panel) return;
    button.addEventListener('click', function () {
      var open = panel.classList.toggle('open');
      button.setAttribute('aria-expanded', String(open));
    });
  }

  function setupHero() {
    var slides = Array.prototype.slice.call(document.querySelectorAll('.hero-slide'));
    var dots = Array.prototype.slice.call(document.querySelectorAll('.hero-dot'));
    if (!slides.length) return;
    var current = 0;
    function show(index) {
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle('active', i === current);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle('active', i === current);
      });
    }
    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        show(Number(dot.getAttribute('data-target') || 0));
      });
    });
    window.setInterval(function () {
      show(current + 1);
    }, 5200);
  }

  function setupPlayers() {
    Array.prototype.slice.call(document.querySelectorAll('.video-player')).forEach(function (box) {
      var video = box.querySelector('video');
      var cover = box.querySelector('.player-cover');
      var message = box.querySelector('.player-message');
      var source = box.getAttribute('data-src');
      if (!video || !source) return;

      function setMessage(text) {
        if (message) message.textContent = text || '';
      }

      function loadSource() {
        if (video.getAttribute('data-ready') === '1') return;
        video.setAttribute('data-ready', '1');
        if (window.Hls && window.Hls.isSupported()) {
          var hls = new window.Hls({ enableWorker: true, lowLatencyMode: true });
          hls.loadSource(source);
          hls.attachMedia(video);
          hls.on(window.Hls.Events.ERROR, function (event, data) {
            if (!data || !data.fatal) return;
            setMessage('视频加载失败，请稍后重试');
            if (data.type === window.Hls.ErrorTypes.NETWORK_ERROR) {
              hls.startLoad();
            } else if (data.type === window.Hls.ErrorTypes.MEDIA_ERROR) {
              hls.recoverMediaError();
            } else {
              hls.destroy();
            }
          });
        } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
          video.src = source;
        } else {
          setMessage('此浏览器暂不支持播放该视频');
        }
      }

      function playVideo() {
        loadSource();
        video.controls = true;
        var attempt = video.play();
        if (attempt && attempt.catch) {
          attempt.catch(function () {
            setMessage('点击视频区域继续播放');
          });
        }
      }

      if (cover) {
        cover.addEventListener('click', playVideo);
      }
      video.addEventListener('click', function () {
        if (video.paused) {
          playVideo();
        } else {
          video.pause();
        }
      });
      video.addEventListener('play', function () {
        if (cover) cover.classList.add('hidden');
        setMessage('');
      });
      video.addEventListener('pause', function () {
        if (cover) cover.classList.remove('hidden');
      });
    });
  }

  function escapeHtml(value) {
    return String(value || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function setupSearch() {
    var results = document.getElementById('searchResults');
    var title = document.getElementById('searchTitle');
    var input = document.getElementById('searchInput');
    var data = window.VIDEO_SEARCH_INDEX || [];
    if (!results || !data.length) return;
    var params = new URLSearchParams(window.location.search);
    var query = params.get('q') || '';
    if (input) input.value = query;

    function render(list, q) {
      if (title) title.textContent = q ? '“' + q + '”相关影片' : '精选内容';
      if (!q) return;
      if (!list.length) {
        results.innerHTML = '<p class="lead" style="color:#374151">没有找到完全匹配的影片，请尝试更换关键词。</p>';
        return;
      }
      results.innerHTML = list.slice(0, 120).map(function (item) {
        return '<article class="movie-card compact-card">'
          + '<a class="poster-link" href="' + item.href + '">'
          + '<img src="' + item.cover + '" alt="' + escapeHtml(item.title) + '" loading="lazy">'
          + '<span class="poster-badge">' + escapeHtml(item.year) + '</span></a>'
          + '<div class="card-body"><div class="card-meta"><span>' + escapeHtml(item.type) + '</span><span>' + escapeHtml(item.region) + '</span></div>'
          + '<h2><a href="' + item.href + '">' + escapeHtml(item.title) + '</a></h2>'
          + '<p>' + escapeHtml(item.oneLine) + '</p>'
          + '<div class="tag-row"><span>' + escapeHtml(item.genre) + '</span></div></div></article>';
      }).join('');
    }

    if (query) {
      var q = query.trim().toLowerCase();
      var filtered = data.filter(function (item) {
        return item.searchText.indexOf(q) !== -1;
      });
      render(filtered, query.trim());
    }
  }

  ready(function () {
    setupMenu();
    setupHero();
    setupPlayers();
    setupSearch();
  });
})();
