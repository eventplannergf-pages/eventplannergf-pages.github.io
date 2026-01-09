document.addEventListener("DOMContentLoaded", () => {
  const nav = document.querySelector(".site-nav");
  const navToggle = document.querySelector(".nav-toggle");
  const menuLinks = document.querySelectorAll(".site-menu a");
  const currentYearEl = document.getElementById("current-year");

  if (nav && navToggle) {
    navToggle.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
    });

    menuLinks.forEach((link) => {
      link.addEventListener("click", () => {
        if (nav.classList.contains("open")) {
          nav.classList.remove("open");
          navToggle.setAttribute("aria-expanded", "false");
        }
      });
    });
  }

  if (currentYearEl) {
    currentYearEl.textContent = new Date().getFullYear();
  }

  const carousels = document.querySelectorAll(".carousel, .image-carousel");

  carousels.forEach((carousel) => {
    const viewport = carousel.querySelector(".carousel-viewport");
    const controls = carousel.querySelectorAll(".carousel-control");
    const track = carousel.querySelector(".carousel-track");

    if (!viewport) {
      return;
    }

    const getStep = () => Math.max(240, viewport.offsetWidth * 0.7);

    controls.forEach((control) => {
      control.addEventListener("click", () => {
        const direction = control.dataset.direction === "next" ? 1 : -1;
        viewport.scrollBy({ left: direction * getStep(), behavior: "smooth" });
      });
    });

    if (track && viewport) {
      const slides = Array.from(track.children).filter((slide) => !slide.classList.contains("is-clone"));
      if (slides.length) {
        slides.forEach((slide) => {
          const clone = slide.cloneNode(true);
          clone.classList.add("is-clone");
          track.appendChild(clone);
        });
      }

      let animationFrameId;
      let lastTimestamp;
      const scrollSpeed = carousel.dataset.carousel === "brands" ? 0.06 : 0.08;

      const autoScroll = (timestamp) => {
        if (lastTimestamp == null) {
          lastTimestamp = timestamp;
        }
        const delta = timestamp - lastTimestamp;
        lastTimestamp = timestamp;

        viewport.scrollLeft += scrollSpeed * delta;

        if (viewport.scrollLeft >= track.scrollWidth / 2) {
          viewport.scrollLeft = 0;
        }

        animationFrameId = requestAnimationFrame(autoScroll);
      };

      const startAutoScroll = () => {
        if (!animationFrameId) {
          animationFrameId = requestAnimationFrame(autoScroll);
        }
      };

      const stopAutoScroll = () => {
        if (animationFrameId) {
          cancelAnimationFrame(animationFrameId);
          animationFrameId = null;
          lastTimestamp = null;
        }
      };

      startAutoScroll();
    }
  });
});

