const track = document.getElementById("oceanTrack");
const slides = document.querySelectorAll(".ocean-slide");
const prevBtn = document.getElementById("prevSlide");
const nextBtn = document.getElementById("nextSlide");
const dots = document.querySelectorAll(".dot");

let currentSlide = 0;

function updateSlide() {

  track.style.transform =
    `translate3d(-${currentSlide * 100}%, 0, 0)`;

  dots.forEach((dot, index) => {
    dot.classList.toggle("active", index === currentSlide);
    dot.setAttribute(
      "aria-selected",
      index === currentSlide ? "true" : "false"
    );
  });
}

nextBtn.addEventListener("click", () => {
  currentSlide = (currentSlide + 1) % slides.length;
  updateSlide();
});

prevBtn.addEventListener("click", () => {
  currentSlide =
    (currentSlide - 1 + slides.length) % slides.length;

  updateSlide();
});

dots.forEach((dot) => {

  dot.addEventListener("click", () => {

    const index = Number(dot.dataset.slide);

    if (index >= 0 && index < slides.length) {
      currentSlide = index;
      updateSlide();
    }

  });

});


/* ===============================
   TOUCH SWIPE
================================ */

let startX = 0;
let startY = 0;

track.addEventListener(
  "touchstart",
  (event) => {

    startX = event.touches[0].clientX;
    startY = event.touches[0].clientY;

  },
  { passive: true }
);

track.addEventListener(
  "touchend",
  (event) => {

    const endX = event.changedTouches[0].clientX;
    const endY = event.changedTouches[0].clientY;

    const diffX = startX - endX;
    const diffY = startY - endY;

    if (Math.abs(diffY) > Math.abs(diffX)) return;

    if (Math.abs(diffX) < 50) return;

    if (diffX > 0) {
      currentSlide = (currentSlide + 1) % slides.length;
    } else {
      currentSlide =
        (currentSlide - 1 + slides.length) % slides.length;
    }

    updateSlide();

  },
  { passive: true }
);


/* INITIAL */
updateSlide();
