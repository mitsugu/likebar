document.addEventListener("click", (event) => {
	const trigger = event.target.closest(".toggle-trigger");
	if (!trigger) return;
	const content = trigger.nextElementSibling;
	if (content && content.classList.contains("toggle-content")) {
	    content.classList.toggle("hidden");
	}
});
