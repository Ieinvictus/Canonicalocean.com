sconst track = document.getElementById("oceanTrack");
const slides = document.querySelectorAll(".ocean-slide");

const prevBtn = document.getElementById("prevSlide");
const nextBtn = document.getElementById("nextSlide");

const dots = document.querySelectorAll(".ocean-dot");

let currentSlide = 0;
let isAnimating = false;


/* =================================
   UPDATE SLIDE — SMOOTH
================================= */

function updateSlide(instant = false) {

  if (instant) {
    track.style.transition = "none";
  } else {
    track.style.transition =
      "transform 0.85s cubic-bezier(.77,0,.18,1)";
  }

  track.style.transform =
    `translate3d(-${currentSlide * 100}%, 0, 0)`;


  /* Active slide */

  slides.forEach((slide, index) => {

    slide.classList.toggle(
      "active",
      index === currentSlide
    );

  });


  /* Active dot */

  dots.forEach((dot, index) => {

    dot.classList.toggle(
      "active",
      index === currentSlide
    );

    dot.setAttribute(
      "aria-selected",
      index === currentSlide
        ? "true"
        : "false"
    );

  });

}


/* =================================
   NEXT
================================= */

function nextSlide() {

  if (isAnimating) return;

  isAnimating = true;

  currentSlide =
    (currentSlide + 1) % slides.length;

  updateSlide();

  setTimeout(() => {
    isAnimating = false;
  }, 850);

}


/* =================================
   PREVIOUS
================================= */

function previousSlide() {

  if (isAnimating) return;

  isAnimating = true;

  currentSlide =
    (currentSlide - 1 + slides.length)
    % slides.length;

  updateSlide();

  setTimeout(() => {
    isAnimating = false;
  }, 850);

}


/* =================================
   BUTTONS
================================= */

if (nextBtn) {

  nextBtn.addEventListener(
    "click",
    nextSlide
  );

}


if (prevBtn) {

  prevBtn.addEventListener(
    "click",
    previousSlide
  );

}


/* =================================
   DOTS
================================= */

dots.forEach((dot) => {

  dot.addEventListener("click", () => {

    if (isAnimating) return;

    const target =
      Number(dot.dataset.slide);

    if (
      target < 0 ||
      target >= slides.length ||
      target === currentSlide
    ) {
      return;
    }

    isAnimating = true;

    currentSlide = target;

    updateSlide();

    setTimeout(() => {
      isAnimating = false;
    }, 850);

  });

});


/* =================================
   TOUCH SWIPE
================================= */

let startX = 0;
let startY = 0;

track.addEventListener(
  "touchstart",
  (event) => {

    startX =
      event.touches[0].clientX;

    startY =
      event.touches[0].clientY;

  },
  {
    passive: true
  }
);


track.addEventListener(
  "touchend",
  (event) => {

    if (isAnimating) return;

    const endX =
      event.changedTouches[0].clientX;

    const endY =
      event.changedTouches[0].clientY;

    const diffX =
      startX - endX;

    const diffY =
      startY - endY;


    /* Ignore vertical swipe */

    if (
      Math.abs(diffY) >
      Math.abs(diffX)
    ) {
      return;
    }


    /* Minimum swipe */

    if (
      Math.abs(diffX) < 50
    ) {
      return;
    }


    if (diffX > 0) {

      nextSlide();

    } else {

      previousSlide();

    }

  },
  {
    passive: true
  }
);


/* =================================
   KEYBOARD
================================= */

document.addEventListener(
  "keydown",
  (event) => {

    if (event.key === "ArrowRight") {
      nextSlide();
    }

    if (event.key === "ArrowLeft") {
      previousSlide();
    }

  }
);


/* =================================
   INITIAL
================================= */

updateSlide(true);


/* Restore transition */

requestAnimationFrame(() => {

  track.style.transition =
    "transform 0.85s cubic-bezier(.77,0,.18,1)";

});
