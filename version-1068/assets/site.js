(function () {
  function ready(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback);
    } else {
      callback();
    }
  }

  function initMenu() {
    var button = document.querySelector(".menu-toggle");
    var panel = document.querySelector(".mobile-panel");
    if (!button || !panel) {
      return;
    }
    button.addEventListener("click", function () {
      var expanded = button.getAttribute("aria-expanded") === "true";
      button.setAttribute("aria-expanded", String(!expanded));
      panel.hidden = expanded;
    });
  }

  function initHero() {
    var slides = Array.prototype.slice.call(document.querySelectorAll("[data-hero-slide]"));
    var dots = Array.prototype.slice.call(document.querySelectorAll("[data-hero-dot]"));
    var previous = document.querySelector("[data-hero-prev]");
    var next = document.querySelector("[data-hero-next]");
    if (!slides.length) {
      return;
    }
    var index = 0;
    var timer = null;

    function show(nextIndex) {
      index = (nextIndex + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle("is-active", slideIndex === index);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle("is-active", dotIndex === index);
      });
    }

    function start() {
      stop();
      timer = window.setInterval(function () {
        show(index + 1);
      }, 5000);
    }

    function stop() {
      if (timer) {
        window.clearInterval(timer);
        timer = null;
      }
    }

    if (previous) {
      previous.addEventListener("click", function () {
        show(index - 1);
        start();
      });
    }
    if (next) {
      next.addEventListener("click", function () {
        show(index + 1);
        start();
      });
    }
    dots.forEach(function (dot) {
      dot.addEventListener("click", function () {
        show(Number(dot.getAttribute("data-hero-dot") || 0));
        start();
      });
    });
    start();
  }

  function initScrollers() {
    var leftButtons = Array.prototype.slice.call(document.querySelectorAll("[data-scroll-left]"));
    var rightButtons = Array.prototype.slice.call(document.querySelectorAll("[data-scroll-right]"));
    function move(id, direction) {
      var target = document.getElementById(id);
      if (!target) {
        return;
      }
      target.scrollBy({
        left: direction * 420,
        behavior: "smooth"
      });
    }
    leftButtons.forEach(function (button) {
      button.addEventListener("click", function () {
        move(button.getAttribute("data-scroll-left"), -1);
      });
    });
    rightButtons.forEach(function (button) {
      button.addEventListener("click", function () {
        move(button.getAttribute("data-scroll-right"), 1);
      });
    });
  }

  function getQueryValue(name) {
    var params = new URLSearchParams(window.location.search);
    return params.get(name) || "";
  }

  function initFiltering() {
    var input = document.getElementById("pageSearchInput");
    var clearButton = document.getElementById("clearSearch");
    var cards = Array.prototype.slice.call(document.querySelectorAll("[data-movie-card]"));
    var empty = document.querySelector(".empty-result");
    var pills = Array.prototype.slice.call(document.querySelectorAll(".filter-pill"));
    if (!cards.length) {
      return;
    }

    var state = {
      keyword: "",
      type: "全部",
      year: "全部"
    };

    if (input) {
      state.keyword = getQueryValue("q");
      input.value = state.keyword;
    }

    function cardText(card) {
      return [
        card.getAttribute("data-title") || "",
        card.getAttribute("data-region") || "",
        card.getAttribute("data-type") || "",
        card.getAttribute("data-year") || "",
        card.getAttribute("data-tags") || "",
        card.getAttribute("data-category") || ""
      ].join(" ").toLowerCase();
    }

    function apply() {
      var keyword = state.keyword.trim().toLowerCase();
      var visible = 0;
      cards.forEach(function (card) {
        var matchesKeyword = !keyword || cardText(card).indexOf(keyword) !== -1;
        var matchesType = state.type === "全部" || (card.getAttribute("data-type") || "") === state.type || (state.type === "电视剧" && (card.getAttribute("data-type") || "") === "TV");
        var matchesYear = state.year === "全部" || (card.getAttribute("data-year") || "") === state.year;
        var ok = matchesKeyword && matchesType && matchesYear;
        card.hidden = !ok;
        if (ok) {
          visible += 1;
        }
      });
      if (empty) {
        empty.hidden = visible !== 0;
      }
    }

    if (input) {
      input.addEventListener("input", function () {
        state.keyword = input.value;
        apply();
      });
    }
    if (clearButton && input) {
      clearButton.addEventListener("click", function () {
        input.value = "";
        state.keyword = "";
        apply();
      });
    }
    pills.forEach(function (button) {
      button.addEventListener("click", function () {
        var type = button.getAttribute("data-filter-type");
        var value = button.getAttribute("data-filter-value") || "全部";
        state[type] = value === "TV" ? "电视剧" : value;
        pills.forEach(function (item) {
          if (item.getAttribute("data-filter-type") === type) {
            item.classList.toggle("is-active", item === button);
          }
        });
        apply();
      });
    });
    apply();
  }

  ready(function () {
    initMenu();
    initHero();
    initScrollers();
    initFiltering();
  });
})();
