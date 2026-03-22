const HANDS = ['gu', 'choki', 'pa'];
const EMOJIS = {
    'gu': '✊',
    'choki': '✌️',
    'pa': '✋',
    'question': '❓'
};

let stats = {
    win: 0,
    lose: 0,
    draw: 0
};

// LocalStorage から成績を読み込む
function loadStats() {
    const saved = localStorage.getItem('jankenStatsPremium');
    if (saved) {
        stats = JSON.parse(saved);
        updateStatsDisplay();
    }
}

// LocalStorage に成績を保存
function saveStats() {
    localStorage.setItem('jankenStatsPremium', JSON.stringify(stats));
}

// 画面の成績表示を更新
function updateStatsDisplay() {
    document.getElementById('win-count').innerText = stats.win;
    document.getElementById('lose-count').innerText = stats.lose;
    document.getElementById('draw-count').innerText = stats.draw;
}

// COMのランダムな手を取得
function getComHand() {
    const index = Math.floor(Math.random() * HANDS.length);
    return HANDS[index];
}

// 勝敗判定: 1(勝ち), -1(負け), 0(あいこ)
function judge(player, com) {
    if (player === com) return 0;
    
    if (
        (player === 'gu' && com === 'choki') ||
        (player === 'choki' && com === 'pa') ||
        (player === 'pa' && com === 'gu')
    ) {
        return 1;
    }
    
    return -1;
}

// じゃんけんのターン処理
function playTurn(playerHand) {
    const cpuDisplay = document.getElementById('cpu-hand');
    const resultText = document.getElementById('result-text');
    const allBtns = document.querySelectorAll('.hand-btn');
    
    // ボタンの連打防止
    allBtns.forEach(btn => btn.disabled = true);
    
    // UIのリセット
    resultText.className = '';
    resultText.innerText = 'じゃん、けん...';
    resultText.classList.add('show');
    
    // 考えるアニメーション（ルーレット表示）
    let shuffleCount = 0;
    const shuffleInterval = setInterval(() => {
        cpuDisplay.innerText = EMOJIS[HANDS[shuffleCount % 3]];
        shuffleCount++;
    }, 100);

    // COMエリアを震わせる
    cpuDisplay.classList.add('shake');

    // 1.5秒後に結果を表示
    setTimeout(() => {
        clearInterval(shuffleInterval);
        cpuDisplay.classList.remove('shake');
        
        // COMの手を決定して表示
        const comHand = getComHand();
        cpuDisplay.innerText = EMOJIS[comHand];
        
        // 勝敗決定
        const result = judge(playerHand, comHand);
        
        // 結果とアニメーションの反映
        // 文字を一回消してアニメーションをトリガーし直すテクニック
        resultText.classList.remove('show');
        
        setTimeout(() => {
            if (result === 1) {
                resultText.innerText = 'あなたの勝ち！ 🎉';
                resultText.className = 'win show';
                stats.win++;
            } else if (result === -1) {
                resultText.innerText = 'あなたの負け！ 😢';
                resultText.className = 'lose show';
                stats.lose++;
            } else {
                resultText.innerText = 'あいこ！ 🔄';
                resultText.className = 'draw show';
                stats.draw++;
            }
            
            // 成績更新と保存
            updateStatsDisplay();
            saveStats();
            
            // 少し経ってからボタンを再び押せるようにする
            setTimeout(() => {
                allBtns.forEach(btn => btn.disabled = false);
            }, 600);
            
        }, 50);

    }, 1500);
}

// 成績リセット処理
function resetStats() {
    if(confirm('成績をリセットしますか？')) {
        stats = { win: 0, lose: 0, draw: 0 };
        updateStatsDisplay();
        saveStats();
        
        const resultText = document.getElementById('result-text');
        resultText.className = '';
        resultText.classList.remove('show');
        resultText.innerText = '準備完了';
        
        setTimeout(() => {
            resultText.classList.add('show');
        }, 50);

        document.getElementById('cpu-hand').innerText = EMOJIS['question'];
    }
}

// 起動時の初期化処理
window.addEventListener('DOMContentLoaded', () => {
    loadStats();
});
