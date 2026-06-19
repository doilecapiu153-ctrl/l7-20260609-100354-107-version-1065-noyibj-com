(function () {
  function ready(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback);
    } else {
      callback();
    }
  }

  function setupMobileMenu() {
    var button = document.querySelector(".mobile-menu-button");
    var nav = document.querySelector(".mobile-nav");
    if (!button || !nav) {
      return;
    }
    button.addEventListener("click", function () {
      var opened = nav.classList.toggle("is-open");
      button.setAttribute("aria-expanded", opened ? "true" : "false");
    });
  }

  function setupCarousel() {
    var carousel = document.querySelector("[data-carousel]");
    if (!carousel) {
      return;
    }
    var slides = Array.prototype.slice.call(carousel.querySelectorAll(".hero-slide"));
    var dots = Array.prototype.slice.call(carousel.querySelectorAll(".hero-dot"));
    var prev = carousel.querySelector("[data-prev]");
    var next = carousel.querySelector("[data-next]");
    var current = 0;
    var timer = null;

    function show(index) {
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle("is-active", slideIndex === current);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle("is-active", dotIndex === current);
      });
    }

    function start() {
      stop();
      timer = window.setInterval(function () {
        show(current + 1);
      }, 5200);
    }

    function stop() {
      if (timer) {
        window.clearInterval(timer);
        timer = null;
      }
    }

    dots.forEach(function (dot) {
      dot.addEventListener("click", function () {
        show(Number(dot.getAttribute("data-slide")) || 0);
        start();
      });
    });

    if (prev) {
      prev.addEventListener("click", function () {
        show(current - 1);
        start();
      });
    }

    if (next) {
      next.addEventListener("click", function () {
        show(current + 1);
        start();
      });
    }

    carousel.addEventListener("mouseenter", stop);
    carousel.addEventListener("mouseleave", start);
    show(0);
    start();
  }

  function normalize(value) {
    return String(value || "").trim().toLowerCase();
  }

  function getCardText(card) {
    return normalize([
      card.getAttribute("data-title"),
      card.getAttribute("data-region"),
      card.getAttribute("data-type"),
      card.getAttribute("data-year"),
      card.getAttribute("data-tags"),
      card.textContent
    ].join(" "));
  }

  function applyFilter(root, query, filter) {
    var cards = Array.prototype.slice.call(root.querySelectorAll(".movie-card, .movie-row"));
    var search = normalize(query);
    var tag = normalize(filter === "all" ? "" : filter);
    cards.forEach(function (card) {
      var text = getCardText(card);
      var matchesSearch = !search || text.indexOf(search) !== -1;
      var matchesTag = !tag || text.indexOf(tag) !== -1;
      card.classList.toggle("is-hidden", !(matchesSearch && matchesTag));
    });
  }

  function setupSearchAndFilter() {
    var root = document;
    var input = document.querySelector(".movie-search");
    var buttons = Array.prototype.slice.call(document.querySelectorAll("[data-filter]"));
    var params = new URLSearchParams(window.location.search);
    var activeFilter = "all";

    if (input && params.get("q")) {
      input.value = params.get("q");
    }

    function update() {
      applyFilter(root, input ? input.value : "", activeFilter);
    }

    if (input) {
      input.addEventListener("input", update);
    }

    buttons.forEach(function (button) {
      button.addEventListener("click", function () {
        activeFilter = button.getAttribute("data-filter") || "all";
        buttons.forEach(function (item) {
          item.classList.toggle("is-active", item === button);
        });
        update();
      });
    });

    update();
  }

  function attachNative(video, source) {
    video.src = source;
    video.load();
  }

  function attachHls(video, source) {
    if (window.Hls && window.Hls.isSupported()) {
      var hls = new window.Hls({
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 90
      });
      hls.loadSource(source);
      hls.attachMedia(video);
      return hls;
    }
    attachNative(video, source);
    return null;
  }

  window.initMoviePlayer = function (videoId, source) {
    var video = document.getElementById(videoId);
    if (!video || !source) {
      return;
    }
    var shell = video.closest(".player-shell");
    var startButton = shell ? shell.querySelector(".player-start") : null;
    var attached = false;
    var hls = null;

    function attach() {
      if (attached) {
        return;
      }
      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        attachNative(video, source);
      } else {
        hls = attachHls(video, source);
      }
      attached = true;
    }

    function play() {
      attach();
      if (shell) {
        shell.classList.add("is-playing");
      }
      var promise = video.play();
      if (promise && typeof promise.catch === "function") {
        promise.catch(function () {});
      }
    }

    if (startButton) {
      startButton.addEventListener("click", play);
    }

    video.addEventListener("click", function () {
      if (video.paused) {
        play();
      }
    });

    video.addEventListener("play", function () {
      if (shell) {
        shell.classList.add("is-playing");
      }
    });

    video.addEventListener("ended", function () {
      if (shell) {
        shell.classList.remove("is-playing");
      }
    });

    window.addEventListener("pagehide", function () {
      if (hls && typeof hls.destroy === "function") {
        hls.destroy();
      }
    });
  };

  ready(function () {
    setupMobileMenu();
    setupCarousel();
    setupSearchAndFilter();
  });
})();
