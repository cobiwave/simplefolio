import initTilt from './js/tilt';
import initSr from './js/sr';
var ghpages = require('gh-pages');

ghpages.publish('dist', function(err) {});

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

initSr();
initTilt();
