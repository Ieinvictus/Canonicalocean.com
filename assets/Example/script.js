/* =========================================================
   CANONICAL OCEAN
   Premium Website JavaScript
   Features:
   01. Mobile Navigation
   02. Sticky Navbar
   03. Active Navigation
   04. Smooth Scrolling
   05. Scroll Reveal Animation
   06. FAQ Accordion
   07. Footer Current Year
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

  /* =====================================================
     01. MOBILE NAVIGATION
  ===================================================== */

  const menuToggle = document.querySelector("#menuToggle");
  const mainNavigation = document.querySelector("#mainNavigation");
  const siteHeader = document.querySelector("#siteHeader");

  function closeMenu() {
    if (!menuToggle || !mainNavigation) return;

    mainNavigation.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");

    const icon = menuToggle.querySelector("i");

    if (icon) {
      icon.classList.remove("fa-xmark");
      icon.classList.add("fa-bars");
    }
  }

  if (menuToggle && mainNavigation) {

    menuToggle.setAttribute("aria-expanded", "false");

    menuToggle.addEventListener("click", () => {

      const isOpen = mainNavigation.classList.toggle("open");

      menuToggle.setAttribute("aria-expanded", String(isOpen));

      const icon = menuToggle.querySelector("i");

      if (icon) {
        icon.classList.toggle("fa-bars", !isOpen);
        icon.classList.toggle("fa-xmark", isOpen);
      }

    });

    // Close menu after clicking a navigation link
    mainNavigation.querySelectorAll("a").forEach(link => {

      link.addEventListener("click", closeMenu);

    });

    // Close menu with Escape key
    document.addEventListener("keydown", event => {

      if (event.key === "Escape") {
        closeMenu();
      }

    });

    // Close menu when clicking outside
    document.addEventListener("click", event => {

      const clickedMenu = mainNavigation.contains(event.target);
      const clickedButton = menuToggle.contains(event.target);

      if (!clickedMenu && !clickedButton) {
        closeMenu();
      }

    });

    // Close menu on desktop screen
    window.addEventListener("resize", () => {

      if (window.innerWidth > 900) {
        closeMenu();
      }

    });

  }


  /* =====================================================
     02. STICKY NAVBAR
  ===================================================== */

  function updateHeader() {

    if (!siteHeader) return;

    siteHeader.classList.toggle(
      "scrolled",
      window.scrollY > 40
    );

  }

  window.addEventListener("scroll", updateHeader, {
    passive: true
  });

  updateHeader();


  /* =====================================================
     03. ACTIVE NAVIGATION
  ===================================================== */

  const navLinks = document.querySelectorAll(
    ".main-navigation .nav-link"
  );

  const pageSections = document.querySelectorAll(
    "main section[id]"
  );

  if ("IntersectionObserver" in window && navLinks.length) {

    const navigationObserver = new IntersectionObserver(
      entries => {

        entries.forEach(entry => {

          if (!entry.isIntersecting) return;

          const currentId = entry.target.id;

          navLinks.forEach(link => {

            const linkTarget = link.getAttribute("href");

            link.classList.toggle(
              "active",
              linkTarget === `#${currentId}`
            );

          });

        });

      },
      {
        rootMargin: "-25% 0px -65% 0px",
        threshold: 0
      }
    );

    pageSections.forEach(section => {
      navigationObserver.observe(section);
    });

  }


  /* =====================================================
     04. SMOOTH SCROLLING
  ===================================================== */

  document.querySelectorAll('a[href^="#"]').forEach(link => {

    link.addEventListener("click", event => {

      const href = link.getAttribute("href");

      if (!href || href === "#") return;

      const target = document.querySelector(href);

      if (!target) return;

      event.preventDefault();

      const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      const headerHeight = siteHeader
        ? siteHeader.offsetHeight
        : 0;

      const targetPosition =
        target.getBoundingClientRect().top +
        window.scrollY -
        headerHeight -
        12;

      window.scrollTo({
        top: Math.max(0, targetPosition),
        behavior: reducedMotion ? "auto" : "smooth"
      });

      if (history.replaceState) {
        history.replaceState(null, "", href);
      }

    });

  });


  /* =====================================================
     05. PREMIUM PAGE REVEAL
  ===================================================== */

  const revealElements = document.querySelectorAll(
    ".reveal, .reveal-left, .reveal-right, .reveal-scale"
  );

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (
    "IntersectionObserver" in window &&
    !reducedMotion
  ) {

    const revealObserver = new IntersectionObserver(
      (entries, observer) => {

        entries.forEach(entry => {

          if (entry.isIntersecting) {

            entry.target.classList.add("is-visible");

            observer.unobserve(entry.target);

          }

        });

      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -40px 0px"
      }
    );

    revealElements.forEach(element => {
      revealObserver.observe(element);
    });

  } else {

    revealElements.forEach(element => {
      element.classList.add("is-visible");
    });

  }


  /* =====================================================
     06. FAQ ACCORDION
  ===================================================== */

  const faqItems = document.querySelectorAll(".faq-item");

  faqItems.forEach(item => {

    item.addEventListener("toggle", () => {

      if (!item.open) return;

      faqItems.forEach(otherItem => {

        if (otherItem !== item) {
          otherItem.open = false;
        }

      });

    });

  });


  /* =====================================================
     07. FOOTER CURRENT YEAR
  ===================================================== */

  const currentYear = document.querySelector("#currentYear");

  if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
  }


  /* =====================================================
     08. PAGE READY
  ===================================================== */

  document.documentElement.classList.add("js-ready");

});