(function() {
    var menuButton = document.querySelector('[data-menu-button]');
    var mobileMenu = document.querySelector('[data-mobile-menu]');

    if (menuButton && mobileMenu) {
        menuButton.addEventListener('click', function() {
            mobileMenu.classList.toggle('is-open');
        });
    }

    var hero = document.querySelector('[data-hero]');
    if (hero) {
        var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
        var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
        var index = 0;

        function showSlide(nextIndex) {
            if (!slides.length) {
                return;
            }
            index = (nextIndex + slides.length) % slides.length;
            slides.forEach(function(slide, slideIndex) {
                slide.classList.toggle('is-active', slideIndex === index);
            });
            dots.forEach(function(dot, dotIndex) {
                dot.classList.toggle('is-active', dotIndex === index);
            });
        }

        dots.forEach(function(dot, dotIndex) {
            dot.addEventListener('click', function() {
                showSlide(dotIndex);
            });
        });

        if (slides.length > 1) {
            setInterval(function() {
                showSlide(index + 1);
            }, 5600);
        }
    }

    var searchInputs = Array.prototype.slice.call(document.querySelectorAll('.search-input'));
    var cards = Array.prototype.slice.call(document.querySelectorAll('.movie-card'));
    var filterButtons = Array.prototype.slice.call(document.querySelectorAll('.filter-btn'));
    var activeFilter = 'all';

    function applyFilters() {
        var query = searchInputs.map(function(input) {
            return input.value.trim().toLowerCase();
        }).find(function(value) {
            return value.length > 0;
        }) || '';

        cards.forEach(function(card) {
            var searchText = (card.getAttribute('data-search') || '').toLowerCase();
            var kind = (card.getAttribute('data-kind') || '').toLowerCase();
            var year = (card.getAttribute('data-year') || '').toLowerCase();
            var filter = activeFilter.toLowerCase();
            var matchesQuery = !query || searchText.indexOf(query) !== -1 || kind.indexOf(query) !== -1 || year.indexOf(query) !== -1;
            var matchesFilter = filter === 'all' || searchText.indexOf(filter) !== -1 || kind.indexOf(filter) !== -1 || year.indexOf(filter) !== -1;
            card.classList.toggle('is-filtered-out', !(matchesQuery && matchesFilter));
        });
    }

    searchInputs.forEach(function(input) {
        input.addEventListener('input', applyFilters);
    });

    filterButtons.forEach(function(button) {
        button.addEventListener('click', function() {
            activeFilter = button.getAttribute('data-filter') || 'all';
            filterButtons.forEach(function(item) {
                item.classList.toggle('is-active', item === button);
            });
            applyFilters();
        });
    });

    if (window.location.search) {
        var params = new URLSearchParams(window.location.search);
        var q = params.get('q');
        if (q && searchInputs.length) {
            searchInputs[0].value = q;
            applyFilters();
        }
    }
})();
