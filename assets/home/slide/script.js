document.addEventListener("DOMContentLoaded", function () {

  const track = document.getElementById("oceanTrack");
  const slides = document.querySelectorAll(".ocean-slide");

  const prevBtn = document.getElementById("prevSlide");
  const nextBtn = document.getElementById("nextSlide");

  const dots = document.querySelectorAll(".dot");

  /* Check required elements */

  if (!track) {
    console.error("oceanTrack not found");
    return;
  }

  if (!slides.length) {
    console.error("ocean-slide not found");
    return;
  }

  let currentSlide = 0;
  let isMoving = false;

  const duration = 800;


  /* =================================
     UPDATE SLIDE
  ================================= */

  function updateSlide() {

    track.style.transform =
      "translate3d(-" +
      (currentSlide * 100) +
      "%, 0, 0)";


    /* Active slide */

    slides.forEach(function (slide, index) {

      slide.classList.toggle(
        "active",
        index === currentSlide
      );

    });


    /* Active dot */

    dots.forEach(function (dot, index) {

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
     NEXT SLIDE
  ================================= */

  function nextSlide() {

    if (isMoving) return;

    isMoving = true;

    currentSlide++;

    if (currentSlide >= slides.length) {
      currentSlide = 0;
    }

    updateSlide();

    setTimeout(function () {
      isMoving = false;
    }, duration);

  }


  /* =================================
     PREVIOUS SLIDE
  ================================= */

  function previousSlide() {

    if (isMoving) return;

    isMoving = true;

    currentSlide--;

    if (currentSlide < 0) {
      currentSlide = slides.length - 1;
    }

    updateSlide();

    setTimeout(function () {
      isMoving = false;
    }, duration);

  }


  /* =================================
     NEXT BUTTON
  ================================= */

  if (nextBtn) {

    nextBtn.addEventListener(
      "click",
      nextSlide
    );

  }


  /* =================================
     PREVIOUS BUTTON
  ================================= */

  if (prevBtn) {

    prevBtn.addEventListener(
      "click",
      previousSlide
    );

  }


  /* =================================
     DOTS
  ================================= */

  dots.forEach(function (dot) {

    dot.addEventListener("click", function () {

      if (isMoving) return;

      const slideNumber =
        Number(this.dataset.slide);


      if (
        Number.isNaN(slideNumber) ||
        slideNumber < 0 ||
        slideNumber >= slides.length
      ) {
        return;
      }


      if (slideNumber === currentSlide) {
        return;
      }


      isMoving = true;

      currentSlide = slideNumber;

      updateSlide();


      setTimeout(function () {
        isMoving = false;
      }, duration);

    });

  });


  /* =================================
     TOUCH SWIPE
  ================================= */

  let startX = 0;
  let startY = 0;

  let touching = false;


  track.addEventListener(
    "touchstart",
    function (event) {

      startX =
        event.touches[0].clientX;

      startY =
        event.touches[0].clientY;

      touching = true;

    },
    {
      passive: true
    }
  );


  track.addEventListener(
    "touchend",
    function (event) {

      if (!touching) return;

      touching = false;


      const endX =
        event.changedTouches[0].clientX;

      const endY =
        event.changedTouches[0].clientY;


      const diffX =
        startX - endX;

      const diffY =
        startY - endY;


      /* Ignore vertical movement */

      if (
        Math.abs(diffY) >
        Math.abs(diffX)
      ) {
        return;
      }


      /* Minimum swipe distance */

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
    function (event) {

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

  updateSlide();

});
