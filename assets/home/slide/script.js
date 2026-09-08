const track = document.getElementById("oceanTrack");

const slides = document.querySelectorAll(".ocean-slide");

const prevBtn = document.getElementById("prevSlide");
const nextBtn = document.getElementById("nextSlide");

const dots = document.querySelectorAll(".dot");

let currentSlide = 0;


/* ===============================
   UPDATE SLIDE
================================ */

function updateSlide() {

  track.style.transform =
    `translate3d(-${currentSlide * 100}%, 0, 0)`;


  dots.forEach((dot, index) => {

    dot.classList.toggle(
      "active",
      index === currentSlide
    );

  });

}


/* ===============================
   NEXT
================================ */

nextBtn.addEventListener("click", () => {

  currentSlide++;

  if (currentSlide >= slides.length) {
    currentSlide = 0;
  }

  updateSlide();

});


/* ===============================
   PREVIOUS
================================ */

prevBtn.addEventListener("click", () => {

  currentSlide--;

  if (currentSlide < 0) {
    currentSlide = slides.length - 1;
  }

  updateSlide();

});


/* ===============================
   DOTS
================================ */

dots.forEach((dot) => {

  dot.addEventListener("click", () => {

    currentSlide =
      Number(dot.dataset.slide);

    updateSlide();

  });

});


/* ===============================
   TOUCH SWIPE
================================ */

let startX = 0;
let startY = 0;

let isDragging = false;


track.addEventListener(
  "touchstart",
  (event) => {

    startX =
      event.touches[0].clientX;

    startY =
      event.touches[0].clientY;

    isDragging = true;

  },
  { passive: true }
);


track.addEventListener(
  "touchend",
  (event) => {

    if (!isDragging) return;

    const endX =
      event.changedTouches[0].clientX;

    const endY =
      event.changedTouches[0].clientY;

    const diffX =
      startX - endX;

    const diffY =
      startY - endY;

    isDragging = false;


    /* Ignore vertical swipe */

    if (Math.abs(diffY) > Math.abs(diffX)) {
      return;
    }


    /* Minimum swipe */

    if (Math.abs(diffX) < 50) {
      return;
    }


    if (diffX > 0) {

      currentSlide++;

      if (currentSlide >= slides.length) {
        currentSlide = 0;
      }

    } else {

      currentSlide--;

      if (currentSlide < 0) {
        currentSlide = slides.length - 1;
      }

    }

    updateSlide();

  },
  { passive: true }
);


/* INITIAL */

updateSlide();
