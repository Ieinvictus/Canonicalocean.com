document.addEventListener("DOMContentLoaded", function () {

  /* =====================================================
     MOBILE MENU
  ===================================================== */

  const menuBtn =
    document.getElementById("coAboutMenu");

  const nav =
    document.getElementById("coAboutNav");


  if (menuBtn && nav) {

    menuBtn.addEventListener("click", function () {

      const isOpen =
        nav.classList.toggle("open");

      menuBtn.setAttribute(
        "aria-expanded",
        isOpen ? "true" : "false"
      );

    });


    nav.querySelectorAll("a").forEach(function (link) {

      link.addEventListener("click", function () {

        nav.classList.remove("open");

        menuBtn.setAttribute(
          "aria-expanded",
          "false"
        );

      });

    });

  }


  /* =====================================================
     HERO SLIDER
     Manual + swipe
     NO AUTOPLAY
  ===================================================== */

  const track =
    document.getElementById("coAboutHeroTrack");

  const slides =
    document.querySelectorAll(
      ".co-about-hero-slide"
    );

  const dots =
    document.querySelectorAll(
      ".co-about-hero-dots button"
    );

  const prevBtn =
    document.getElementById("coAboutHeroPrev");

  const nextBtn =
    document.getElementById("coAboutHeroNext");

  const number =
    document.getElementById(
      "coAboutHeroNumber"
    );


  let currentSlide = 0;


  function showSlide(index) {

    if (!slides.length) return;


    if (index < 0) {
      index = slides.length - 1;
    }


    if (index >= slides.length) {
      index = 0;
    }


    currentSlide = index;


    slides.forEach(function (slide, i) {

      slide.classList.toggle(
        "active",
        i === currentSlide
      );

    });


    dots.forEach(function (dot, i) {

      dot.classList.toggle(
        "active",
        i === currentSlide
      );

    });


    if (number) {

      number.textContent =
        String(currentSlide + 1).padStart(2, "0")
        + " / "
        + String(slides.length).padStart(2, "0");

    }

  }


  if (prevBtn) {

    prevBtn.addEventListener(
      "click",
      function () {

        showSlide(
          currentSlide - 1
        );

      }
    );

  }


  if (nextBtn) {

    nextBtn.addEventListener(
      "click",
      function () {

        showSlide(
          currentSlide + 1
        );

      }
    );

  }


  dots.forEach(function (dot) {

    dot.addEventListener(
      "click",
      function () {

        showSlide(
          Number(
            dot.dataset.slide
          )
        );

      }
    );

  });


  /* =====================================================
     TOUCH SWIPE
  ===================================================== */

  let startX = 0;
  let startY = 0;


  if (track) {

    track.addEventListener(
      "touchstart",
      function (e) {

        startX =
          e.touches[0].clientX;

        startY =
          e.touches[0].clientY;

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


        const diffX =
          startX - endX;

        const diffY =
          startY - endY;


        if (
          Math.abs(diffY) >
          Math.abs(diffX)
        ) {
          return;
        }


        if (
          Math.abs(diffX) < 50
        ) {
          return;
        }


        if (diffX > 0) {

          showSlide(
            currentSlide + 1
          );

        } else {

          showSlide(
            currentSlide - 1
          );

        }

      },
      { passive: true }
    );

  }


  showSlide(0);


  /* =====================================================
     SCROLL REVEAL
  ===================================================== */

  const revealElements =
    document.querySelectorAll(
      ".co-reveal"
    );


  if ("IntersectionObserver" in window) {

    const observer =
      new IntersectionObserver(
        function (entries) {

          entries.forEach(function (entry) {

            if (
              entry.isIntersecting
            ) {

              entry.target.classList.add(
                "is-visible"
              );

              observer.unobserve(
                entry.target
              );

            }

          });

        },
        {
          threshold: 0.12
        }
      );


    revealElements.forEach(function (element) {

      observer.observe(element);

    });

  } else {

    revealElements.forEach(function (element) {

      element.classList.add(
        "is-visible"
      );

    });

  }

});
