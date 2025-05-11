console.log("JavaScriptが読み込まれました！");

// スムーズスクロールの実装
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

// ページ読み込み後の処理
document.addEventListener("DOMContentLoaded", function () {
    // ニュースリストの取得と表示
    const newsList = document.getElementById("news-list");

    fetch("news/news.json")
        .then(response => response.json())
        .then(data => {
            data.forEach(item => {
                const li = document.createElement("li");
                li.classList.add("news-item");

                const dateSpan = document.createElement("span");
                dateSpan.classList.add("news-date");
                dateSpan.textContent = item.date;

                const titleSpan = document.createElement("span");
                titleSpan.classList.add("news-title");
                titleSpan.textContent = item.title;

                li.appendChild(dateSpan);
                li.appendChild(titleSpan);
                newsList.appendChild(li);
            });
        })
        .catch(error => console.error("JSONの読み込みに失敗しました:", error));

    // ローディング画面の処理
    const loadingScreen = document.querySelector(".loading-screen");
    setTimeout(() => {
        loadingScreen.style.opacity = "0"; // フェードアウト
        setTimeout(() => {
            loadingScreen.style.display = "none"; // 完全に非表示
        }, 750); // フェードアウトアニメーションの時間
    }, 1500); // 最低 1 秒表示

    // モーダル関連の処理
    const modal = document.getElementById("imageModal");
    const modalImage = document.getElementById("modalImage");
    const openBtn = document.getElementById("customImageButton");
    const closeBtn = document.querySelector(".close");
    const imageNumber = document.getElementById("imageNumber");
    let images = [
        "img/syoki/syoki1.png",
        "img/syoki/syoki2.png",
        "img/syoki/syoki3.png"
    ];
    let currentIndex = 0;

    // モーダルを表示（フェードイン）
    openBtn.addEventListener("click", function(event) {
        event.preventDefault();
        modal.style.display = "flex"; // flexで中央寄せ
        modal.style.opacity = "0";
        setTimeout(() => {
            modal.style.opacity = "1"; // フェードインのアニメーション
        }, 10);
        currentIndex = 0; // 最初の画像をセット
        modalImage.src = images[currentIndex];
        setInitialImageNumber();
    });

    // 画像を切り替える関数
    function changeImage(step) {
        currentIndex += step;
        if (currentIndex < 0) {
            currentIndex = images.length - 1; // 最後の画像へ
        } else if (currentIndex >= images.length) {
            currentIndex = 0; // 最初の画像へ
        }
        modalImage.src = images[currentIndex];
        updateImageNumber();
    }

    // 画像番号を更新
    function updateImageNumber() {
        const dots = document.querySelectorAll('#imageNumber span');
        dots.forEach(dot => dot.classList.remove('active'));
        dots[currentIndex].classList.add('active');
    }

    // 画像番号のドットを初期化
    function setInitialImageNumber() {
        const imageNumberContainer = document.getElementById('imageNumber');
        let dotsHTML = '';
        for (let i = 0; i < images.length; i++) {
            dotsHTML += '<span></span>';
        }
        imageNumberContainer.innerHTML = dotsHTML;
        updateImageNumber();
    }

    // モーダルを閉じる（フェードアウト）
    function closeModal() {
        modal.style.opacity = "0";
        setTimeout(() => {
            modal.style.display = "none"; // 非表示
        }, 300); // フェードアウトアニメーションの時間
    }

    // 閉じるボタン
    closeBtn.addEventListener("click", closeModal);

    // モーダル外をクリックしたら閉じる
    window.addEventListener("click", function(event) {
        if (event.target === modal) {
            closeModal();
        }
    });

    // 前へ・次へボタン
    window.changeImage = changeImage;
});
