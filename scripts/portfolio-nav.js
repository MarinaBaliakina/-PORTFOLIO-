(() => {
  const nav = document.querySelector('.nav-portfolio');
  if (!nav) return;

  const toggle = nav.querySelector('.nav-portfolio-toggle');
  const links = nav.querySelectorAll('.nav-portfolio-links a');
  if (!toggle) return;

  const setMenuState = (isOpen) => {
    nav.classList.toggle('is-open', isOpen);
    toggle.setAttribute('aria-expanded', String(isOpen));
    toggle.setAttribute('aria-label', isOpen ? 'Close portfolio categories' : 'Open portfolio categories');
    document.body.classList.toggle('portfolio-menu-open', isOpen);
  };

  const closeMenu = () => {
    setMenuState(false);
  };

  const openMenu = () => {
    setMenuState(true);
  };

  toggle.addEventListener('click', (event) => {
    event.stopPropagation();

    if (nav.classList.contains('is-open')) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  links.forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('click', (event) => {
    if (!nav.contains(event.target)) {
      closeMenu();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeMenu();
    }
  });
})();
