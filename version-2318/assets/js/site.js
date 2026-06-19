(function () {
    function ready(fn) {
        if (document.readyState !== 'loading') {
            fn();
            return;
        }
        document.addEventListener('DOMContentLoaded', fn);
    }

    ready(function () {
        var searchToggle = document.querySelector('.search-toggle');
        var searchPanel = document.querySelector('[data-search-panel]');
        var menuToggle = document.querySelector('.menu-toggle');
        var mobileNav = document.querySelector('.mobile-nav');

        if (searchToggle && searchPanel) {
            searchToggle.addEventListener('click', function () {
                searchPanel.classList.toggle('is-open');
                var input = searchPanel.querySelector('input');
                if (searchPanel.classList.contains('is-open') && input) {
                    input.focus();
                }
            });
        }

        if (menuToggle && mobileNav) {
            menuToggle.addEventListener('click', function () {
                var open = mobileNav.classList.toggle('is-open');
                menuToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
            });
        }

        var cards = Array.prototype.slice.call(document.querySelectorAll('.movie-card'));
        var emptyStates = Array.prototype.slice.call(document.querySelectorAll('.empty-state'));
        var inputs = Array.prototype.slice.call(document.querySelectorAll('.site-search'));
        var activeType = 'all';

        function normalize(value) {
            return String(value || '').trim().toLowerCase();
        }

        function applySearch(value) {
            var keyword = normalize(value);
            var visibleCount = 0;
            cards.forEach(function (card) {
                var text = normalize(card.getAttribute('data-search'));
                var type = normalize(card.getAttribute('data-type'));
                var keywordOk = !keyword || text.indexOf(keyword) !== -1;
                var typeOk = activeType === 'all' || type.indexOf(normalize(activeType)) !== -1;
                var show = keywordOk && typeOk;
                card.style.display = show ? '' : 'none';
                if (show) {
                    visibleCount += 1;
                }
            });
            emptyStates.forEach(function (item) {
                item.classList.toggle('is-visible', cards.length > 0 && visibleCount === 0);
            });
        }

        inputs.forEach(function (input) {
            input.addEventListener('input', function () {
                applySearch(input.value);
            });
        });

        var filterButtons = Array.prototype.slice.call(document.querySelectorAll('[data-filter]'));
        filterButtons.forEach(function (button) {
            button.addEventListener('click', function () {
                filterButtons.forEach(function (btn) {
                    btn.classList.remove('active');
                });
                button.classList.add('active');
                activeType = button.getAttribute('data-filter') || 'all';
                var currentInput = document.querySelector('.list-toolbar .site-search') || document.querySelector('.site-search');
                applySearch(currentInput ? currentInput.value : '');
            });
        });

        var hero = document.querySelector('[data-hero]');
        if (hero) {
            var slides = Array.prototype.slice.call(hero.querySelectorAll('.hero-slide'));
            var dots = Array.prototype.slice.call(hero.querySelectorAll('.hero-dot'));
            var index = 0;
            var timer = null;

            function showSlide(next) {
                if (!slides.length) {
                    return;
                }
                index = (next + slides.length) % slides.length;
                slides.forEach(function (slide, i) {
                    slide.classList.toggle('is-active', i === index);
                });
                dots.forEach(function (dot, i) {
                    dot.classList.toggle('is-active', i === index);
                });
            }

            function startTimer() {
                window.clearInterval(timer);
                timer = window.setInterval(function () {
                    showSlide(index + 1);
                }, 6500);
            }

            dots.forEach(function (dot) {
                dot.addEventListener('click', function () {
                    showSlide(Number(dot.getAttribute('data-slide')) || 0);
                    startTimer();
                });
            });

            startTimer();
        }
    });
}());
