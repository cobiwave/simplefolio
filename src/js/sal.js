import sal from 'sal.js';

const initSal = () => {
  const scrollAnimations = sal();

  // Disable fade animation on smaller screens
  window.innerWidth <= 1024 ? scrollAnimations.disable() : sal();
};

export default initSal;
