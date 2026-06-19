function initMoviePlayer(videoId, buttonId, source) {
  const video = document.getElementById(videoId);
  const button = document.getElementById(buttonId);
  if (!video || !button || !source) return;
  let attached = false;
  let hls = null;

  const attach = () => {
    if (attached) return;
    attached = true;
    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = source;
    } else if (window.Hls && Hls.isSupported()) {
      hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 90
      });
      hls.loadSource(source);
      hls.attachMedia(video);
      hls.on(Hls.Events.ERROR, (_, data) => {
        if (!data || !data.fatal) return;
        if (data.type === Hls.ErrorTypes.NETWORK_ERROR) {
          hls.startLoad();
        } else if (data.type === Hls.ErrorTypes.MEDIA_ERROR) {
          hls.recoverMediaError();
        } else {
          hls.destroy();
        }
      });
    } else {
      video.src = source;
    }
  };

  const play = () => {
    attach();
    button.classList.add("is-hidden");
    const pending = video.play();
    if (pending && typeof pending.catch === "function") {
      pending.catch(() => {
        button.classList.remove("is-hidden");
      });
    }
  };

  button.addEventListener("click", play);
  video.addEventListener("click", () => {
    if (video.paused) {
      play();
    }
  });
  video.addEventListener("play", () => button.classList.add("is-hidden"));
  video.addEventListener("pause", () => {
    if (!video.ended) {
      button.classList.remove("is-hidden");
    }
  });
  video.addEventListener("ended", () => button.classList.remove("is-hidden"));
}
