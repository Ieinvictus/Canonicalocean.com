document.addEventListener("DOMContentLoaded", function () {

  const items = document.querySelectorAll(
    ".co-sustain-intro, .co-sustain-image, .co-sustain-card, .co-water-stewardship, .co-beverage-grid article, .co-sustain-closing"
  );

  if (!items.length) return;


  /* Initial state */

  items.forEach(function (item) {

    item.style.opacity = "0";
    item.style.transform = "translateY(35px)";
    item.style.transition =
      "opacity .8s ease, transform .8s ease";

  });


  /* Observer */

  const observer = new IntersectionObserver(
    function (entries, obs) {

      entries.forEach(function (entry) {

        if (!entry.isIntersecting) return;

        entry.target.style.opacity = "1";
        entry.target.style.transform =
          "translateY(0)";

        obs.unobserve(entry.target);

      });

    },
    {
      threshold: 0.12,
      rootMargin: "0px 0px -50px 0px"
    }
  );


  items.forEach(function (item) {
    observer.observe(item);
  });

});
