document.addEventListener("DOMContentLoaded", function () {

  const track = document.getElementById("coBlogTrack");
  const cards = document.querySelectorAll(".co-blog-card");
  const nextBtn = document.getElementById("coBlogNext");
  const prevBtn = document.getElementById("coBlogPrev");
  const dots = document.querySelectorAll(".co-blog-dot");

  if (!track || cards.length === 0) {
    return;
  }


  /* =========================================
     SETTINGS
  ========================================= */

  let currentIndex = 0;

  let startX = 0;
  let startY = 0;

  let isTouching = false;

  const swipeDistance = 50;


  /* =========================================
     VISIBLE CARDS
  ========================================= */

  function getVisibleCards() {

    const width = window.innerWidth;

    if (width <= 600) {
      return 1;
    }

    if (width <= 900) {
      return 2;
    }

    return 3;
  }


  /* =========================================
     MAX INDEX
  ========================================= */

  function getMaxIndex() {

    return Math.max(
      0,
      cards.length - getVisibleCards()
    );

  }


  /* =========================================
     MOVE SLIDER
  ========================================= */

  function updateSlider() {

    const maxIndex = getMaxIndex();

    if (currentIndex > maxIndex) {
      currentIndex = maxIndex;
    }

    if (currentIndex < 0) {
      currentIndex = 0;
    }


    /*
      Use actual card position.
      This works correctly with CSS gap.
    */

    const targetCard = cards[currentIndex];

    if (!targetCard) {
      return;
    }


    const moveX = targetCard.offsetLeft;


    track.style.transform =
      "translate3d(-" +
      moveX +
      "px, 0, 0)";


    /* DOTS */

    dots.forEach(function (dot, index) {

      dot.classList.toggle(
        "active",
        index === currentIndex
      );

      dot.setAttribute(
        "aria-selected",
        index === currentIndex
          ? "true"
          : "false"
      );

    });

  }


  /* =========================================
     NEXT
  ========================================= */

  function nextSlide() {

    const maxIndex = getMaxIndex();

    if (currentIndex < maxIndex) {

      currentIndex++;

    } else {

      currentIndex = 0;

    }

    updateSlider();

  }


  /* =========================================
     PREVIOUS
  ========================================= */

  function previousSlide() {

    const maxIndex = getMaxIndex();

    if (currentIndex > 0) {

      currentIndex--;

    } else {

      currentIndex = maxIndex;

    }

    updateSlider();

  }


  /* =========================================
     NEXT BUTTON
  ========================================= */

  if (nextBtn) {

    nextBtn.addEventListener(
      "click",
      function (e) {

        e.preventDefault();

        nextSlide();

      }
    );

  }


  /* =========================================
     PREVIOUS BUTTON
  ========================================= */

  if (prevBtn) {

    prevBtn.addEventListener(
      "click",
      function (e) {

        e.preventDefault();

        previousSlide();

      }
    );

  }


  /* =========================================
     DOT NAVIGATION
  ========================================= */

  dots.forEach(function (dot) {

    dot.addEventListener(
      "click",
      function (e) {

        e.preventDefault();

        const index =
          parseInt(
            this.getAttribute("data-slide"),
            10
          );


        if (
          Number.isInteger(index) &&
          index >= 0 &&
          index <= getMaxIndex()
        ) {

          currentIndex = index;

          updateSlider();

        }

      }
    );

  });


  /* =========================================
     MOBILE GESTURE / SWIPE
  ========================================= */

  track.addEventListener(
    "touchstart",
    function (e) {

      if (!e.touches || !e.touches.length) {
        return;
      }

      startX =
        e.touches[0].clientX;

      startY =
        e.touches[0].clientY;

      isTouching = true;

    },
    {
      passive: true
    }
  );


  track.addEventListener(
    "touchend",
    function (e) {

      if (!isTouching) {
        return;
      }

      isTouching = false;


      if (
        !e.changedTouches ||
        !e.changedTouches.length
      ) {
        return;
      }


      const endX =
        e.changedTouches[0].clientX;

      const endY =
        e.changedTouches[0].clientY;


      const diffX =
        startX - endX;

      const diffY =
        startY - endY;


      /*
        Ignore vertical scrolling
      */

      if (
        Math.abs(diffY) >
        Math.abs(diffX)
      ) {

        return;

      }


      /*
        Ignore small movement
      */

      if (
        Math.abs(diffX) <
        swipeDistance
      ) {

        return;

      }


      /*
        Finger moved LEFT
        => Next
      */

      if (diffX > 0) {

        nextSlide();

      }


      /*
        Finger moved RIGHT
        => Previous
      */

      else {

        previousSlide();

      }

    },
    {
      passive: true
    }
  );


  /* =========================================
     RESIZE
  ========================================= */

  window.addEventListener(
    "resize",
    function () {

      updateSlider();

    }
  );


  /* =========================================
     START
  ========================================= */

  updateSlider();

});
