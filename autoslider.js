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
        // 幅の設定 (指定がなければデフォルトはnull扱い＝CSSに従う)
        maxWidth: wrapper.dataset.maxWidth || null 
    };

    // --- 2. 要素の取得 ---
    const container = wrapper.querySelector('.slider-container');
    const prevBtn = wrapper.querySelector('.prev');
    const nextBtn = wrapper.querySelector('.next');
    const statusIcon = wrapper.querySelector('.status-icon');

    // ★【追加機能 1】アスペクト比の上書き
    if(container) {
        container.style.aspectRatio = config.aspectRatio;
    }

    // ★【追加機能 2】最大幅(max-width)の上書き
    // wrapper自体にスタイルを適用します
    if(config.maxWidth) {
        wrapper.style.maxWidth = config.maxWidth;
    }

    // --- 3. 内部変数の初期化 ---
    let autoSlideTimer;
    let isPlaying = config.autoPlay;

    // --- 4. 関数定義 ---
    const startTimer = () => {
        stopTimer();
        autoSlideTimer = setInterval(() => {
            slideNext(true);
        }, config.duration * 1000);
    };

    const stopTimer = () => {
        clearInterval(autoSlideTimer);
    };

    const slideNext = (isAuto = false) => {
        const slideWidth = container.clientWidth;
        const maxScrollLeft = container.scrollWidth - slideWidth;

        if (container.scrollLeft + (slideWidth * config.scrollCount) > maxScrollLeft + 1) {
            if (config.loop) {
                container.scrollTo({ left: 0, behavior: 'smooth' });
            } else {
                if (isAuto) {
                    stopTimer();
                    isPlaying = false;
                    showStatus("⏹ End");
                }
            }
        } else {
            container.scrollBy({ 
                left: slideWidth * config.scrollCount, 
                behavior: 'smooth' 
            });
        }
    };

    const slidePrev = () => {
        const slideWidth = container.clientWidth;
        container.scrollBy({ 
            left: -(slideWidth * config.scrollCount), 
            behavior: 'smooth' 
        });
    };

    const showStatus = (text) => {
        if(!statusIcon) return;
        statusIcon.textContent = text;
        statusIcon.style.display = 'block';
        statusIcon.classList.remove('fade-anim');
        void statusIcon.offsetWidth; 
        statusIcon.classList.add('fade-anim');
    };

    const toggleAutoPlay = () => {
        if (isPlaying) {
            stopTimer();
            isPlaying = false;
            showStatus("⏸ Paused");
        } else {
            startTimer();
            isPlaying = true;
            showStatus("▶ Playing");
        }
    };

    // --- 5. イベント登録 ---
    if(nextBtn) nextBtn.addEventListener('click', () => {
        if (isPlaying) { stopTimer(); startTimer(); }
        slideNext(false);
    });

    if(prevBtn) prevBtn.addEventListener('click', () => {
        if (isPlaying) { stopTimer(); startTimer(); }
        slidePrev();
    });

    if(container) container.addEventListener('click', toggleAutoPlay);

    // --- 6. 初回起動 ---
    if (isPlaying) {
        startTimer();
    }
}
