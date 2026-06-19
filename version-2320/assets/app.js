(function() {
    var toggle = document.querySelector('[data-menu-toggle]');
    var mobileNav = document.querySelector('[data-mobile-nav]');
    if (toggle && mobileNav) {
        toggle.addEventListener('click', function() {
            mobileNav.classList.toggle('is-open');
        });
    }

    var slides = Array.prototype.slice.call(document.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(document.querySelectorAll('[data-hero-dot]'));
    var features = Array.prototype.slice.call(document.querySelectorAll('[data-hero-feature]'));
    if (slides.length > 1) {
        var current = 0;
        var show = function(index) {
            current = index;
            slides.forEach(function(slide, i) {
                slide.classList.toggle('is-active', i === index);
            });
            dots.forEach(function(dot, i) {
                dot.classList.toggle('is-active', i === index);
            });
            features.forEach(function(feature, i) {
                feature.classList.toggle('is-active', i === index);
            });
        };
        dots.forEach(function(dot, i) {
            dot.addEventListener('click', function() {
                show(i);
            });
        });
        setInterval(function() {
            show((current + 1) % slides.length);
        }, 5200);
    }

    var searchInput = document.querySelector('[data-search-input]');
    var yearSelect = document.querySelector('[data-year-filter]');
    var typeSelect = document.querySelector('[data-type-filter]');
    var searchableCards = Array.prototype.slice.call(document.querySelectorAll('[data-title]'));
    var emptyState = document.querySelector('[data-empty-state]');

    var filterCards = function() {
        var keyword = searchInput ? searchInput.value.trim().toLowerCase() : '';
        var year = yearSelect ? yearSelect.value : '';
        var type = typeSelect ? typeSelect.value : '';
        var visible = 0;
        searchableCards.forEach(function(card) {
            var haystack = [card.dataset.title, card.dataset.genre, card.dataset.region].join(' ').toLowerCase();
            var matchKeyword = !keyword || haystack.indexOf(keyword) !== -1;
            var matchYear = !year || card.dataset.year === year;
            var matchType = !type || haystack.indexOf(type.toLowerCase()) !== -1;
            var ok = matchKeyword && matchYear && matchType;
            card.style.display = ok ? '' : 'none';
            if (ok) {
                visible += 1;
            }
        });
        if (emptyState) {
            emptyState.style.display = visible ? 'none' : 'block';
        }
    };

    [searchInput, yearSelect, typeSelect].forEach(function(el) {
        if (el) {
            el.addEventListener('input', filterCards);
            el.addEventListener('change', filterCards);
        }
    });
})();

function initMoviePlayer(src) {
    var video = document.querySelector('[data-player-video]');
    var cover = document.querySelector('[data-player-cover]');
    var button = document.querySelector('[data-player-button]');
    if (!video || !src) {
        return;
    }
    var started = false;
    var start = function() {
        if (started) {
            video.play().catch(function() {});
            return;
        }
        started = true;
        video.setAttribute('controls', 'controls');
        if (cover) {
            cover.classList.add('is-hidden');
        }
        if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = src;
            video.play().catch(function() {});
            return;
        }
        if (window.Hls && window.Hls.isSupported()) {
            var hls = new window.Hls({ enableWorker: true });
            hls.loadSource(src);
            hls.attachMedia(video);
            hls.on(window.Hls.Events.MANIFEST_PARSED, function() {
                video.play().catch(function() {});
            });
            return;
        }
        video.src = src;
        video.play().catch(function() {});
    };
    if (cover) {
        cover.addEventListener('click', start);
    }
    if (button) {
        button.addEventListener('click', function(event) {
            event.stopPropagation();
            start();
        });
    }
    video.addEventListener('click', function() {
        if (!started) {
            start();
        }
    });
}
