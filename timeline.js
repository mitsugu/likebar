document.addEventListener("DOMContentLoaded", () => {
    const items = document.querySelectorAll(".timeline-item");

    // 1. 各カードの設定（速度や距離）を適用
    items.forEach(item => {
        if (item.dataset.duration) item.style.setProperty('--duration', item.dataset.duration);
        if (item.dataset.delay)    item.style.setProperty('--delay', item.dataset.delay);
        if (item.dataset.distance) item.style.setProperty('--distance', item.dataset.distance);
    });

    // 2. スクロール監視
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("is-visible");
                // 一度表示したら監視をやめる（パフォーマンス重視）
                observer.unobserve(entry.target);
            }
        });
    }, { rootMargin: "0px 0px -50px 0px", threshold: 0.1 });

    items.forEach(item => observer.observe(item));
});
