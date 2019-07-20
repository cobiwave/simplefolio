export default function() {
  const defaultProps = {
    easing: 'cubic-bezier(0.5, 0, 0, 1)',
    distance: '30px',
    duration: 1000,
    desktop: true,
    mobile: true
  };

  // Welcome Section
  ScrollReveal().reveal('#opening-text', {
    ...defaultProps,
    delay: 500,
    origin: 'left'
  });
  ScrollReveal().reveal('#opening-paragraph', {
    ...defaultProps,
    delay: 1000,
    origin: 'left'
  });

  // About Section
  ScrollReveal().reveal('.about-wrapper__image', {
    ...defaultProps,
    delay: 600,
    origin: 'bottom'
  });
  ScrollReveal().reveal('.about-wrapper__info', {
    ...defaultProps,
    delay: 1000,
    origin: 'left'
  });

  // Section
  ScrollReveal().reveal('.section-title', {
    ...defaultProps,
    delay: 300,
    distance: '0px',
    origin: 'bottom'
  });

  // Projects Section
  ScrollReveal().reveal('.project-wrapper__text', {
    ...defaultProps,
    delay: 500,
    origin: 'left'
  });
  ScrollReveal().reveal('.project-wrapper__image', {
    ...defaultProps,
    delay: 1000,
    origin: 'right'
  });

  // Contact Section
  ScrollReveal().reveal('.contact-wrapper', {
    delay: 800,
    origin: 'bottom'
  });
}
