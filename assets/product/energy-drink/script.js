/* =====================================================
   CANONICAL OCEAN™
   ENERGY — COMING SOON JS
===================================================== */

document.addEventListener("DOMContentLoaded", function () {

  const energySection =
    document.querySelector(".co-energy-coming");

  if (!energySection) return;


  /* Subtle mouse movement on desktop */

  const can =
    energySection.querySelector(".co-energy-can");

  const glow =
    energySection.querySelector(".co-energy-product-glow");


  if (can && glow && window.innerWidth > 600) {

    energySection.addEventListener(
      "mousemove",
      function (event) {

        const rect =
          energySection.getBoundingClientRect();

        const x =
          (event.clientX - rect.left)
          / rect.width
          - 0.5;

        const y =
          (event.clientY - rect.top)
          / rect.height
          - 0.5;

        can.style.transform =
          `translate(${x * 8}px, ${y * 8}px) rotate(${x * 3}deg)`;

        glow.style.transform =
          `translate(${x * -15}px, ${y * -15}px)`;

      }
    );


    energySection.addEventListener(
      "mouseleave",
      function () {

        can.style.transform =
          "rotate(-4deg)";

        glow.style.transform =
          "translate(0,0)";

      }
    );

  }


  /* Reveal */

  if ("IntersectionObserver" in window) {

    const observer =
      new IntersectionObserver(
        function (entries) {

          entries.forEach(function (entry) {

            if (entry.isIntersecting) {

              entry.target.classList.add(
                "energy-visible"
              );

              observer.unobserve(
                entry.target
              );

            }

          });

        },
        {
          threshold: 0.15
        }
      );

    observer.observe(energySection);

  } else {

    energySection.classList.add(
      "energy-visible"
    );

  }

});
