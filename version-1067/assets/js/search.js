(function () {
  function escapeHtml(value) {
    return String(value || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function normalize(value) {
    return String(value || '').trim().toLowerCase();
  }

  function card(movie) {
    return [
      '<article class="movie-card movie-card-compact">',
      '<a href="' + escapeHtml(movie.url) + '" class="movie-card-link" aria-label="观看' + escapeHtml(movie.title) + '">',
      '<figure class="movie-cover">',
      '<img src="' + escapeHtml(movie.cover) + '" alt="' + escapeHtml(movie.title) + '" loading="lazy">',
      '<span class="cover-gradient"></span>',
      '<span class="movie-score">★ ' + escapeHtml(movie.rating) + '</span>',
      '<span class="movie-duration">' + escapeHtml(movie.duration) + '</span>',
      '</figure>',
      '<div class="movie-card-body">',
      '<div class="movie-meta-line"><span>' + escapeHtml(movie.category) + '</span><span>' + escapeHtml(movie.year) + '</span></div>',
      '<h2>' + escapeHtml(movie.title) + '</h2>',
      '<p>' + escapeHtml(movie.summary) + '</p>',
      '<div class="tag-list"><span>' + escapeHtml(movie.type) + '</span><span>' + escapeHtml(movie.region) + '</span></div>',
      '</div>',
      '</a>',
      '</article>'
    ].join('');
  }

  function run() {
    var params = new URLSearchParams(window.location.search);
    var initial = params.get('q') || '';
    var input = document.querySelector('[data-search-input]');
    var form = document.querySelector('[data-search-form]');
    var results = document.querySelector('[data-search-results]');
    var heading = document.querySelector('[data-search-heading]');

    if (!input || !form || !results || !heading || !Array.isArray(searchMovies)) {
      return;
    }

    input.value = initial;

    function render(query) {
      var key = normalize(query);
      if (!key) {
        return;
      }
      var matched = searchMovies.filter(function (movie) {
        var text = normalize([
          movie.title,
          movie.year,
          movie.region,
          movie.type,
          movie.genre,
          movie.category,
          movie.tags,
          movie.summary
        ].join(' '));
        return text.indexOf(key) !== -1;
      }).slice(0, 120);
      heading.innerHTML = '<h2>搜索结果</h2><p>关键词：' + escapeHtml(query) + '</p>';
      results.innerHTML = matched.length ? matched.map(card).join('') : '<div class="empty-state is-visible">没有匹配的影片，换个关键词试试。</div>';
    }

    if (initial) {
      render(initial);
    }

    form.addEventListener('submit', function (event) {
      event.preventDefault();
      var query = input.value.trim();
      if (query) {
        history.replaceState(null, '', './search.html?q=' + encodeURIComponent(query));
        render(query);
      }
    });
  }

  document.addEventListener('DOMContentLoaded', run);
})();
