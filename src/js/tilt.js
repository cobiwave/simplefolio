import tilt from 'tilt.js';

const initTilt = () => {
  // Projects images
  $('.project-wrapper__image a div').tilt({
    maxTilt: 7,
    glare: true,
    maxGlare: 0.5
  });
};

export default initTilt;
