/* ==========================================
CANONICAL OCEAN CURTAIN MENU
========================================== */

const menuBtn = document.getElementById("sdMenuBtn");
const curtainMenu = document.getElementById("sdCurtainMenu");

menuBtn.addEventListener("click", () => {

    menuBtn.classList.toggle("active");
    curtainMenu.classList.toggle("active");

    document.body.classList.toggle("menu-open");

});

/* Close menu when a link is clicked */

document.querySelectorAll(".sd-menu-links a").forEach(link => {

    link.addEventListener("click", () => {

        menuBtn.classList.remove("active");
        curtainMenu.classList.remove("active");
        document.body.classList.remove("menu-open");

    });

});

/* Close menu with ESC key */

document.addEventListener("keydown", (e) => {

    if (e.key === "Escape") {

        menuBtn.classList.remove("active");
        curtainMenu.classList.remove("active");
        document.body.classList.remove("menu-open");

    }

});

/* Optional: Close when clicking outside */

curtainMenu.addEventListener("click", (e) => {

    if (e.target === curtainMenu) {

        menuBtn.classList.remove("active");
        curtainMenu.classList.remove("active");
        document.body.classList.remove("menu-open");

    }

});
