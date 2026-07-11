(function () {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const revealStorageKey = `marina-reveal-seen:${window.location.pathname}`;
  let hasSeenPage = false;

  try {
    hasSeenPage = window.sessionStorage.getItem(revealStorageKey) === "true";
  } catch (error) {
    hasSeenPage = false;
  }

  const revealSelectors = [
    "h1",
    "h2",
    "h3",
    "h4",
    "p",
    "li",
    ".btn",
    ".section-heading",
    ".examples-subheading",
    ".phone",
    ".mini-phone",
    ".iphone",
    ".laptop-mockup",
    ".project-image",
    ".image-panel",
    ".stage-screen",
    ".stage-panel",
    ".video-frame",
    ".vimeo-player",
    ".custom-vimeo",
    "img",
  ];

  const style = document.createElement("style");
  style.textContent = `
    .reveal-ready .reveal-on-scroll {
      opacity: 0;
      transform: translateY(8px);
      transition:
        opacity 300ms ease,
        transform 300ms ease;
      transition-delay: var(--reveal-delay, 0ms);
    }

    .reveal-ready .reveal-on-scroll.is-revealed {
      opacity: 1;
      transform: translateY(0);
    }

    .reveal-skip .reveal-on-scroll {
      transition: none !important;
    }

    @media (prefers-reduced-motion: reduce) {
      .reveal-ready .reveal-on-scroll {
        opacity: 1;
        transform: none;
        transition: none;
      }
    }
  `;
  document.head.appendChild(style);

  const initReveal = () => {
    const elements = [...document.querySelectorAll(revealSelectors.join(","))]
      .filter((element) => !element.closest(".case-nav, .floating-categories, .floating-contact"))
      .filter((element) => {
        const mediaShell = element.closest(".iphone, .phone, .mini-phone, .screen, .laptop-mockup, .stage-screens, .stage-screen, .stage-panel");
        return !mediaShell || element === mediaShell;
      });

    elements.forEach((element, index) => {
      element.classList.add("reveal-on-scroll");
      element.style.setProperty("--reveal-delay", `${Math.min(index % 3, 2) * 18}ms`);
    });

    if (hasSeenPage) {
      elements.forEach((element) => element.classList.add("is-revealed"));
      document.documentElement.classList.add("reveal-skip");
    } else {
      try {
        window.sessionStorage.setItem(revealStorageKey, "true");
      } catch (error) {
        // If storage is unavailable, just let the lightweight animation run.
      }
    }

    document.documentElement.classList.add("reveal-ready");

    if (hasSeenPage || reduceMotion || !("IntersectionObserver" in window)) {
      elements.forEach((element) => element.classList.add("is-revealed"));
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-revealed");
        observer.unobserve(entry.target);
      });
    }, {
      rootMargin: "0px 0px -6% 0px",
      threshold: 0.04,
    });

    elements.forEach((element) => observer.observe(element));
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initReveal);
  } else {
    initReveal();
  }

  const initPortfolioNav = () => {
    // Portfolio menu behavior is handled by scripts/portfolio-nav.js to avoid
    // conflicting toggle handlers on the same nav button.
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initPortfolioNav);
  } else {
    initPortfolioNav();
  }
})();
