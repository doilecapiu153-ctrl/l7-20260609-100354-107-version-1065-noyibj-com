(() => {
  const nav = document.querySelector("[data-site-nav]");
  const toggle = document.querySelector("[data-menu-toggle]");
  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      nav.classList.toggle("is-open");
    });
  }

  const hero = document.querySelector("[data-hero]");
  if (hero) {
    const slides = Array.from(hero.querySelectorAll(".hero-slide"));
    const dots = Array.from(hero.querySelectorAll("[data-hero-dot]"));
    const prev = hero.querySelector("[data-hero-prev]");
    const next = hero.querySelector("[data-hero-next]");
    let current = 0;
    let timer = null;

    const show = (index) => {
      if (!slides.length) return;
      current = (index + slides.length) % slides.length;
      slides.forEach((slide, i) => slide.classList.toggle("is-active", i === current));
      dots.forEach((dot, i) => dot.classList.toggle("is-active", i === current));
    };

    const play = () => {
      timer = window.setInterval(() => show(current + 1), 5000);
    };

    const restart = () => {
      if (timer) window.clearInterval(timer);
      play();
    };

    prev && prev.addEventListener("click", () => {
      show(current - 1);
      restart();
    });

    next && next.addEventListener("click", () => {
      show(current + 1);
      restart();
    });

    dots.forEach((dot) => {
      dot.addEventListener("click", () => {
        show(Number(dot.getAttribute("data-hero-dot") || 0));
        restart();
      });
    });

    show(0);
    play();
  }

  document.querySelectorAll("[data-filter-scope]").forEach((scope) => {
    const input = scope.querySelector("[data-search-input]");
    const yearSelect = scope.querySelector("[data-year-filter]");
    const typeSelect = scope.querySelector("[data-type-filter]");
    const cards = Array.from(scope.querySelectorAll(".movie-card"));
    const noResults = scope.querySelector("[data-no-results]");

    const unique = (name) => Array.from(new Set(cards.map((card) => card.dataset[name]).filter(Boolean))).sort((a, b) => String(b).localeCompare(String(a), "zh-Hans-CN"));

    if (yearSelect) {
      unique("year").forEach((value) => {
        const option = document.createElement("option");
        option.value = value;
        option.textContent = value;
        yearSelect.appendChild(option);
      });
    }

    if (typeSelect) {
      unique("type").sort((a, b) => String(a).localeCompare(String(b), "zh-Hans-CN")).forEach((value) => {
        const option = document.createElement("option");
        option.value = value;
        option.textContent = value;
        typeSelect.appendChild(option);
      });
    }

    const apply = () => {
      const q = (input && input.value || "").trim().toLowerCase();
      const y = yearSelect && yearSelect.value || "";
      const t = typeSelect && typeSelect.value || "";
      let visible = 0;

      cards.forEach((card) => {
        const haystack = [card.dataset.title, card.dataset.region, card.dataset.type, card.dataset.year, card.dataset.tags].join(" ").toLowerCase();
        const ok = (!q || haystack.includes(q)) && (!y || card.dataset.year === y) && (!t || card.dataset.type === t);
        card.style.display = ok ? "" : "none";
        if (ok) visible += 1;
      });

      if (noResults) {
        noResults.classList.toggle("is-visible", visible === 0);
      }
    };

    input && input.addEventListener("input", apply);
    yearSelect && yearSelect.addEventListener("change", apply);
    typeSelect && typeSelect.addEventListener("change", apply);
    apply();
  });
})();
