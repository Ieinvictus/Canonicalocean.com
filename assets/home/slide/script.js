document.addEventListener("DOMContentLoaded", function () {

  const track = document.getElementById("oceanTrack");
  const slides = document.querySelectorAll(".ocean-slide");
  const nextBtn = document.getElementById("nextSlide");
  const prevBtn = document.getElementById("prevSlide");
  const dots = document.querySelectorAll(".dot");

  if (!track || slides.length === 0) return;

  let currentSlide = 0;
  let autoSlide;

  const duration = 800;
  const autoTime = 4000; // 4 seconds

  function showSlide(index) {

    if (index >= slides.length) {
      index = 0;
    }

    if (index < 0) {
      index = slides.length - 1;
    }

    currentSlide = index;

    track.style.transform =
      "translate3d(-" + (currentSlide * 100) + "%, 0, 0)";

    slides.forEach((slide, i) => {
      slide.classList.toggle("active", i === currentSlide);
    });

    dots.forEach((dot, i) => {
      dot.classList.toggle("active", i === currentSlide);
      dot.setAttribute(
        "aria-selected",
        i === currentSlide ? "true" : "false"
      );
    });
  }


  function nextSlide() {
    showSlide(currentSlide + 1);
  }


  function previousSlide() {
    showSlide(currentSlide - 1);
  }


  // NEXT BUTTON
  if (nextBtn) {
    nextBtn.addEventListener("click", function () {
      nextSlide();
      restartAutoSlide();
    });
  }


  // PREVIOUS BUTTON
  if (prevBtn) {
    prevBtn.addEventListener("click", function () {
      previousSlide();
      restartAutoSlide();
    });
  }


  // DOTS
  dots.forEach((dot) => {

    dot.addEventListener("click", function () {

      const slideNumber = Number(this.dataset.slide);

      if (!Number.isNaN(slideNumber)) {
        showSlide(slideNumber);
        restartAutoSlide();
      }

    });

  });


  // AUTOMATIC SLIDER
  function startAutoSlide() {

    clearInterval(autoSlide);

    autoSlide = setInterval(function () {
      nextSlide();
    }, autoTime);

  }


  function restartAutoSlide() {
    startAutoSlide();
  }


  // MOBILE SWIPE
  let startX = 0;
  let startY = 0;

  track.addEventListener(
    "touchstart",
    function (e) {

      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;

    },
    { passive: true }
  );


  track.addEventListener(
    "touchend",
    function (e) {

      const endX = e.changedTouches[0].clientX;
      const endY = e.changedTouches[0].clientY;

      const diffX = startX - endX;
      const diffY = startY - endY;

      // Ignore vertical swipe
      if (Math.abs(diffY) > Math.abs(diffX)) return;

      // Minimum swipe distance
      if (Math.abs(diffX) < 50) return;

      if (diffX > 0) {
        nextSlide();
      } else {
        previousSlide();
      }

      restartAutoSlide();

    },
    { passive: true }
  );


  // KEYBOARD
  document.addEventListener("keydown", function (e) {

    if (e.key === "ArrowRight") {
      nextSlide();
      restartAutoSlide();
    }

    if (e.key === "ArrowLeft") {
      previousSlide();
      restartAutoSlide();
    }

  });


  // START
  showSlide(0);
  startAutoSlide();

});
