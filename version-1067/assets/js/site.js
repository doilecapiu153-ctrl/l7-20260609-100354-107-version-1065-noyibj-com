(function () {
  function qs(selector, root) {
    return (root || document).querySelector(selector);
  }

  function qsa(selector, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(selector));
  }

  function setupMenu() {
    var button = qs('[data-menu-toggle]');
    var links = qs('[data-nav-links]');
    if (!button || !links) {
      return;
    }
    button.addEventListener('click', function () {
      links.classList.toggle('is-open');
    });
  }

  function setupHero() {
    var root = qs('[data-hero-carousel]');
    if (!root) {
      return;
    }
    var slides = qsa('[data-hero-slide]', root);
    var dots = qsa('[data-hero-dot]', root);
    var prev = qs('[data-hero-prev]', root);
    var next = qs('[data-hero-next]', root);
    var index = 0;
    var timer = null;

    function show(nextIndex) {
      if (!slides.length) {
        return;
      }
      index = (nextIndex + slides.length) % slides.length;
      slides.forEach(function (slide, itemIndex) {
        slide.classList.toggle('is-active', itemIndex === index);
      });
      dots.forEach(function (dot, itemIndex) {
        dot.classList.toggle('is-active', itemIndex === index);
      });
    }

    function start() {
      stop();
      timer = window.setInterval(function () {
        show(index + 1);
      }, 5200);
    }

    function stop() {
      if (timer) {
        window.clearInterval(timer);
        timer = null;
      }
    }

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        show(Number(dot.getAttribute('data-hero-dot') || 0));
        start();
      });
    });

    if (prev) {
      prev.addEventListener('click', function () {
        show(index - 1);
        start();
      });
    }

    if (next) {
      next.addEventListener('click', function () {
        show(index + 1);
        start();
      });
    }

    root.addEventListener('mouseenter', stop);
    root.addEventListener('mouseleave', start);
    show(0);
    start();
  }

  function setupRails() {
    qsa('[data-rail]').forEach(function (rail) {
      var track = qs('[data-rail-track]', rail);
      var left = qs('[data-rail-left]', rail);
      var right = qs('[data-rail-right]', rail);
      if (!track) {
        return;
      }
      function move(direction) {
        track.scrollBy({ left: direction * 420, behavior: 'smooth' });
      }
      if (left) {
        left.addEventListener('click', function () {
          move(-1);
        });
      }
      if (right) {
        right.addEventListener('click', function () {
          move(1);
        });
      }
    });
  }

  function setupFilters() {
    var panel = qs('[data-filter-panel]');
    var grid = qs('[data-card-grid]');
    if (!panel || !grid) {
      return;
    }
    var search = qs('[data-card-search]', panel);
    var year = qs('[data-card-year]', panel);
    var type = qs('[data-card-type]', panel);
    var empty = qs('[data-empty-state]');
    var cards = qsa('.movie-card', grid);

    function normalize(value) {
      return String(value || '').trim().toLowerCase();
    }

    function apply() {
      var query = normalize(search && search.value);
      var selectedYear = normalize(year && year.value);
      var selectedType = normalize(type && type.value);
      var visible = 0;

      cards.forEach(function (card) {
        var text = normalize([
          card.getAttribute('data-title'),
          card.getAttribute('data-year'),
          card.getAttribute('data-type'),
          card.getAttribute('data-genre'),
          card.getAttribute('data-region'),
          card.textContent
        ].join(' '));
        var cardYear = normalize(card.getAttribute('data-year'));
        var cardType = normalize(card.getAttribute('data-type'));
        var ok = true;
        if (query && text.indexOf(query) === -1) {
          ok = false;
        }
        if (selectedYear && cardYear !== selectedYear) {
          ok = false;
        }
        if (selectedType && cardType !== selectedType) {
          ok = false;
        }
        card.style.display = ok ? '' : 'none';
        if (ok) {
          visible += 1;
        }
      });

      if (empty) {
        empty.classList.toggle('is-visible', visible === 0);
      }
    }

    [search, year, type].forEach(function (control) {
      if (control) {
        control.addEventListener('input', apply);
        control.addEventListener('change', apply);
      }
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    setupMenu();
    setupHero();
    setupRails();
    setupFilters();
  });
})();
