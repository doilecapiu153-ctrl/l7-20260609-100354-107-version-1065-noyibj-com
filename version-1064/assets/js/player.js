(function () {
  function setupPlayer(frame) {
    var video = frame.querySelector('[data-video-player]');
    var button = frame.querySelector('[data-play-button]');
    var status = document.querySelector('[data-player-status]');
    var source = frame.getAttribute('data-src');
    var loaded = false;
    var hlsInstance = null;

    if (!video || !source) {
      return;
    }

    function setStatus(message) {
      if (status) {
        status.textContent = message;
      }
    }

    function playVideo() {
      var playPromise = video.play();
      if (playPromise && typeof playPromise.catch === 'function') {
        playPromise.catch(function () {
          setStatus('播放源已加载，请再次点击视频区域开始播放。');
        });
      }
    }

    function loadSource() {
      if (loaded) {
        playVideo();
        return;
      }
      loaded = true;
      frame.classList.add('is-playing');
      setStatus('正在加载 HLS 播放源...');

      if (window.Hls && window.Hls.isSupported()) {
        hlsInstance = new window.Hls({
          enableWorker: true,
          lowLatencyMode: false,
          backBufferLength: 90
        });
        hlsInstance.loadSource(source);
        hlsInstance.attachMedia(video);
        hlsInstance.on(window.Hls.Events.MANIFEST_PARSED, function () {
          setStatus('播放源加载完成，正在播放。');
          playVideo();
        });
        hlsInstance.on(window.Hls.Events.ERROR, function (_event, data) {
          if (data && data.fatal) {
            setStatus('当前线路加载异常，浏览器会尝试使用原生播放能力。');
            if (hlsInstance) {
              hlsInstance.destroy();
              hlsInstance = null;
            }
            video.src = source;
          }
        });
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = source;
        video.addEventListener('loadedmetadata', function () {
          setStatus('播放源加载完成，正在播放。');
          playVideo();
        }, { once: true });
      } else {
        video.src = source;
        setStatus('已绑定播放源；如无法播放，请使用支持 HLS 的浏览器。');
        playVideo();
      }
    }

    if (button) {
      button.addEventListener('click', loadSource);
    }

    video.addEventListener('click', function () {
      if (!loaded) {
        loadSource();
      }
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('[data-video-frame]').forEach(setupPlayer);
  });
})();
