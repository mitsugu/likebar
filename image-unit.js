document.querySelectorAll('.fullscreen-btn').forEach(button => {
    button.addEventListener('click', (e) => {
        const figure = e.target.closest('figure');
        
        // パラメーターが "true" の場合のみ実行
        if (figure.getAttribute('data-fullscreen') === 'true') {
            const img = figure.querySelector('.target-img');
            if (img.requestFullscreen) {
                img.requestFullscreen();
            } else if (img.webkitRequestFullscreen) {
                img.webkitRequestFullscreen();
            }
        }
    });
});
