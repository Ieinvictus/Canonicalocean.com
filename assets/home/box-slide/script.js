/* =====================================================
   CANONICAL OCEAN — CORE WATER CAROUSEL
   Features:
   - 7-card 3D carousel
   - Manual mouse drag and touch swipe
   - Previous / Next buttons
   - Pagination dots
   - Keyboard arrow navigation
   - Responsive layout
   - No autoplay
   - No images or wave effects
===================================================== */

document.addEventListener("DOMContentLoaded", () => {
    "use strict";

    /* =====================================================
       ELEMENTS
    ===================================================== */

    const carousel = document.getElementById("coCarousel");
    const track = document.getElementById("coTrack");
    const prevButton = document.getElementById("coPrev");
    const nextButton = document.getElementById("coNext");
    const dotsContainer = document.getElementById("coDots");

    if (!carousel || !track) {
        console.warn("Core Water Carousel: Required elements not found.");
        return;
    }

    const cards = Array.from(track.querySelectorAll(".co-card"));

    if (cards.length === 0) {
        console.warn("Core Water Carousel: No cards found.");
        return;
    }

    /* =====================================================
       SETTINGS
    ===================================================== */

    const TOTAL_CARDS = cards.length;
    const SWIPE_THRESHOLD = 50;
    const DRAG_THRESHOLD = 8;

    let activeIndex = 0;
    let isDragging = false;
    let startX = 0;
    let currentX = 0;
    let pointerId = null;
    let hasMoved = false;

    /* =====================================================
       HELPERS
    ===================================================== */

    function getCircularPosition(index) {
        let position = index - activeIndex;

        if (position > TOTAL_CARDS / 2) {
            position -= TOTAL_CARDS;
        }

        if (position < -TOTAL_CARDS / 2) {
            position += TOTAL_CARDS;
        }

        return position;
    }

    function getResponsiveValues() {
        const width = window.innerWidth;

        if (width <= 480) {
            return {
                gap: 220,
                depth: 65,
                sideScale: 0.76,
                rotate: 24
            };
        }

        if (width <= 768) {
            return {
                gap: 260,
                depth: 85,
                sideScale: 0.80,
                rotate: 25
            };
        }

        if (width <= 1050) {
            return {
                gap: 305,
                depth: 100,
                sideScale: 0.83,
                rotate: 27
            };
        }

        return {
            gap: 350,
            depth: 120,
            sideScale: 0.85,
            rotate: 30
        };
    }

    /* =====================================================
       CREATE PAGINATION DOTS
    ===================================================== */

    function createDots() {
        if (!dotsContainer) return;

        dotsContainer.innerHTML = "";

        cards.forEach((card, index) => {
            const dot = document.createElement("button");

            dot.type = "button";
            dot.className = "co-dot";
            dot.setAttribute("aria-label", `Show card ${index + 1}`);
            dot.setAttribute("aria-controls", "coTrack");

            dot.addEventListener("click", () => {
                goToCard(index);
            });

            dotsContainer.appendChild(dot);
        });
    }

    /* =====================================================
       UPDATE CAROUSEL
    ===================================================== */

    function updateCarousel() {
        const responsive = getResponsiveValues();

        cards.forEach((card, index) => {
            const position = getCircularPosition(index);
            const distance = Math.abs(position);
            const isCenter = position === 0;

            card.classList.toggle("is-center", isCenter);

            card.setAttribute(
                "aria-current",
                isCenter ? "true" : "false"
            );

            if (isCenter) {
                card.style.transform =
                    "translate(-50%, -50%) " +
                    "translateX(0px) " +
                    `translateZ(${responsive.depth}px) ` +
                    "rotateY(0deg) scale(1)";

                card.style.opacity = "1";
                card.style.zIndex = "20";
                card.style.pointerEvents = "auto";
                card.style.visibility = "visible";
                card.style.filter = "none";
            } else {
                const direction = position > 0 ? 1 : -1;

                const translateX = position * responsive.gap;
                const translateZ = -distance * 35;
                const rotateY = -direction * responsive.rotate;
                const scale = Math.max(
                    0.60,
                    1 - distance * (1 - responsive.sideScale)
                );

                const opacity = Math.max(
                    0,
                    1 - distance * 0.30
                );

                card.style.transform =
                    "translate(-50%, -50%) " +
                    `translateX(${translateX}px) ` +
                    `translateZ(${translateZ}px) ` +
                    `rotateY(${rotateY}deg) ` +
                    `scale(${scale})`;

                card.style.opacity = String(opacity);
                card.style.zIndex = String(10 - distance);
                card.style.pointerEvents = distance === 1 ? "auto" : "none";
                card.style.visibility = distance > 3 ? "hidden" : "visible";
                card.style.filter = distance > 1 ? "saturate(0.85)" : "none";
            }
        });

        updateDots();
        updateButtons();
    }

    /* =====================================================
       UPDATE DOTS
    ===================================================== */

    function updateDots() {
        if (!dotsContainer) return;

        const dots = dotsContainer.querySelectorAll(".co-dot");

        dots.forEach((dot, index) => {
            const isActive = index === activeIndex;

            dot.classList.toggle("active", isActive);
            dot.setAttribute("aria-current", isActive ? "true" : "false");
        });
    }

    /* =====================================================
       UPDATE BUTTON STATES
    ===================================================== */

    function updateButtons() {
        if (prevButton) {
            prevButton.setAttribute(
                "aria-label",
                "Previous card"
            );
        }

        if (nextButton) {
            nextButton.setAttribute(
                "aria-label",
                "Next card"
            );
        }
    }

    /* =====================================================
       NAVIGATION
    ===================================================== */

    function goToCard(index) {
        activeIndex = (index + TOTAL_CARDS) % TOTAL_CARDS;
        updateCarousel();
    }

    function nextCard() {
        goToCard(activeIndex + 1);
    }

    function previousCard() {
        goToCard(activeIndex - 1);
    }

    if (prevButton) {
        prevButton.addEventListener("click", previousCard);
    }

    if (nextButton) {
        nextButton.addEventListener("click", nextCard);
    }

    /* =====================================================
       POINTER DRAG AND TOUCH SWIPE
    ===================================================== */

    carousel.style.touchAction = "pan-y";

    carousel.addEventListener("pointerdown", (event) => {
        if (event.pointerType === "mouse" && event.button !== 0) {
            return;
        }

        if (
            event.target.closest("button") ||
            event.target.closest("a") ||
            event.target.closest("input")
        ) {
            return;
        }

        isDragging = true;
        hasMoved = false;
        startX = event.clientX;
        currentX = event.clientX;
        pointerId = event.pointerId;

        carousel.classList.add("is-dragging");
    });

    carousel.addEventListener("pointermove", (event) => {
        if (!isDragging || event.pointerId !== pointerId) {
            return;
        }

        currentX = event.clientX;

        if (Math.abs(currentX - startX) > DRAG_THRESHOLD) {
            hasMoved = true;
        }
    });

    function finishDrag(event) {
        if (!isDragging) return;

        if (
            event &&
            pointerId !== null &&
            event.pointerId !== undefined &&
            event.pointerId !== pointerId
        ) {
            return;
        }

        const distance = currentX - startX;

        isDragging = false;
        carousel.classList.remove("is-dragging");

        if (hasMoved && Math.abs(distance) >= SWIPE_THRESHOLD) {
            if (distance < 0) {
                nextCard();
            } else {
                previousCard();
            }
        }

        startX = 0;
        currentX = 0;
        pointerId = null;
        hasMoved = false;
    }

    carousel.addEventListener("pointerup", finishDrag);
    carousel.addEventListener("pointercancel", finishDrag);

    /* =====================================================
       KEYBOARD NAVIGATION
    ===================================================== */

    carousel.addEventListener("keydown", (event) => {
        if (event.key === "ArrowRight") {
            event.preventDefault();
            nextCard();
        }

        if (event.key === "ArrowLeft") {
            event.preventDefault();
            previousCard();
        }
    });

    /* =====================================================
       CLICK SIDE CARD TO CENTER IT
    ===================================================== */

    cards.forEach((card, index) => {
        card.addEventListener("click", (event) => {
            if (hasMoved) {
                event.preventDefault();
                return;
            }

            if (index !== activeIndex) {
                goToCard(index);
            }
        });
    });

    /* =====================================================
       RESPONSIVE RESIZE
    ===================================================== */

    let resizeFrame = null;

    window.addEventListener("resize", () => {
        if (resizeFrame !== null) {
            cancelAnimationFrame(resizeFrame);
        }

        resizeFrame = requestAnimationFrame(() => {
            updateCarousel();
            resizeFrame = null;
        });
    });

    /* =====================================================
       INITIALIZE
    ===================================================== */

    createDots();
    updateCarousel();

});
