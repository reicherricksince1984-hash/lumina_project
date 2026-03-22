async function includeHTML() {
    // 読み込みたい要素とファイルのパスを定義
    const elements = {
        '#header-placeholder': '../includes/header.html',
        '#footer-placeholder': '../includes/footer.html'
    };

    for (const [selector, path] of Object.entries(elements)) {
        const target = document.querySelector(selector);
        
        // HTMLの中にそのIDが存在する場合のみ実行
        if (target) {
            try {
                const response = await fetch(path);
                if (response.ok) {
                    target.innerHTML = await response.text();
                } else {
                    console.error(`Failed to load ${path}: ${response.status}`);
                }
            } catch (error) {
                console.error(`Error loading ${path}:`, error);
            }
        }
    }
}

document.addEventListener('DOMContentLoaded', includeHTML);

document.addEventListener('DOMContentLoaded', () => {
    /* --- 既存のカード表示アニメーション (IntersectionObserver) --- */
    const cards = document.querySelectorAll('.card-content');
    const observerOptions = {
        root: null,
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('show');
                }, index * 150);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    cards.forEach(card => observer.observe(card));


    /* --- ここから：【追加】行の動的追加・削除ロジック --- */
    const tableBody = document.getElementById('answer-table-body');
    const addBtn = document.getElementById('add-row-btn');
    const removeBtn = document.getElementById('remove-row-btn');
    const countDisplay = document.getElementById('row-count-display');

    // IDが存在する場合のみ実行（エラー防止）
    if (tableBody && addBtn && removeBtn) {
        const MAX_ROWS = 5;
        const MIN_ROWS = 1;

        const updateUI = () => {
            const currentRows = tableBody.rows.length;
            if (countDisplay) {
                countDisplay.textContent = `(${currentRows}/${MAX_ROWS})`;
            }
            // 上限・下限でボタンの見た目を変える
            addBtn.style.opacity = currentRows >= MAX_ROWS ? "0.3" : "1";
            addBtn.style.pointerEvents = currentRows >= MAX_ROWS ? "none" : "auto";
            removeBtn.style.opacity = currentRows <= MIN_ROWS ? "0.3" : "1";
            removeBtn.style.pointerEvents = currentRows <= MIN_ROWS ? "none" : "auto";
        };

        addBtn.addEventListener('click', () => {
            if (tableBody.rows.length < MAX_ROWS) {
                const newRow = tableBody.rows[0].cloneNode(true);
                // コピーした行の中身を空にする
                newRow.querySelectorAll('input').forEach(input => input.value = "");
                newRow.querySelectorAll('select').forEach(select => select.selectedIndex = 0);
                
                tableBody.appendChild(newRow);
                updateUI();
            }
        });

        removeBtn.addEventListener('click', () => {
            if (tableBody.rows.length > MIN_ROWS) {
                tableBody.deleteRow(-1);
                updateUI();
            }
        });

        updateUI(); // 初期化
    }
});