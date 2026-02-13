document.addEventListener('DOMContentLoaded', function() {
  // すべてのトグルボタンを取得
  const toggleButtons = document.querySelectorAll('.toggle-button');

  // それぞれのボタンに対してイベントリスナーを設定
  toggleButtons.forEach(button => {
    button.addEventListener('click', function(event) {
      event.preventDefault(); // デフォルトのリンク動作をキャンセル

      // クリックされたボタンのdata-target属性の値を取得
      const targetId = this.dataset.target;

      // ターゲットIDに対応する用語解説コンテナを取得
      const glossaryContainer = document.getElementById(targetId);

      // 表示・非表示を切り替える
      if (glossaryContainer) { // 要素が存在することを確認
        if (glossaryContainer.style.display === 'none') {
          glossaryContainer.style.display = 'block'; // または 'flex', 'grid' など
        } else {
          glossaryContainer.style.display = 'none';
        }
      }
    });
  });
});
