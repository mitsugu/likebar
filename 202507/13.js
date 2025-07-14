tippy('.tooltip', {
	content(reference) {
		return reference.getAttribute('data-tooltip');
	},
	allowHTML: true,
});
