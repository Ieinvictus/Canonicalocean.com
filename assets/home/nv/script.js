document.addEventListener("DOMContentLoaded", function () {

  const menuBtn = document.getElementById("menuBtn");
  const navLinks = document.getElementById("navLinks");

  if (!menuBtn || !navLinks) return;


  /* =====================================================
     MOBILE MENU
  ===================================================== */

  menuBtn.addEventListener("click", function () {

    const isOpen = navLinks.classList.toggle("active");

    menuBtn.setAttribute(
      "aria-expanded",
      isOpen ? "true" : "false"
    );

    menuBtn.setAttribute(
      "aria-label",
      isOpen ? "Close navigation menu" : "Open navigation menu"
    );

  });


  /* =====================================================
     CLOSE MENU AFTER LINK CLICK
  ===================================================== */

  navLinks.querySelectorAll("a").forEach(function (link) {

    link.addEventListener("click", function () {

      navLinks.classList.remove("active");

      menuBtn.setAttribute("aria-expanded", "false");

      menuBtn.setAttribute(
        "aria-label",
        "Open navigation menu"
      );

    });

  });


  /* =====================================================
     ACTIVE NAVIGATION
  ===================================================== */

  const currentPath =
    window.location.pathname.replace(/\/+$/, "") || "/";

  navLinks.querySelectorAll("a").forEach(function (link) {

    const href = link.getAttribute("href");

    if (!href || href.startsWith("#")) return;

    try {

      const linkUrl = new URL(href, window.location.origin);

      const linkPath =
        linkUrl.pathname.replace(/\/+$/, "") || "/";

      if (linkPath === currentPath) {

        navLinks
          .querySelectorAll("a")
          .forEach(function (item) {
            item.classList.remove("active");
          });

        link.classList.add("active");
      }

    } catch (error) {}

  });


  /* =====================================================
     ESCAPE KEY — CLOSE MOBILE MENU
  ===================================================== */

  document.addEventListener("keydown", function (event) {

    if (event.key === "Escape") {

      navLinks.classList.remove("active");

      menuBtn.setAttribute("aria-expanded", "false");

      menuBtn.setAttribute(
        "aria-label",
        "Open navigation menu"
      );

    }

  });


  /* =====================================================
     CLICK OUTSIDE — CLOSE MOBILE MENU
  ===================================================== */

  document.addEventListener("click", function (event) {

    if (
      navLinks.classList.contains("active") &&
      !navLinks.contains(event.target) &&
      !menuBtn.contains(event.target)
    ) {

      navLinks.classList.remove("active");

      menuBtn.setAttribute("aria-expanded", "false");

      menuBtn.setAttribute(
        "aria-label",
        "Open navigation menu"
      );

    }

  });

});
