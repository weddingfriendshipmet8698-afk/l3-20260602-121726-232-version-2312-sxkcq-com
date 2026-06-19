(function () {
    function setupMoviePlayer(id, streamUrl) {
        var root = document.getElementById(id);
        if (!root) {
            return;
        }
        var video = root.querySelector('video');
        var button = root.querySelector('.play-cover');
        if (!video || !button) {
            return;
        }

        function revealButton() {
            button.classList.remove('is-hidden');
        }

        function requestPlay() {
            var playPromise = video.play();
            if (playPromise && typeof playPromise.catch === 'function') {
                playPromise.catch(revealButton);
            }
        }

        function attachAndPlay() {
            button.classList.add('is-hidden');
            if (video.canPlayType('application/vnd.apple.mpegurl')) {
                if (!video.getAttribute('src')) {
                    video.setAttribute('src', streamUrl);
                }
                requestPlay();
                return;
            }
            if (window.Hls && window.Hls.isSupported()) {
                if (!video.hlsPlayer) {
                    var hls = new window.Hls({
                        enableWorker: true,
                        lowLatencyMode: true
                    });
                    video.hlsPlayer = hls;
                    hls.loadSource(streamUrl);
                    hls.attachMedia(video);
                    hls.on(window.Hls.Events.MANIFEST_PARSED, requestPlay);
                    hls.on(window.Hls.Events.ERROR, function (event, data) {
                        if (data && data.fatal) {
                            revealButton();
                        }
                    });
                    return;
                }
                requestPlay();
                return;
            }
            if (!video.getAttribute('src')) {
                video.setAttribute('src', streamUrl);
            }
            requestPlay();
        }

        button.addEventListener('click', attachAndPlay);
        video.addEventListener('play', function () {
            button.classList.add('is-hidden');
        });
        video.addEventListener('pause', function () {
            if (video.currentTime === 0 || video.ended) {
                revealButton();
            }
        });
    }

    window.setupMoviePlayer = setupMoviePlayer;
}());
