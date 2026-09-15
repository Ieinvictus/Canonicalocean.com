document.addEventListener("DOMContentLoaded", function () {


  /* =====================================================
     READING PROGRESS
  ===================================================== */

  const progress =
    document.getElementById("storyProgress");

  const article =
    document.getElementById("storyArticle");


  function updateProgress() {

    if (!progress || !article) return;

    const articleTop =
      article.offsetTop;

    const articleHeight =
      article.offsetHeight;

    const scrollPosition =
      window.scrollY - articleTop;

    const readableHeight =
      articleHeight - window.innerHeight;


    let percentage =
      (scrollPosition / readableHeight) * 100;


    percentage =
      Math.max(0, Math.min(100, percentage));


    progress.style.width =
      percentage + "%";

  }


  window.addEventListener(
    "scroll",
    updateProgress,
    {
      passive: true
    }
  );


  updateProgress();



  /* =====================================================
     SMOOTH INTERNAL LINKS
  ===================================================== */

  document
    .querySelectorAll(
      '.co-story-aside a[href^="#"]'
    )
    .forEach(function (link) {

      link.addEventListener(
        "click",
        function (event) {

          const target =
            document.querySelector(
              link.getAttribute("href")
            );

          if (!target) return;

          event.preventDefault();

          target.scrollIntoView({
            behavior: "smooth",
            block: "start"
          });

        }
      );

    });



  /* =====================================================
     ACTIVE STORY INDEX
  ===================================================== */

  const sections =
    document.querySelectorAll(
      ".co-story-text-section"
    );

  const storyLinks =
    document.querySelectorAll(
      ".co-story-aside a"
    );


  if (
    "IntersectionObserver" in window &&
    sections.length
  ) {

    const sectionObserver =
      new IntersectionObserver(
        function (entries) {

          entries.forEach(function (entry) {

            if (!entry.isIntersecting) return;

            const id =
              entry.target.id;


            storyLinks.forEach(
              function (link) {

                link.classList.remove("current");

                if (
                  link.getAttribute("href") ===
                  "#" + id
                ) {

                  link.classList.add(
                    "current"
                  );

                }

              }
            );

          });

        },
        {
          rootMargin:
            "-30% 0px -55% 0px"
        }
      );


    sections.forEach(function (section) {

      sectionObserver.observe(section);

    });

  }


  /* =====================================================
     IMAGE PARALLAX
  ===================================================== */

  const coverImage =
    document.querySelector(
      ".co-story-cover-image img"
    );


  if (
    coverImage &&
    window.matchMedia(
      "(min-width: 701px)"
    ).matches
  ) {

    window.addEventListener(
      "scroll",
      function () {

        const rect =
          coverImage.parentElement
            .getBoundingClientRect();

        const visible =
          window.innerHeight - rect.top;

        if (
          visible > 0 &&
          rect.bottom > 0
        ) {

          const movement =
            Math.max(
              -20,
              Math.min(20, visible * .025)
            );

          coverImage.style.transform =
            "translateY(" +
            movement +
            "px) scale(1.04)";

        }

      },
      {
        passive: true
      }
    );

  }


});
