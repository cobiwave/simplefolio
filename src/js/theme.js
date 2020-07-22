const theme = () => {
	const btn = document.querySelector('.btn-toggle');
	const fa = document.querySelector('i');
	const sun = 'fa-sun-o';
	const moon = 'fa-moon-o';

	btn.addEventListener('click', function () {
		document.body.classList.toggle('dark-theme');
		if (fa.classList.contains(moon)) {
			fa.classList.remove(moon);
			fa.classList.add(sun);
		} else if (fa.classList.contains(sun)) {
			fa.classList.remove(sun);
			fa.classList.add(moon);
		}
	});
};
export default theme;
