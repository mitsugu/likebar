document.addEventListener('DOMContentLoaded', () => {
    const faders = document.querySelectorAll('.image-crossfader');

    faders.forEach(fader => {
        const images = fader.querySelectorAll('img');
        if (images.length === 0) return;

        // パラメータの取得
        const autoPlay = fader.dataset.autoPlay === 'true';
        const duration = parseFloat(fader.dataset.duration || 3.0) * 1000;
        const fadeSpeed = fader.dataset.fadeSpeed || 1.0;
        const aspectRatio = fader.dataset.aspectRatio || '16/9';
        const maxWidth = fader.dataset.maxWidth || '100%';

        // スタイルの適用
        fader.style.aspectRatio = aspectRatio;
        fader.style.maxWidth = maxWidth;

        images.forEach((img, index) => {
            img.style.transitionDuration = `${fadeSpeed}s`;
            if (index === 0) img.classList.add('is-active');
        });

        // アニメーションロジック
        if (autoPlay && images.length > 1) {
            let currentIndex = 0;

            setInterval(() => {
                // 現在の画像を非表示に
                images[currentIndex].classList.remove('is-active');
                
                // 次のインデックスへ
                currentIndex = (currentIndex + 1) % images.length;
                
                // 次の画像を表示
                images[currentIndex].classList.add('is-active');
            }, duration);
        }
    });
});
