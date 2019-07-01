import ScrollReveal from 'scrollreveal';

const initReveal = () => {
  // Header Reveal
  ScrollReveal().reveal('#welcome-section', {
    delay: 500,
    duration: 1000,
    distance: '50px',
    origin: 'left',
    reset: false
  });

  const openingButton =
    window.innerWidth > 600
      ? {
          delay: 1000,
          duration: 1000,
          distance: '50px',
          origin: 'left',
          reset: false
        }
      : {
          delay: 1000,
          duration: 1000,
          distance: '30px',
          origin: 'bottom',
          reset: false
        };
  ScrollReveal().reveal('#opening-paragraph', openingButton);

  // Section Title
  ScrollReveal().reveal('.section-title', {
    duration: 1500,
    reset: false
  });

  // About Me Reveal
  ScrollReveal().reveal('.about-wrapper__image', {
    delay: 800,
    duration: 800,
    distance: '50px',
    origin: 'bottom',
    reset: false
  });

  ScrollReveal().reveal('.about-wrapper__info', {
    delay: 1200,
    duration: 800,
    distance: '50px',
    origin: 'left',
    reset: false
  });

  // Projects Reveal
  ScrollReveal().reveal('.project-wrapper__text', {
    delay: 800,
    duration: 800,
    distance: '50px',
    origin: 'left',
    reset: false
  });

  const projectImg =
    window.innerWidth > 600
      ? {
          delay: 1300,
          duration: 800,
          distance: '50px',
          origin: 'right',
          reset: false
        }
      : {
          delay: 800,
          duration: 800,
          distance: '30px',
          origin: 'bottom',
          reset: false
        };
  ScrollReveal().reveal('.project-wrapper__image', projectImg);

  // Contact Reveal
  ScrollReveal().reveal('.contact-wrapper', {
    delay: 1000,
    duration: 800,
    distance: '30px',
    origin: 'bottom',
    reset: false
  });
};

export default initReveal;
