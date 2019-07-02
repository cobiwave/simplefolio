import initTilt from './js/tilt';
import sal from 'sal.js';
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

initTilt();
sal();
