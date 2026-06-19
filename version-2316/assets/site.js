(function () {
  var menuButton = document.querySelector('[data-menu-toggle]');
  var mobileNav = document.querySelector('[data-mobile-nav]');
  if (menuButton && mobileNav) {
    menuButton.addEventListener('click', function () {
      mobileNav.classList.toggle('is-open');
    });
  }

  var searchButton = document.querySelector('[data-search-toggle]');
  var searchPanel = document.querySelector('[data-search-panel]');
  if (searchButton && searchPanel) {
    searchButton.addEventListener('click', function () {
      searchPanel.classList.toggle('is-open');
      var input = searchPanel.querySelector('input');
      if (input) {
        input.focus();
      }
    });
  }

  var slides = Array.prototype.slice.call(document.querySelectorAll('[data-hero-slide]'));
  var dots = Array.prototype.slice.call(document.querySelectorAll('[data-hero-dot]'));
  if (slides.length) {
    var index = 0;
    var show = function (next) {
      index = (next + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle('is-active', i === index);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle('is-active', i === index);
      });
    };
    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () {
        show(i);
      });
    });
    show(0);
    setInterval(function () {
      show(index + 1);
    }, 5200);
  }

  var filterInput = document.querySelector('[data-filter-input]');
  var cards = Array.prototype.slice.call(document.querySelectorAll('[data-search]'));
  var empty = document.querySelector('[data-empty-state]');
  var applyFilter = function () {
    if (!filterInput || !cards.length) {
      return;
    }
    var keyword = filterInput.value.trim().toLowerCase();
    var matched = 0;
    cards.forEach(function (card) {
      var text = card.getAttribute('data-search') || '';
      var ok = !keyword || text.indexOf(keyword) !== -1;
      card.classList.toggle('is-hidden', !ok);
      if (ok) {
        matched += 1;
      }
    });
    if (empty) {
      empty.classList.toggle('is-hidden', matched !== 0);
    }
  };
  if (filterInput) {
    var params = new URLSearchParams(window.location.search);
    var q = params.get('q');
    if (q) {
      filterInput.value = q;
    }
    filterInput.addEventListener('input', applyFilter);
    applyFilter();
  }
})();
