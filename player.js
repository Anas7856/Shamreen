(function () {
  const list = document.getElementById("albumTracks");
  if (!list) return;

  const tracks = Array.from(list.querySelectorAll(".album__track"));
  const audio = new Audio();
  audio.preload = "metadata";

  const speeds = [1, 1.5, 2];
  let speedIdx = 0;
  let currentLi = null;
  let seeking = false;

  const ICON_PLAY =
    '<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>';
  const ICON_PAUSE =
    '<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M6 5h4v14H6zM14 5h4v14h-4z"/></svg>';

  const fmt = (s) => {
    if (!isFinite(s) || s < 0) return "0:00";
    const m = Math.floor(s / 60);
    const r = Math.floor(s % 60);
    return m + ":" + String(r).padStart(2, "0");
  };

  const ui = (li) => ({
    btn: li.querySelector(".ap__btn"),
    seek: li.querySelector(".ap__seek"),
    cur: li.querySelector(".ap__cur"),
    dur: li.querySelector(".ap__dur"),
    speed: li.querySelector(".ap__speed"),
  });

  // Build controls inside every track
  tracks.forEach((li) => {
    const box = document.createElement("div");
    box.className = "ap";
    box.innerHTML = `
      <button type="button" class="ap__btn" aria-label="Play">${ICON_PLAY}</button>
      <input type="range" class="ap__seek" min="0" max="100" step="0.1" value="0" aria-label="Seek" />
      <span class="ap__time"><span class="ap__cur">0:00</span> / <span class="ap__dur">0:00</span></span>
      <button type="button" class="ap__speed" aria-label="Playback speed">1x</button>
    `;
    li.appendChild(box);

    // clicks inside controls shouldn't toggle the track
    box.addEventListener("click", (e) => e.stopPropagation());

    const { btn, seek, speed } = ui(li);

    btn.addEventListener("click", () => toggle(li));

    seek.addEventListener("input", () => {
      if (li !== currentLi) return;
      seeking = true;
      const t = (seek.value / 100) * (audio.duration || 0);
      ui(li).cur.textContent = fmt(t);
      seek.style.setProperty("--p", seek.value + "%");
    });
    seek.addEventListener("change", () => {
      if (li !== currentLi) return;
      audio.currentTime = (seek.value / 100) * (audio.duration || 0);
      seeking = false;
    });

    speed.addEventListener("click", () => {
      speedIdx = (speedIdx + 1) % speeds.length;
      audio.playbackRate = speeds[speedIdx];
      tracks.forEach((t) => (ui(t).speed.textContent = speeds[speedIdx] + "x"));
    });

    // Row click toggles play
    li.addEventListener("click", () => toggle(li));
  });

  function resetUI(li) {
    if (!li) return;
    const u = ui(li);
    li.classList.remove("is-open", "is-playing");
    u.btn.innerHTML = ICON_PLAY;
    u.seek.value = 0;
    u.seek.style.setProperty("--p", "0%");
    u.cur.textContent = "0:00";
  }

  function load(li) {
    if (currentLi && currentLi !== li) resetUI(currentLi);
    currentLi = li;
    audio.src = encodeURI(li.dataset.src);
    audio.playbackRate = speeds[speedIdx];
    li.classList.add("is-open");
  }

  function toggle(li) {
    if (currentLi !== li) {
      load(li);
      audio.play().catch(() => {});
      return;
    }
    if (audio.paused) audio.play().catch(() => {});
    else audio.pause();
  }

  audio.addEventListener("play", () => {
    if (!currentLi) return;
    currentLi.classList.add("is-playing");
    ui(currentLi).btn.innerHTML = ICON_PAUSE;
  });

  audio.addEventListener("pause", () => {
    if (!currentLi) return;
    currentLi.classList.remove("is-playing");
    ui(currentLi).btn.innerHTML = ICON_PLAY;
  });

  audio.addEventListener("loadedmetadata", () => {
    if (currentLi) ui(currentLi).dur.textContent = fmt(audio.duration);
  });

  audio.addEventListener("timeupdate", () => {
    if (!currentLi || seeking) return;
    const u = ui(currentLi);
    const p = audio.duration ? (audio.currentTime / audio.duration) * 100 : 0;
    u.seek.value = p;
    u.seek.style.setProperty("--p", p + "%");
    u.cur.textContent = fmt(audio.currentTime);
  });

  audio.addEventListener("ended", () => {
    const i = tracks.indexOf(currentLi);
    const next = tracks[i + 1];
    if (next) {
      load(next);
      audio.play().catch(() => {});
    } else {
      resetUI(currentLi);
    }
  });
})();