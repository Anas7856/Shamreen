// Album tracklist audio player
(function () {
  var list = document.getElementById("albumTracks");
  if (!list) return;

  var tracks = Array.prototype.slice.call(
    list.querySelectorAll(".album__track[data-src]"),
  );
  if (!tracks.length) return;

  var audio = new Audio();
  audio.preload = "none";
  var current = -1;

  function setActive(index) {
    tracks.forEach(function (t, i) {
      t.classList.toggle("is-active", i === index);
    });
  }

  function play(index) {
    if (index < 0 || index >= tracks.length) return;

    // same track: toggle pause / play
    if (index === current) {
      if (audio.paused) {
        audio.play();
      } else {
        audio.pause();
      }
      return;
    }

    current = index;
    audio.src = tracks[index].getAttribute("data-src");
    setActive(index);
    audio.play().catch(function () {});
  }

  tracks.forEach(function (track, i) {
    track.addEventListener("click", function () {
      play(i);
    });
  });

  // auto-play next song when one ends
  audio.addEventListener("ended", function () {
    if (current < tracks.length - 1) {
      var next = current + 1;
      current = -1;
      play(next);
    } else {
      current = -1;
      setActive(-1);
    }
  });
})();
