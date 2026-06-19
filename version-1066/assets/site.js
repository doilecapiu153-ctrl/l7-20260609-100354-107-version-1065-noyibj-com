(function () {
    function $(selector, parent) {
        return (parent || document).querySelector(selector);
    }

    function $all(selector, parent) {
        return Array.prototype.slice.call((parent || document).querySelectorAll(selector));
    }

    function initNavigation() {
        var toggle = $('[data-nav-toggle]');
        var menu = $('[data-nav-menu]');
        if (!toggle || !menu) {
            return;
        }
        toggle.addEventListener('click', function () {
            menu.classList.toggle('is-open');
        });
    }

    function initSearchForms() {
        $all('[data-search-form]').forEach(function (form) {
            form.addEventListener('submit', function (event) {
                event.preventDefault();
                var input = form.querySelector('input[name="q"]');
                var value = input ? input.value.trim() : '';
                if (form.hasAttribute('data-local-search')) {
                    applyLocalFilter();
                    return;
                }
                window.location.href = value ? 'search.html?q=' + encodeURIComponent(value) : 'search.html';
            });
        });
    }

    function initHero() {
        var hero = $('[data-hero]');
        if (!hero) {
            return;
        }
        var slides = $all('[data-hero-slide]', hero);
        var dots = $all('[data-hero-dot]', hero);
        var prev = $('[data-hero-prev]', hero);
        var next = $('[data-hero-next]', hero);
        var index = 0;
        var timer = null;

        function show(target) {
            if (!slides.length) {
                return;
            }
            index = (target + slides.length) % slides.length;
            slides.forEach(function (slide, i) {
                slide.classList.toggle('is-active', i === index);
            });
            dots.forEach(function (dot, i) {
                dot.classList.toggle('is-active', i === index);
            });
        }

        function start() {
            stop();
            timer = window.setInterval(function () {
                show(index + 1);
            }, 5600);
        }

        function stop() {
            if (timer) {
                window.clearInterval(timer);
            }
        }

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
        dots.forEach(function (dot, i) {
            dot.addEventListener('click', function () {
                show(i);
                start();
            });
        });
        hero.addEventListener('mouseenter', stop);
        hero.addEventListener('mouseleave', start);
        start();
    }

    function textOf(card) {
        return [
            card.getAttribute('data-title') || '',
            card.getAttribute('data-tags') || '',
            card.getAttribute('data-type') || '',
            card.getAttribute('data-region') || '',
            card.textContent || ''
        ].join(' ').toLowerCase();
    }

    function applyLocalFilter() {
        var input = $('[data-search-input]');
        var query = input ? input.value.trim().toLowerCase() : '';
        var activeButton = $('.filter-bar button.is-active');
        var typeFilter = activeButton ? activeButton.getAttribute('data-type-filter') : '';
        var cards = $all('[data-card]');
        var visible = 0;
        cards.forEach(function (card) {
            var typeText = (card.getAttribute('data-type') || '') + ' ' + (card.getAttribute('data-tags') || '');
            var typeMatched = !typeFilter || typeText.indexOf(typeFilter) !== -1;
            var queryMatched = !query || textOf(card).indexOf(query) !== -1;
            var matched = typeMatched && queryMatched;
            card.style.display = matched ? '' : 'none';
            if (matched) {
                visible += 1;
            }
        });
        var empty = $('[data-empty-state]');
        if (empty) {
            empty.classList.toggle('is-visible', visible === 0);
        }
    }

    function initLocalFilters() {
        var input = $('[data-search-input]');
        var params = new URLSearchParams(window.location.search);
        var query = params.get('q') || '';
        if (input && query) {
            input.value = query;
        }
        if (input) {
            input.addEventListener('input', applyLocalFilter);
        }
        $all('.filter-bar button').forEach(function (button) {
            button.addEventListener('click', function () {
                $all('.filter-bar button').forEach(function (item) {
                    item.classList.remove('is-active');
                });
                button.classList.add('is-active');
                applyLocalFilter();
            });
        });
        if (input || $('.filter-bar')) {
            applyLocalFilter();
        }
    }

    window.setupMoviePlayer = function (url) {
        var video = document.getElementById('movie-video');
        var trigger = document.getElementById('play-trigger');
        var layer = document.getElementById('play-layer');
        if (!video || !trigger || !url) {
            return;
        }
        var loaded = false;
        function loadVideo() {
            if (!loaded) {
                if (video.canPlayType('application/vnd.apple.mpegurl')) {
                    video.src = url;
                } else if (window.Hls && window.Hls.isSupported()) {
                    var hls = new window.Hls({ enableWorker: true });
                    hls.loadSource(url);
                    hls.attachMedia(video);
                } else {
                    video.src = url;
                }
                loaded = true;
            }
            if (layer) {
                layer.classList.add('is-hidden');
            }
            video.controls = true;
            var promise = video.play();
            if (promise && promise.catch) {
                promise.catch(function () {});
            }
        }
        trigger.addEventListener('click', loadVideo);
        if (layer) {
            layer.addEventListener('click', function (event) {
                if (event.target === layer) {
                    loadVideo();
                }
            });
        }
        video.addEventListener('click', function () {
            if (!loaded) {
                loadVideo();
            }
        });
    };

    document.addEventListener('DOMContentLoaded', function () {
        initNavigation();
        initSearchForms();
        initHero();
        initLocalFilters();
    });
})();
