document.addEventListener('DOMContentLoaded', function() {
    // すべてのdt要素を取得
    const dtElements = document.querySelectorAll('.loglist dt');

    dtElements.forEach(dt => {
        dt.addEventListener('click', function() {
            // クリックされたdt要素の次の兄弟要素（dd）を取得
            const ddElement = this.nextElementSibling;

            if (ddElement && ddElement.tagName === 'DD') {
                // dd要素のdisplayスタイルを切り替える
                if (ddElement.style.display === 'block') {
                    ddElement.style.display = 'none';
                    ddElement.classList.remove('active'); // activeクラスも削除
                } else {
                    ddElement.style.display = 'block';
                    ddElement.classList.add('active'); // activeクラスを追加
                }
            }
        });
    });
	const elementsToRemove = document.querySelectorAll('.remove');
	elementsToRemove.forEach(element => {
		element.remove();
	});
});
