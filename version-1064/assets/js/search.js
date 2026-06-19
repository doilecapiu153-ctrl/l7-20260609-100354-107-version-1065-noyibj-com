(function () {
  function escapeHtml(value) {
    return String(value || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function getQuery() {
    var params = new URLSearchParams(window.location.search);
    return params.get('q') || '';
  }

  function renderResult(movie) {
    return [
      '<a class="search-result-card" href="' + escapeHtml(movie.url) + '">',
      '  <img src="' + escapeHtml(movie.cover) + '" alt="' + escapeHtml(movie.title) + '" loading="lazy">',
      '  <div>',
      '    <h2>' + escapeHtml(movie.title) + '</h2>',
      '    <p>' + escapeHtml(movie.oneLine) + '</p>',
      '    <div class="ranking-meta">',
      '      <span>' + escapeHtml(movie.year) + '年</span>',
      '      <span>' + escapeHtml(movie.region) + '</span>',
      '      <span>' + escapeHtml(movie.type) + '</span>',
      '      <span>' + escapeHtml(movie.category) + '</span>',
      '    </div>',
      '  </div>',
      '</a>'
    ].join('');
  }

  function setupSearch() {
    var form = document.querySelector('[data-search-form]');
    var input = document.querySelector('[data-search-input]');
    var summary = document.querySelector('[data-search-summary]');
    var results = document.querySelector('[data-search-results]');
    var data = window.MOVIE_SEARCH_INDEX || [];

    if (!form || !input || !summary || !results) {
      return;
    }

    function runSearch(keyword) {
      var query = String(keyword || '').trim().toLowerCase();
      var matched;

      if (!query) {
        matched = data.slice().sort(function (a, b) {
          return b.hotScore - a.hotScore;
        }).slice(0, 30);
        summary.textContent = '已显示热度较高的 30 部影片。';
      } else {
        matched = data.filter(function (movie) {
          return movie.searchText.indexOf(query) !== -1;
        }).slice(0, 120);
        summary.textContent = '关键词“' + keyword + '”找到 ' + matched.length + ' 条结果，最多显示前 120 条。';
      }

      results.innerHTML = matched.map(renderResult).join('');

      results.querySelectorAll('img').forEach(function (image) {
        image.addEventListener('error', function () {
          image.classList.add('image-missing');
        });
      });
    }

    form.addEventListener('submit', function (event) {
      event.preventDefault();
      var value = input.value.trim();
      var url = new URL(window.location.href);
      if (value) {
        url.searchParams.set('q', value);
      } else {
        url.searchParams.delete('q');
      }
      window.history.replaceState({}, '', url.toString());
      runSearch(value);
    });

    input.addEventListener('input', function () {
      runSearch(input.value);
    });

    input.value = getQuery();
    runSearch(input.value);
  }

  document.addEventListener('DOMContentLoaded', setupSearch);
})();
