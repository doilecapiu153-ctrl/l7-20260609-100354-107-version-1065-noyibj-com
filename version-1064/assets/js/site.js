(function () {
  function $(selector, root) {
    return (root || document).querySelector(selector);
  }

  function $all(selector, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(selector));
  }

  function setupMobileMenu() {
    var toggle = $('[data-menu-toggle]');
    var panel = $('[data-mobile-panel]');
    if (!toggle || !panel) {
      return;
    }

    toggle.addEventListener('click', function () {
      var isOpen = panel.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
  }

  function setupHeroCarousel() {
    var slides = $all('[data-hero-slide]');
    if (slides.length <= 1) {
      return;
    }

    var dots = $all('[data-hero-dot]');
    var prev = $('[data-hero-prev]');
    var next = $('[data-hero-next]');
    var index = 0;
    var timer = null;

    function render() {
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('is-active', slideIndex === index);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('is-active', dotIndex === index);
      });
    }

    function go(delta) {
      index = (index + delta + slides.length) % slides.length;
      render();
    }

    function restart() {
      if (timer) {
        window.clearInterval(timer);
      }
      timer = window.setInterval(function () {
        go(1);
      }, 5000);
    }

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        index = Number(dot.getAttribute('data-hero-dot')) || 0;
        render();
        restart();
      });
    });

    if (prev) {
      prev.addEventListener('click', function () {
        go(-1);
        restart();
      });
    }

    if (next) {
      next.addEventListener('click', function () {
        go(1);
        restart();
      });
    }

    restart();
  }

  function setupImageFallback() {
    $all('img').forEach(function (image) {
      image.addEventListener('error', function () {
        image.classList.add('image-missing');
      });
    });
  }

  function setupCategoryFilters() {
    var list = $('[data-filter-list]');
    if (!list) {
      return;
    }

    var searchInput = $('[data-filter-search]');
    var yearSelect = $('[data-filter-year]');
    var typeSelect = $('[data-filter-type]');
    var count = $('[data-filter-count]');
    var cards = $all('.js-filter-card', list);

    function applyFilters() {
      var keyword = searchInput ? searchInput.value.trim().toLowerCase() : '';
      var year = yearSelect ? yearSelect.value : '';
      var type = typeSelect ? typeSelect.value : '';
      var visible = 0;

      cards.forEach(function (card) {
        var text = card.getAttribute('data-search-text') || '';
        var cardYear = card.getAttribute('data-year') || '';
        var cardType = card.getAttribute('data-type') || '';
        var matched = true;

        if (keyword && text.indexOf(keyword) === -1) {
          matched = false;
        }
        if (year && cardYear !== year) {
          matched = false;
        }
        if (type && cardType !== type) {
          matched = false;
        }

        card.classList.toggle('is-hidden', !matched);
        if (matched) {
          visible += 1;
        }
      });

      if (count) {
        count.textContent = String(visible);
      }
    }

    [searchInput, yearSelect, typeSelect].forEach(function (control) {
      if (control) {
        control.addEventListener('input', applyFilters);
        control.addEventListener('change', applyFilters);
      }
    });
  }

  function setupBackTop() {
    $all('[data-back-top]').forEach(function (button) {
      button.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    setupMobileMenu();
    setupHeroCarousel();
    setupImageFallback();
    setupCategoryFilters();
    setupBackTop();
  });
})();
