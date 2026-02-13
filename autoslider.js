document.addEventListener('DOMContentLoaded', () => {
    // ページ内のすべての .slider-wrapper を取得して初期化
    const sliders = document.querySelectorAll('.slider-wrapper');
    sliders.forEach(wrapper => {
        initSlider(wrapper);
    });
});

function initSlider(wrapper) {
    // --- 1. 設定値の読み込み (HTMLのdata属性から) ---
    const config = {
        autoPlay: wrapper.dataset.autoPlay === 'true',
        duration: parseFloat(wrapper.dataset.duration) || 3.0,
        scrollCount: parseInt(wrapper.dataset.scrollCount) || 1,
        loop: wrapper.dataset.loop !== 'false', // デフォルトtrue
        aspectRatio: wrapper.dataset.aspectRatio || "512 / 763",
        maxWidth: wrapper.dataset.maxWidth || null,
        imgFit: wrapper.dataset.fit || "cover", // cover or contain
        bgColor: wrapper.dataset.bg || "#eee"
    };

    // --- 2. 要素の取得 ---
    const container = wrapper.querySelector('.slider-container');
    const prevBtn = wrapper.querySelector('.prev');
    const nextBtn = wrapper.querySelector('.next');
    const statusIcon = wrapper.querySelector('.status-icon');
    
    // フルスクリーン用ボタン
    const fsBtn = wrapper.querySelector('.fs-btn');
    const closeBtn = wrapper.querySelector('.close-btn');

    // --- 3. スタイルの適用 ---
    if (container) container.style.aspectRatio = config.aspectRatio;
    if (config.maxWidth) wrapper.style.maxWidth = config.maxWidth;
    
    // CSS変数をセット
    wrapper.style.setProperty('--img-fit', config.imgFit);
    wrapper.style.setProperty('--bg-color', config.bgColor);

    // --- 4. 状態管理変数 ---
    let currentIndex = 0;   // 今何枚目か（0始まり）
    let autoSlideTimer;
    let isPlaying = config.autoPlay;

    // --- 5. 補助関数 ---

    // 全体の枚数を取得
    const getTotalSlides = () => {
        return container.querySelectorAll('.slide-item').length;
    };

    // 指定したインデックスへスクロール移動
    const scrollToIndex = (index, instant = false) => {
        const slideWidth = container.clientWidth;
        // 幅が0（非表示状態など）のときは処理しない
        if (slideWidth === 0) return;

        container.scrollTo({
            left: index * slideWidth,
            behavior: instant ? 'auto' : 'smooth'
        });
    };

    // --- 6. 現在位置の同期（スワイプ対応） ---
    // ユーザーが手動でスクロールした場合、currentIndex を更新する
    let isScrollingTimeout;
    container.addEventListener('scroll', () => {
        clearTimeout(isScrollingTimeout);
        // スクロール完了50ms後に位置判定
        isScrollingTimeout = setTimeout(() => {
            const slideWidth = container.clientWidth;
            if (slideWidth > 0) {
                const newIndex = Math.round(container.scrollLeft / slideWidth);
                if (currentIndex !== newIndex) {
                    currentIndex = newIndex;
                }
            }
        }, 50);
    });

    // --- 7. スライド操作ロジック ---

    // 次へ
    const slideNext = (isAuto = false) => {
        const totalSlides = getTotalSlides();
        const maxIndex = totalSlides - 1;

        let nextIndex = currentIndex + config.scrollCount;

        // 最後を超えた場合
        if (nextIndex > maxIndex) {
            if (config.loop) {
                nextIndex = 0; // 先頭へ
            } else {
                // ループなしなら停止
                if (isAuto) { stopTimer(); isPlaying = false; showStatus("⏹ End"); }
                return;
            }
        }
        
        currentIndex = nextIndex;
        scrollToIndex(currentIndex);
    };

    // 前へ (確実に末尾へ戻るロジック)
    const slidePrev = () => {
        const totalSlides = getTotalSlides();
        const maxIndex = totalSlides - 1;

        let prevIndex = currentIndex - config.scrollCount;

        // 0より小さくなった場合（＝先頭より前）
        if (prevIndex < 0) {
            if (config.loop) {
                prevIndex = maxIndex; // 最後の画像へ
            } else {
                prevIndex = 0; // 先頭で止める
            }
        }

        currentIndex = prevIndex;
        scrollToIndex(currentIndex);
    };

    // --- 8. タイマー・状態表示制御 ---

    const startTimer = () => {
        stopTimer();
        autoSlideTimer = setInterval(() => { slideNext(true); }, config.duration * 1000);
    };

    const stopTimer = () => { clearInterval(autoSlideTimer); };

    const showStatus = (text) => {
        if(!statusIcon) return;
        statusIcon.textContent = text;
        statusIcon.style.display = 'block';
        // アニメーション再発火のハック
        statusIcon.classList.remove('fade-anim');
        void statusIcon.offsetWidth; 
        statusIcon.classList.add('fade-anim');
    };

    const toggleAutoPlay = (e) => {
        // ボタンクリック時は反応させない
        if (e.target.tagName === 'BUTTON') return;

        if (isPlaying) { stopTimer(); isPlaying = false; showStatus("⏸ Paused"); }
        else { startTimer(); isPlaying = true; showStatus("▶ Playing"); }
    };

    // --- 9. フルスクリーン機能 ---

    // フルスクリーン切り替え
    const toggleFullscreen = () => {
        // すでにAPI全画面なら解除
        if (document.fullscreenElement) {
            document.exitFullscreen().catch(err => console.log(err));
            return;
        }

        // ブラウザの標準機能(API)が使えるか？
        if (wrapper.requestFullscreen) {
            wrapper.requestFullscreen().then(() => {
                // サイズが変わるので位置合わせ
                setTimeout(() => scrollToIndex(currentIndex, true), 100);
            }).catch(() => {
                // エラーならCSSモードへ
                enterCssFullscreen();
            });
        } else {
            // iPhoneなどはCSSモードへ
            enterCssFullscreen();
        }
    };

    // CSS擬似フルスクリーン開始
    const enterCssFullscreen = () => {
        wrapper.classList.add('ios-fullscreen');
        document.body.style.overflow = 'hidden'; // 背景固定
        // サイズ変更に合わせて位置修正
        setTimeout(() => scrollToIndex(currentIndex, true), 100);
    };

    // CSS擬似フルスクリーン解除
    const exitCssFullscreen = () => {
        wrapper.classList.remove('ios-fullscreen');
        document.body.style.overflow = '';
        setTimeout(() => scrollToIndex(currentIndex, true), 100);
    };

    // ブラウザのフルスクリーン状態変化検知（ESCキー対応）
    document.addEventListener('fullscreenchange', () => {
        if (!document.fullscreenElement) {
            // 戻ってきたときに位置合わせ
            setTimeout(() => scrollToIndex(currentIndex, true), 100);
        }
    });


    // --- 10. イベントリスナー登録 ---

    if(nextBtn) nextBtn.addEventListener('click', () => { 
        if (isPlaying) { stopTimer(); startTimer(); } 
        slideNext(false); 
    });

    if(prevBtn) prevBtn.addEventListener('click', () => { 
        if (isPlaying) { stopTimer(); startTimer(); } 
        slidePrev(); 
    });

    // 拡大ボタン
    if(fsBtn) fsBtn.addEventListener('click', toggleFullscreen);

    // 閉じるボタン（スマホ/CSSモード用）
    if(closeBtn) closeBtn.addEventListener('click', () => {
        if (document.fullscreenElement) {
            document.exitFullscreen();
        } else {
            exitCssFullscreen();
        }
    });

    // 画像クリックで一時停止/再開
    if(container) container.addEventListener('click', toggleAutoPlay);

    // --- 11. 初回起動 ---
    if (isPlaying) startTimer();
}
