(function () {
    function ready(fn) {
        if (document.readyState !== "loading") {
            fn();
            return;
        }
        document.addEventListener("DOMContentLoaded", fn);
    }

    function getPrefix() {
        return document.body.getAttribute("data-prefix") || "./";
    }

    function setupMobileMenu() {
        var button = document.querySelector("[data-menu-button]");
        var menu = document.querySelector("[data-mobile-menu]");
        if (!button || !menu) {
            return;
        }
        button.addEventListener("click", function () {
            var opened = menu.classList.toggle("hidden");
            button.setAttribute("aria-expanded", opened ? "false" : "true");
        });
    }

    function setupSearchForms() {
        var forms = document.querySelectorAll("[data-search-form]");
        forms.forEach(function (form) {
            form.addEventListener("submit", function (event) {
                event.preventDefault();
                var input = form.querySelector("input[type='search'], input[type='text']");
                var value = input ? input.value.trim() : "";
                if (!value) {
                    return;
                }
                window.location.href = getPrefix() + "search.html?q=" + encodeURIComponent(value);
            });
        });
    }

    function setupHero() {
        var hero = document.querySelector("[data-hero]");
        if (!hero) {
            return;
        }
        var slides = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-slide]"));
        var dots = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-dot]"));
        var prev = hero.querySelector("[data-hero-prev]");
        var next = hero.querySelector("[data-hero-next]");
        var current = 0;
        var timer = null;

        function show(index) {
            if (!slides.length) {
                return;
            }
            current = (index + slides.length) % slides.length;
            slides.forEach(function (slide, i) {
                slide.classList.toggle("is-active", i === current);
            });
            dots.forEach(function (dot, i) {
                dot.classList.toggle("is-active", i === current);
            });
        }

        function restart() {
            if (timer) {
                window.clearInterval(timer);
            }
            timer = window.setInterval(function () {
                show(current + 1);
            }, 5200);
        }

        if (prev) {
            prev.addEventListener("click", function () {
                show(current - 1);
                restart();
            });
        }
        if (next) {
            next.addEventListener("click", function () {
                show(current + 1);
                restart();
            });
        }
        dots.forEach(function (dot, i) {
            dot.addEventListener("click", function () {
                show(i);
                restart();
            });
        });
        show(0);
        restart();
    }

    function setupCardFilter() {
        var input = document.querySelector("[data-filter-input]");
        var cards = Array.prototype.slice.call(document.querySelectorAll("[data-movie-card]"));
        if (!input || !cards.length) {
            return;
        }
        input.addEventListener("input", function () {
            var value = input.value.trim().toLowerCase();
            cards.forEach(function (card) {
                var text = (card.getAttribute("data-search") || "").toLowerCase();
                card.classList.toggle("is-hidden", value && text.indexOf(value) === -1);
            });
        });
    }

    function escapeHtml(value) {
        return String(value || "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    function highlight(value, keyword) {
        var safe = escapeHtml(value);
        if (!keyword) {
            return safe;
        }
        var pattern = new RegExp("(" + keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + ")", "ig");
        return safe.replace(pattern, "<mark>$1</mark>");
    }

    function setupSearchPage() {
        var container = document.querySelector("[data-search-results]");
        if (!container || typeof SEARCH_MOVIES === "undefined") {
            return;
        }
        var input = document.querySelector("[data-search-page-input]");
        var title = document.querySelector("[data-search-title]");
        var params = new URLSearchParams(window.location.search);
        var keyword = (params.get("q") || "").trim();
        if (input) {
            input.value = keyword;
        }

        function render(value) {
            var term = value.trim().toLowerCase();
            if (!term) {
                container.innerHTML = '<div class="bg-white rounded-xl shadow-lg p-10 text-center text-gray-500">输入关键词即可搜索影片</div>';
                if (title) {
                    title.textContent = "搜索影片";
                }
                return;
            }
            var results = SEARCH_MOVIES.filter(function (movie) {
                return movie.search.indexOf(term) !== -1;
            });
            if (title) {
                title.textContent = "搜索：" + value.trim();
            }
            if (!results.length) {
                container.innerHTML = '<div class="bg-white rounded-xl shadow-lg p-10 text-center text-gray-500">没有找到匹配影片</div>';
                return;
            }
            container.innerHTML = results.map(function (movie) {
                return '<a href="' + escapeHtml(movie.url) + '" class="search-result-card flex gap-4 bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group">'
                    + '<div class="relative w-32 sm:w-44 flex-shrink-0 bg-slate-900">'
                    + '<img src="' + escapeHtml(movie.cover) + '" alt="' + escapeHtml(movie.title) + '" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy">'
                    + '</div>'
                    + '<div class="flex-1 p-4 min-w-0">'
                    + '<span class="inline-block px-2 py-1 bg-teal-100 text-teal-800 text-xs rounded mb-2">' + escapeHtml(movie.category) + '</span>'
                    + '<h2 class="text-lg sm:text-xl font-bold text-gray-900 mb-2 group-hover:text-teal-600 transition-colors line-clamp-2">' + highlight(movie.title, value.trim()) + '</h2>'
                    + '<p class="text-sm text-gray-600 mb-3 line-clamp-2">' + highlight(movie.oneLine, value.trim()) + '</p>'
                    + '<div class="flex flex-wrap items-center gap-3 text-xs text-gray-500">'
                    + '<span>' + escapeHtml(movie.year) + '年</span>'
                    + '<span>' + escapeHtml(movie.region) + '</span>'
                    + '<span>' + escapeHtml(movie.genre) + '</span>'
                    + '</div>'
                    + '</div>'
                    + '</a>';
            }).join("");
        }

        render(keyword);
        if (input) {
            input.addEventListener("input", function () {
                render(input.value);
            });
        }
    }

    ready(function () {
        setupMobileMenu();
        setupSearchForms();
        setupHero();
        setupCardFilter();
        setupSearchPage();
    });
})();
