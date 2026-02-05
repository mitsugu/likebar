document.addEventListener('DOMContentLoaded', () => {
    const sliders = document.querySelectorAll('.slider-wrapper');
    sliders.forEach(wrapper => {
        initSlider(wrapper);
    });
});

function initSlider(wrapper) {
    // --- 1. 設定値の読み込み ---
    const config = {
        autoPlay: wrapper.dataset.autoPlay === 'true',
        duration: parseFloat(wrapper.dataset.duration) || 3.0,
        scrollCount: parseInt(wrapper.dataset.scrollCount) || 1,
        loop: wrapper.dataset.loop !== 'false',
        aspectRatio: wrapper.dataset.aspectRatio || "512 / 763",
        maxWidth: wrapper.dataset.maxWidth || null,
        imgFit: wrapper.dataset.fit || "cover",
        bgColor: wrapper.dataset.bg || "#eee"
    };

    // --- 2. 要素の取得 ---
    const container = wrapper.querySelector('.slider-container');
    const prevBtn = wrapper.querySelector('.prev');
    const nextBtn = wrapper.querySelector('.next');
    const statusIcon = wrapper.querySelector('.status-icon');

    // スタイルの適用
    if(container) container.style.aspectRatio = config.aspectRatio;
    if(config.maxWidth) wrapper.style.maxWidth = config.maxWidth;
    wrapper.style.setProperty('--img-fit', config.imgFit);
    wrapper.style.setProperty('--bg-color', config.bgColor);

    // --- 3. 内部変数の初期化 ---
    let autoSlideTimer;
    let isPlaying = config.autoPlay;

    // --- 4. 関数定義 ---
    const startTimer = () => {
        stopTimer();
        autoSlideTimer = setInterval(() => { slideNext(true); }, config.duration * 1000);
    };

    const stopTimer = () => { clearInterval(autoSlideTimer); };

    // 次へ (既存のまま)
    const slideNext = (isAuto = false) => {
        const slideWidth = container.clientWidth;
        const maxScrollLeft = container.scrollWidth - slideWidth;

        // 右端判定 (+1は誤差許容)
        if (container.scrollLeft + (slideWidth * config.scrollCount) > maxScrollLeft + 1) {
            if (config.loop) {
                // 先頭に戻る
                container.scrollTo({ left: 0, behavior: 'smooth' });
            } else {
                if (isAuto) { stopTimer(); isPlaying = false; showStatus("⏹ End"); }
            }
        } else {
            container.scrollBy({ left: slideWidth * config.scrollCount, behavior: 'smooth' });
        }
    };

    // ★ 前へ (ここを修正しました)
    const slidePrev = () => {
        const slideWidth = container.clientWidth;

        // 左端判定 (現在のスクロール位置がほぼ0の場合)
        if (container.scrollLeft <= 1) {
            if (config.loop) {
                // ループ有効なら、一番右端へスクロール
                container.scrollTo({ 
                    left: container.scrollWidth, 
                    behavior: 'smooth' 
                });
            }
        } else {
            // 通常動作: 左へスクロール
            container.scrollBy({ 
                left: -(slideWidth * config.scrollCount), 
                behavior: 'smooth' 
            });
        }
    };

    // 状態表示
    const showStatus = (text) => {
        if(!statusIcon) return;
        statusIcon.textContent = text;
        statusIcon.style.display = 'block';
        statusIcon.classList.remove('fade-anim');
        void statusIcon.offsetWidth; 
        statusIcon.classList.add('fade-anim');
    };

    // 再生/停止トグル
    const toggleAutoPlay = () => {
        if (isPlaying) { stopTimer(); isPlaying = false; showStatus("⏸ Paused"); }
        else { startTimer(); isPlaying = true; showStatus("▶ Playing"); }
    };

    // --- 5. イベント登録 ---
    if(nextBtn) nextBtn.addEventListener('click', () => { if (isPlaying) { stopTimer(); startTimer(); } slideNext(false); });
    if(prevBtn) prevBtn.addEventListener('click', () => { if (isPlaying) { stopTimer(); startTimer(); } slidePrev(); });
    if(container) container.addEventListener('click', toggleAutoPlay);

    // --- 6. 初回起動 ---
    if (isPlaying) startTimer();
}
