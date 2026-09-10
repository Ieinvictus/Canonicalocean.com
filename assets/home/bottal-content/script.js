document.addEventListener("DOMContentLoaded", function () {

  const track = document.getElementById("bottleTrack");
  const nextBtn = document.getElementById("nextBtn");
  const prevBtn = document.getElementById("prevBtn");

  if (!track || !nextBtn || !prevBtn) return;

  let currentIndex = 0;

  function getVisibleCards() {

    if (window.innerWidth <= 600) return 1;

    if (window.innerWidth <= 800) return 2;

    return 3;
  }


  function updateSlider() {

    const cards =
      track.querySelectorAll(".bottle-card");

    if (!cards.length) return;

    const maxIndex = Math.max(
      0,
      cards.length - getVisibleCards()
    );

    if (currentIndex > maxIndex) {
      currentIndex = maxIndex;
    }

    const targetCard = cards[currentIndex];

    if (!targetCard) return;

    track.style.transform =
      `translate3d(-${targetCard.offsetLeft}px, 0, 0)`;
  }


  /* NEXT */

  nextBtn.addEventListener("click", function () {

    const cards =
      track.querySelectorAll(".bottle-card");

    const maxIndex = Math.max(
      0,
      cards.length - getVisibleCards()
    );

    currentIndex++;

    if (currentIndex > maxIndex) {
      currentIndex = 0;
    }

    updateSlider();
  });


  /* PREVIOUS */

  prevBtn.addEventListener("click", function () {

    const cards =
      track.querySelectorAll(".bottle-card");

    const maxIndex = Math.max(
      0,
      cards.length - getVisibleCards()
    );

    currentIndex--;

    if (currentIndex < 0) {
      currentIndex = maxIndex;
    }

    updateSlider();
  });


  /* =========================
     MOBILE GESTURE SWIPE
  ========================= */

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

      const endX =
        e.changedTouches[0].clientX;

      const endY =
        e.changedTouches[0].clientY;

      const diffX = startX - endX;
      const diffY = startY - endY;


      /* Ignore vertical scrolling */

      if (Math.abs(diffY) > Math.abs(diffX)) {
        return;
      }


      /* Minimum swipe = 50px */

      if (Math.abs(diffX) < 50) {
        return;
      }


      if (diffX > 0) {

        // LEFT SWIPE → NEXT
        nextBtn.click();

      } else {

        // RIGHT SWIPE → PREVIOUS
        prevBtn.click();

      }

    },
    { passive: true }
  );


  /* RESIZE */

  window.addEventListener("resize", function () {
    updateSlider();
  });


  /* INITIAL */

  updateSlider();

});
