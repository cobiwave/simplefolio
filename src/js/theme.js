const theme = () => {
	const btn = document.querySelector('.btn-toggle');

	btn.addEventListener('click', function () {
		document.body.classList.toggle('dark-theme');
	});
};
export default theme;
