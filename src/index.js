import initReveal from './js/scrollReveal';
import tilt from 'tilt.js';
import initTilt from './js/tilt';
import './style/main.scss';

$('a[href^="#"]').on('click', function(event) {
  var target = $(this.getAttribute('href'));
  if (target.length) {
    event.preventDefault();
    $('html, body')
      .stop()
      .animate(
        {
          scrollTop: target.offset().top
        },
        1000
      );
  }
});

initReveal();
initTilt();
