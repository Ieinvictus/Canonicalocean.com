const menuBtn = document.getElementById("menuBtn");
const navLinks = document.getElementById("navLinks");

// Mobile menu open / close
menuBtn.addEventListener("click", () => {
  navLinks.classList.toggle("show");
  menuBtn.classList.toggle("open");
});

// Menu link click → menu close
document.querySelectorAll(".nav-links a").forEach(link => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("show");
    menuBtn.classList.remove("open");
  });
});
