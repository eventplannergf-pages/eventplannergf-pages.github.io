document.addEventListener("DOMContentLoaded", () => {
  const nav = document.querySelector(".site-nav");
  const navToggle = document.querySelector(".nav-toggle");
  const menuLinks = document.querySelectorAll(".site-menu a");
  const currentYearEl = document.getElementById("current-year");

  if (nav && navToggle) {
    navToggle.addEventListener("click", (e) => {
      e.stopPropagation();
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

    // Close menu when clicking outside (mobile)
    document.addEventListener("click", (e) => {
      if (nav.classList.contains("open") && !nav.contains(e.target)) {
        nav.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
      }
    });

    // Close menu on escape key
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && nav.classList.contains("open")) {
        nav.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
        navToggle.focus();
      }
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

    const getStep = () => Math.max(200, viewport.offsetWidth * 0.6);

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
      let isPaused = false;
      const scrollSpeed = carousel.dataset.carousel === "brands" ? 0.04 : 0.06;

      const autoScroll = (timestamp) => {
        if (isPaused) {
          animationFrameId = requestAnimationFrame(autoScroll);
          return;
        }

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

      // Pause on touch/hover for better mobile experience
      let pauseTimeout;
      const pauseAutoScroll = () => {
        isPaused = true;
        lastTimestamp = null;
        clearTimeout(pauseTimeout);
        pauseTimeout = setTimeout(() => {
          isPaused = false;
        }, 3000);
      };

      viewport.addEventListener("touchstart", pauseAutoScroll, { passive: true });
      viewport.addEventListener("mouseenter", pauseAutoScroll);
      viewport.addEventListener("wheel", pauseAutoScroll, { passive: true });

      startAutoScroll();
    }
  });

  // Smooth scroll for anchor links (better mobile experience)
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function(e) {
      const targetId = this.getAttribute("href");
      if (targetId === "#") return;
      
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const headerHeight = document.querySelector(".site-header")?.offsetHeight || 0;
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
        
        window.scrollTo({
          top: targetPosition,
          behavior: "smooth"
        });
      }
    });
  });
});

