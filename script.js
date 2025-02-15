console.log("JavaScriptが読み込まれました！");

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function (e) {
        e.preventDefault(); // デフォルトのジャンプ動作を止める

        const targetId = this.getAttribute("href").substring(1); // #を除いたIDを取得
        const targetElement = document.getElementById(targetId);
        const headerOffset = 80; // 固定ヘッダーの高さ（適宜調整）

        if (targetElement) {
            const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
            const offsetPosition = elementPosition - headerOffset;

            smoothScrollTo(window.pageYOffset, offsetPosition, 600); // 600msでスクロール
        }
    });
});

function smoothScrollTo(start, end, duration) {
    const startTime = performance.now();

    function scrollStep(currentTime) {
        const elapsedTime = currentTime - startTime;
        const progress = Math.min(elapsedTime / duration, 1);
        const easeInOutQuad = progress < 0.5 
            ? 2 * progress * progress 
            : 1 - Math.pow(-2 * progress + 2, 2) / 2;

        window.scrollTo(0, start + (end - start) * easeInOutQuad);

        if (elapsedTime < duration) {
            requestAnimationFrame(scrollStep);
        }
    }

    requestAnimationFrame(scrollStep);
}

document.addEventListener("DOMContentLoaded", () => {
    const newsList = document.getElementById("news-list");

    if (!newsList) {
        console.error("エラー: 'news-list' が見つかりません");
        return;
    }

    fetch("news/news.json")
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTPエラー! ステータス: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log("取得したJSONデータ:", data); // ここでデータが取れているか確認
            data.forEach(item => {
                const li = document.createElement("li");
                li.textContent = `${item.date} ${item.title}`;
                newsList.appendChild(li);
            });
        })
        .catch(error => console.error("JSONの読み込みに失敗しました:", error));
});



