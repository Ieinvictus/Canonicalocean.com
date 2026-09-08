const track = document.getElementById("oceanTrack");

const slides = document.querySelectorAll(".ocean-slide");

const prevBtn = document.getElementById("prevSlide");
const nextBtn = document.getElementById("nextSlide");

const dots = document.querySelectorAll(".ocean-dot");

let currentSlide = 0;


function updateSlide() {

  track.style.transform =
    `translate3d(-${currentSlide * 100}%, 0, 0)`;

  slides.forEach((slide, index) => {
    slide.classList.toggle(
      "active",
      index === currentSlide
    );
  });

  dots.forEach((dot, index) => {
    dot.classList.toggle(
      "active",
      index === currentSlide
    );
  });
}


nextBtn.addEventListener("click", () => {

  currentSlide++;

  if (currentSlide >= slides.length) {
    currentSlide = 0;
  }

  updateSlide();

});


prevBtn.addEventListener("click", () => {

  currentSlide--;

  if (currentSlide < 0) {
    currentSlide = slides.length - 1;
  }

  updateSlide();

});


dots.forEach((dot) => {

  dot.addEventListener("click", () => {

    currentSlide =
      Number(dot.dataset.slide);

    updateSlide();

  });

});


let startX = 0;
let startY = 0;


track.addEventListener(
  "touchstart",
  (e) => {

    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;

  },
  { passive: true }
);


track.addEventListener(
  "touchend",
  (e) => {

    const endX = e.changedTouches[0].clientX;
    const endY = e.changedTouches[0].clientY;

    const diffX = startX - endX;
    const diffY = startY - endY;

    if (Math.abs(diffY) > Math.abs(diffX)) {
      return;
    }

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


updateSlide();
