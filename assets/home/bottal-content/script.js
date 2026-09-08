const track = document.getElementById("bottleTrack");
const nextBtn = document.getElementById("nextBtn");
const prevBtn = document.getElementById("prevBtn");

let currentIndex = 0;

function getVisibleCards() {

  if (window.innerWidth <= 600) {
    return 1;
  }

  if (window.innerWidth <= 800) {
    return 2;
  }

  return 3;
}


function updateSlider() {

  const cards = track.querySelectorAll(".bottle-card");

  if (!cards.length) return;

  const visible = getVisibleCards();

  const gap =
    parseFloat(getComputedStyle(track).gap) || 0;

  const cardWidth =
    cards[0].getBoundingClientRect().width;

  const maxIndex =
    Math.max(0, cards.length - visible);

  if (currentIndex > maxIndex) {
    currentIndex = maxIndex;
  }

  const move =
    currentIndex * (cardWidth + gap);

  track.style.transform =
    `translate3d(-${move}px, 0, 0)`;
}


/* NEXT */

nextBtn.addEventListener("click", () => {

  const cards = track.querySelectorAll(".bottle-card");

  const maxIndex =
    Math.max(0, cards.length - getVisibleCards());

  currentIndex++;

  if (currentIndex > maxIndex) {
    currentIndex = 0;
  }

  updateSlider();
});


/* PREVIOUS */

prevBtn.addEventListener("click", () => {

  const cards = track.querySelectorAll(".bottle-card");

  const maxIndex =
    Math.max(0, cards.length - getVisibleCards());

  currentIndex--;

  if (currentIndex < 0) {
    currentIndex = maxIndex;
  }

  updateSlider();
});


/* =========================
   MOBILE SWIPE
========================= */

let touchStartX = 0;
let touchEndX = 0;

track.addEventListener("touchstart", (event) => {

  touchStartX =
    event.touches[0].clientX;

}, { passive: true });


track.addEventListener("touchend", (event) => {

  touchEndX =
    event.changedTouches[0].clientX;

  const distance =
    touchStartX - touchEndX;

  /* minimum swipe = 50px */

  if (Math.abs(distance) < 50) {
    return;
  }

  if (distance > 0) {

    // Left swipe
    nextBtn.click();

  } else {

    // Right swipe
    prevBtn.click();

  }

}, { passive: true });


/* RESIZE */

window.addEventListener("resize", () => {
  updateSlider();
});


/* INITIAL */

window.addEventListener("load", () => {
  updateSlider();
});
