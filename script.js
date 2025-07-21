// 1. HTMLの要素を取得する
const timeInput = document.getElementById('time-input');
const startButton = document.getElementById('start-button');
const stopButton = document.getElementById('stop-button');
const ticksContainer = document.getElementById('ticks-container');
const timeDisplay = document.getElementById('time-display');
const presetAdButton = document.getElementById('preset-ad');
const presetWaitButton = document.getElementById('preset-wait');
const presetCheckButton = document.getElementById('preset-check');
const presetReceiveButton = document.getElementById('preset-receive'); 
const alarmSound = document.getElementById('alarm-sound');

// 2. 変数を定義する
let countdown;
let remainingTime;
let isTimerRunning = false;
let totalTicks = 50; // 目盛りの総数だよ

// 3. 関数を定義する

// ★★★ 不足していた関数を追加 ★★★
// 目盛りを生成する関数
function createTicks() {
    ticksContainer.innerHTML = '';
    for (let i = 0; i < totalTicks; i++) {
        const tick = document.createElement('div');
        tick.className = 'tick';
        ticksContainer.appendChild(tick);
    }
}

// 秒を「分:秒」形式に変換する関数
function formatTime(totalSeconds) {
    if (totalSeconds < 0) totalSeconds = 0; // マイナス秒を表示しないようにする
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}分${String(seconds).padStart(2, '0')}秒`;
}
// ★★★ 追加ここまで ★★★

// 表示更新の処理を一つの関数にまとめる
function updateDisplay(totalSeconds) {
    timeDisplay.textContent = formatTime(remainingTime);
    const ticks = ticksContainer.children;
    const hiddenTicks = Math.floor((totalSeconds - remainingTime) / totalSeconds * totalTicks);
    for (let i = 0; i < ticks.length; i++) {
        if (i < hiddenTicks) {
            ticks[i].classList.add('hidden');
        } else {
            ticks[i].classList.remove('hidden');
        }
    }
}

// タイマーのメインロジック
function startTimer() {
    if (isTimerRunning) return;
    isTimerRunning = true;
    
    // totalSecondsForTicksは、常にtimeInputの最新の値を使う
    const totalSecondsForTicks = parseInt(timeInput.value);

    countdown = setInterval(() => {
        updateDisplay(totalSecondsForTicks);
        
        if (remainingTime <= 0) {
            clearInterval(countdown);
            isTimerRunning = false;
            remainingTime = undefined;
            alarmSound.play();
            alert('タイマー終了！');
        } else {
            remainingTime--;
        }
    }, 1000);
}

// 4. イベントリスナーを設定する

// スタート・再開ボタン
startButton.addEventListener('click', () => {
    if (isTimerRunning) return;
    if (remainingTime === undefined || remainingTime < 0) {
        const totalSeconds = parseInt(timeInput.value);
        if (isNaN(totalSeconds) || totalSeconds <= 0) {
            alert('有効な秒数を入力してください。');
            return;
        }
        remainingTime = totalSeconds;
        createTicks();
    }
    startTimer();
});

// 一時停止ボタン
stopButton.addEventListener('click', () => {
    clearInterval(countdown);
    isTimerRunning = false;
});

// プリセットボタン
function setAndStartTimer(seconds) {
    clearInterval(countdown);
    isTimerRunning = false;
    remainingTime = seconds;
    timeInput.value = remainingTime;
    createTicks();
    timeDisplay.textContent = formatTime(remainingTime);
    startTimer();
}

presetAdButton.addEventListener('click', () => setAndStartTimer(15));
presetWaitButton.addEventListener('click', () => setAndStartTimer(300));
presetCheckButton.addEventListener('click', () => setAndStartTimer(180));
presetReceiveButton.addEventListener('click', () => setAndStartTimer(1200));

// 5. 初期化処理
// ページ読み込み時に一度だけ目盛りを生成
createTicks();