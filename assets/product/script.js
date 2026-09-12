document.addEventListener("DOMContentLoaded", function () {

  /* =====================================================
     SCROLL REVEAL
  ===================================================== */

  const revealItems =
    document.querySelectorAll(".co-water-reveal");

  if ("IntersectionObserver" in window) {

    const observer =
      new IntersectionObserver(
        function (entries) {

          entries.forEach(function (entry) {

            if (entry.isIntersecting) {

              entry.target.classList.add("visible");

              observer.unobserve(entry.target);

            }

          });

        },
        {
          threshold: 0.12
        }
      );

    revealItems.forEach(function (item) {
      observer.observe(item);
    });

  } else {

    revealItems.forEach(function (item) {
      item.classList.add("visible");
    });

  }


  /* =====================================================
     PRODUCT CARD HOVER
  ===================================================== */

  const productCards =
    document.querySelectorAll(".co-water-card");

  productCards.forEach(function (card) {

    card.addEventListener("mouseenter", function () {

      card.classList.add("product-hover");

    });

    card.addEventListener("mouseleave", function () {

      card.classList.remove("product-hover");

    });

  });


  /* =====================================================
     SMOOTH COLLECTION BUTTON
  ===================================================== */

  const heroButton =
    document.querySelector(
      '.co-water-hero-btn[href="#collection"]'
    );

  if (heroButton) {

    heroButton.addEventListener(
      "click",
      function (event) {

        const target =
          document.getElementById("collection");

        if (!target) return;

        event.preventDefault();

        target.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });

      }
    );

  }

});
