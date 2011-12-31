tippy('.tooltip', {
	content(reference) {
		return reference.getAttribute('data-tooltip');
	},
	allowHTML: true,
	/*
	trigger: 'click',
	interactive: true,
	hideOnClick: true,
	onShow(instance) {
		instance.reference.classList.add('active');
	},
	onHide(instance) {
		instance.reference.classList.remove('active');
	},
	theme: 'orz-theme',
	*/
});
