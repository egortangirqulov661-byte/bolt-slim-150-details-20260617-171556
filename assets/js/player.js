(function () {
  function setup(box) {
    var video = box.querySelector("video");
    var button = box.querySelector(".play-cover");
    var url = box.getAttribute("data-url");
    var hls = null;

    if (!video || !url) {
      return;
    }

    function load() {
      if (video.getAttribute("data-ready") === "1") {
        return;
      }

      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = url;
      } else if (window.Hls && window.Hls.isSupported()) {
        hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        hls.loadSource(url);
        hls.attachMedia(video);
      } else {
        video.src = url;
      }

      video.setAttribute("data-ready", "1");
    }

    function start() {
      load();
      box.classList.add("is-playing");
      var promise = video.play();

      if (promise && promise.catch) {
        promise.catch(function () {});
      }
    }

    if (button) {
      button.addEventListener("click", start);
    }

    video.addEventListener("click", function () {
      if (video.paused) {
        start();
      }
    });

    video.addEventListener("play", function () {
      box.classList.add("is-playing");
    });

    video.addEventListener("ended", function () {
      if (button) {
        box.classList.remove("is-playing");
      }
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    Array.prototype.slice.call(document.querySelectorAll(".video-shell[data-url]")).forEach(setup);
  });
})();
