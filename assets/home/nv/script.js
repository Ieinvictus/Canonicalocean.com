document.addEventListener("DOMContentLoaded", function () {

  const menuBtn = document.getElementById("menuBtn");
  const navLinks = document.getElementById("navLinks");

  if (menuBtn && navLinks) {

    menuBtn.addEventListener("click", function () {

      navLinks.classList.toggle("active");

      const isOpen =
        navLinks.classList.contains("active");

      menuBtn.setAttribute(
        "aria-expanded",
        isOpen ? "true" : "false"
      );

    });

    navLinks.querySelectorAll("a").forEach(function (link) {

      link.addEventListener("click", function () {

        navLinks.classList.remove("active");

        menuBtn.setAttribute(
          "aria-expanded",
          "false"
        );

      });

    });

  }

});
