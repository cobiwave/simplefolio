import initTilt from './js/tilt';
import initSr from './js/sr';
import theme from './js/theme';

import './style/main.scss';

$('a[href^="#"]').on('click', function (event) {
	var target = $(this.getAttribute('href'));
	if (target.length) {
		event.preventDefault();
		$('html, body').stop().animate(
			{
				scrollTop: target.offset().top,
			},
			1000,
		);
	}
});

const btn = document.querySelector('.btn-toggle');
btn.addEventListener('click', function () {
	document.body.classList.toggle('dark-theme');
	console.log('btn clicked');
});

theme();
initSr();
initTilt();
