(function () {
  const root = document.documentElement;
  const scrollKeys = new Set([
    "ArrowDown",
    "ArrowUp",
    "PageDown",
    "PageUp",
    "Home",
    "End",
    " ",
  ]);
  let hideTimer;
  let thumb;

  const createThumb = () => {
    if (thumb) return thumb;
    thumb = document.createElement("div");
    thumb.setAttribute("aria-hidden", "true");
    Object.assign(thumb.style, {
      position: "fixed",
      zIndex: "9999",
      top: "0",
      right: "5px",
      width: "5px",
      minHeight: "36px",
      borderRadius: "999px",
      background: "rgba(105, 105, 115, 0.46)",
      boxShadow: "0 0 12px rgba(25, 25, 30, 0.12)",
      opacity: "0",
      pointerEvents: "none",
      transform: "translateY(0)",
      transition: "opacity 220ms ease",
    });
    document.body.appendChild(thumb);
    return thumb;
  };

  const updateThumb = () => {
    const bar = createThumb();
    const viewportHeight = window.innerHeight;
    const scrollHeight = root.scrollHeight;
    const maxScroll = scrollHeight - viewportHeight;

    if (maxScroll <= 0) {
      bar.style.opacity = "0";
      return;
    }

    const ratio = viewportHeight / scrollHeight;
    const thumbHeight = Math.max(36, viewportHeight * ratio);
    const maxThumbTop = viewportHeight - thumbHeight;
    const top = (window.scrollY / maxScroll) * maxThumbTop;

    bar.style.height = `${thumbHeight}px`;
    bar.style.transform = `translateY(${top}px)`;
  };

  const revealScrollbar = () => {
    const bar = createThumb();
    updateThumb();
    bar.style.opacity = "1";
    window.clearTimeout(hideTimer);
    hideTimer = window.setTimeout(() => {
      bar.style.opacity = "0";
    }, 850);
  };

  ["scroll", "wheel", "touchmove"].forEach((eventName) => {
    window.addEventListener(eventName, revealScrollbar, { passive: true });
  });

  window.addEventListener("resize", updateThumb);
  window.addEventListener("keydown", (event) => {
    if (scrollKeys.has(event.key)) revealScrollbar();
  });

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", updateThumb);
  } else {
    updateThumb();
  }
})();
