const navToggle = document.getElementById("navToggle");
const navMenu = document.getElementById("navMenu");
const navLinks = document.querySelectorAll(".navbar__link");

navToggle.addEventListener("click", () => {
  const isOpen = navMenu.classList.toggle("is-open");
  navToggle.classList.toggle("is-open", isOpen);
  navToggle.setAttribute("aria-expanded", isOpen);
});

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.forEach((l) => l.classList.remove("is-active"));
    link.classList.add("is-active");

    navMenu.classList.remove("is-open");
    navToggle.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
  });
});

/* ---------- Hero Slider ---------- */
const heroSlider = new Swiper(".hero__slider", {
  loop: true,
  speed: 900,
  grabCursor: true,
  autoplay: {
    delay: 4000,
    disableOnInteraction: false,
    pauseOnMouseEnter: false,
  },
  pagination: {
    el: ".hero__pagination",
    clickable: true,
  },
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
});

/* ---------- Scroll Reveal ---------- */
const revealItems = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 },
  );

  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

/* ---------- Back To Top ---------- */
const toTop = document.getElementById("toTop");

window.addEventListener("scroll", () => {
  toTop.classList.toggle("is-visible", window.scrollY > 200);
});

toTop.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});
/* ---------- Tour Dates Slider ---------- */
const tourSlider = new Swiper(".tour__slider", {
  loop: true,
  speed: 600,
  grabCursor: true,
  spaceBetween: 24,
  slidesPerView: 1,
  navigation: {
    nextEl: ".tour__next",
    prevEl: ".tour__prev",
  },
  breakpoints: {
    600: {
      slidesPerView: 2,
      spaceBetween: 20,
    },
    900: {
      slidesPerView: 3,
      spaceBetween: 24,
    },
    1600: {
      slidesPerView: 3,
      spaceBetween: 36,
    },
    2560: {
      slidesPerView: 3,
      spaceBetween: 56,
    },
  },
});
/* ---------- Video Modal ---------- */
const videoPlay = document.getElementById("videoPlay");
const videoModal = document.getElementById("videoModal");
const videoFrame = document.getElementById("videoFrame");
const videoClose = document.getElementById("videoClose");
const videoBackdrop = document.getElementById("videoBackdrop");

function openVideo() {
  const url = videoPlay.dataset.video;
  videoFrame.innerHTML = `<iframe src="${url}?autoplay=1&rel=0" title="Video player" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>`;
  videoModal.classList.add("is-open");
  videoModal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeVideo() {
  videoModal.classList.remove("is-open");
  videoModal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
  videoFrame.innerHTML = "";
}

videoPlay.addEventListener("click", openVideo);
videoClose.addEventListener("click", closeVideo);
videoBackdrop.addEventListener("click", closeVideo);

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && videoModal.classList.contains("is-open")) {
    closeVideo();
  }
});
/* ---------- Album Tracklist ---------- */
const albumTracks = document.querySelectorAll(".album__track");

albumTracks.forEach((track) => {
  track.addEventListener("click", () => {
    albumTracks.forEach((t) => t.classList.remove("is-active"));
    track.classList.add("is-active");
  });
});
/* ---------- Contact Form ---------- */
const contactForm = document.getElementById("contactForm");
const contactStatus = document.getElementById("contactStatus");

contactForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const fields = contactForm.querySelectorAll(".contact__field");
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  let valid = true;

  fields.forEach((field) => {
    const input = field.querySelector("input, textarea");
    const value = input.value.trim();
    let ok = value !== "";

    if (input.type === "email") {
      ok = emailPattern.test(value);
    }

    field.classList.toggle("has-error", !ok);
    if (!ok) valid = false;
  });

  contactStatus.className = "contact__status";

  if (!valid) {
    contactStatus.textContent = "Please fill all fields correctly.";
    contactStatus.classList.add("is-error");
    return;
  }

  const submitBtn = contactForm.querySelector(".contact__btn");
  submitBtn.disabled = true;
  contactStatus.textContent = "Sending...";

  const data = Object.fromEntries(new FormData(contactForm).entries());

  try {
    /* TODO: yahan apna backend / Firebase / Formspree endpoint lagao */
    await new Promise((resolve) => setTimeout(resolve, 800));
    console.log("Form data:", data);

    contactStatus.textContent = "Thank you! Your message has been sent.";
    contactStatus.classList.add("is-success");
    contactForm.reset();
  } catch (err) {
    contactStatus.textContent = "Something went wrong. Please try again.";
    contactStatus.classList.add("is-error");
  } finally {
    submitBtn.disabled = false;
  }
});

contactForm.querySelectorAll("input, textarea").forEach((input) => {
  input.addEventListener("input", () => {
    input.closest(".contact__field").classList.remove("has-error");
  });
});
