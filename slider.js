const slider = document.getElementById('mySlider');

function slideNext() {
	// スライダーの幅（1枚分）だけ右へスクロール
	slider.scrollBy({ left: slider.clientWidth, behavior: 'smooth' });
}

function slidePrev() {
	// スライダーの幅（1枚分）だけ左へスクロール
	slider.scrollBy({ left: -slider.clientWidth, behavior: 'smooth' });
}
