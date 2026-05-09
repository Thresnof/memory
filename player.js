const loginScreen = document.getElementById('login-screen');
const waitingScreen = document.getElementById('waiting-screen');
const gameScreen = document.getElementById('game-screen');
const endScreen = document.getElementById('end-screen');
const playerNameInput = document.getElementById('player-name-input');
const sessionCodeInput = document.getElementById('session-code-input');
const joinBtn = document.getElementById('join-btn');
const loginError = document.getElementById('login-error');
const playerHeaderTitle = document.getElementById('player-header-title');
const playerInfo = document.getElementById('player-info');
const displayName = document.getElementById('display-name');
const displayScore = document.getElementById('display-score');
const finalScoreDisplay = document.getElementById('final-score');
const memoryGrid = document.getElementById('memory-grid');
const timeDisplay = document.getElementById('time-display');
const hintBtn = document.getElementById('hint-btn');
const socket = io(); 
let sessionCode = '';
let score = 0;
let myName = '';
let cards = [];
let flippedCards = [];
let matchedPairs = 0;
let totalPairs = 0;
let correctlyMatchedPairs = [];
let gameTimer;
let secondsElapsed = 0;
let isLocked = false;
const urlParams = new URLSearchParams(window.location.search);
const codeFromUrl = urlParams.get('code');
if (codeFromUrl) {
    sessionCodeInput.value = codeFromUrl;
}
const badWords = ['kurwa', 'jeb', 'pierdol', 'chuj', 'pizda', 'dupa', 'szmata', 'dziwka', 'suka', 'fuck', 'shit', 'bitch', 'cwel', 'debil', 'idiot'];
function containsBadWords(text) {
    const lowerText = text.toLowerCase();
    return badWords.some(word => lowerText.includes(word));
}
joinBtn.addEventListener('click', () => {
    myName = playerNameInput.value.trim();
    sessionCode = sessionCodeInput.value.trim().toUpperCase();
    if (!myName) {
        loginError.innerText = "Podaj swoje imię!";
        return;
    }
    if (containsBadWords(myName)) {
        loginError.innerText = "Twoje imię zawiera niedozwolone słowa!";
        return;
    }
    if (!sessionCode) {
        loginError.innerText = "Podaj kod sesji!";
        return;
    }
    loginError.innerText = "Łączenie...";
    joinBtn.disabled = true;
    socket.emit('join_room', { code: sessionCode, name: myName }, (response) => {
        if (response.status === 'ok') {
            showWaitingScreen();
        } else {
            loginError.innerText = response.message || "Błąd dołączania.";
            joinBtn.disabled = false;
        }
    });
});
socket.on('start_game', (data) => {
    startGame(data.board);
});
socket.on('game_ended_by_host', () => {
    endGame();
});
socket.on('host_disconnected', () => {
    alert("Host się rozłączył. Gra zostanie przerwana.");
    window.location.reload();
});
function showWaitingScreen() {
    loginScreen.classList.remove('active');
    waitingScreen.classList.add('active');
    playerHeaderTitle.style.display = 'none';
    playerInfo.style.display = 'flex';
    displayName.innerText = myName;
}
function startGame(boardData) {
    waitingScreen.classList.remove('active');
    gameScreen.classList.add('active');
    cards = boardData;
    totalPairs = cards.length / 2;
    matchedPairs = 0;
    renderBoard();
    if(!gameTimer) {
        secondsElapsed = 0;
        gameTimer = setInterval(() => {
            secondsElapsed++;
            updateTimeDisplay();
            if (secondsElapsed % 60 === 0) {
                hintBtn.classList.remove('hidden');
            }
        }, 1000);
    }
}
function updateTimeDisplay() {
    const m = Math.floor(secondsElapsed / 60);
    const s = secondsElapsed % 60;
    timeDisplay.innerText = `${m}:${s < 10 ? '0' : ''}${s}`;
}
function renderBoard() {
    memoryGrid.innerHTML = '';
    cards.forEach((card, index) => {
        const cardEl = document.createElement('div');
        cardEl.className = 'memory-card';
        cardEl.dataset.index = index;
        cardEl.dataset.pairId = card.pairId;
        cardEl.dataset.type = card.type;
        const isEmoji = card.content.includes('emoji');
        const innerHTML = `
            <div class="card-face card-back"></div>
            <div class="card-face card-front ${isEmoji ? 'has-emoji' : ''}">
                ${card.content}
            </div>
        `;
        cardEl.innerHTML = innerHTML;
        cardEl.addEventListener('click', () => flipCard(cardEl));
        memoryGrid.appendChild(cardEl);
    });
}
function flipCard(cardEl) {
    if (isLocked) return;
    if (cardEl.classList.contains('flipped') || cardEl.classList.contains('matched')) return;
    cardEl.classList.add('flipped');
    flippedCards.push(cardEl);
    if (flippedCards.length === 2) {
        checkMatch();
    }
}
function checkMatch() {
    isLocked = true;
    const [card1, card2] = flippedCards;
    const isMatch = card1.dataset.pairId === card2.dataset.pairId;
    if (isMatch) {
        card1.classList.add('correct-match');
        card2.classList.add('correct-match');
        
        const pairId = card1.dataset.pairId;
        const matchedNameCard = cards.find(c => c.pairId == pairId && c.type === 'name');
        const matchedDescCard = cards.find(c => c.pairId == pairId && c.type === 'desc');
        
        if (matchedNameCard && matchedDescCard && !correctlyMatchedPairs.find(p => p.name === matchedNameCard.content)) {
            correctlyMatchedPairs.push({ name: matchedNameCard.content, desc: matchedDescCard.content });
        }

        setTimeout(() => {
            card1.classList.add('matched');
            card2.classList.add('matched');
            matchedPairs++;
            addPoints(10);
            resetBoard();
            if (matchedPairs === totalPairs) {
                memoryGrid.innerHTML = '<h3 style="grid-column: 1 / -1; text-align: center; color: var(--color-primary);">Ładowanie nowych kart...</h3>';
                socket.emit('board_finished', { code: sessionCode });
            }
        }, 3000); // Czas w milisekundach (3 sekundy) na podgląd poprawnie dopasowanych kart zanim znikną z planszy
    } else {
        card1.classList.add('wrong-match');
        card2.classList.add('wrong-match');
        setTimeout(() => {
            card1.classList.remove('flipped');
            card2.classList.remove('flipped');
            card1.classList.remove('wrong-match');
            card2.classList.remove('wrong-match');
            resetBoard();
        }, 1200); // Czas w milisekundach (1.2 sekundy) na podgląd błędnie dopasowanych kart przed ich ponownym zakryciem
    }
}
function addPoints(pts) {
    score += pts;
    displayScore.innerText = score;
    socket.emit('update_score', { code: sessionCode, score: score });
}
function resetBoard() {
    flippedCards = [];
    isLocked = false;
    document.querySelectorAll('.hint-highlight').forEach(el => {
        el.classList.remove('hint-highlight');
    });
}
function endGame() {
    clearInterval(gameTimer);
    gameScreen.classList.remove('active');
    endScreen.classList.add('active');
    finalScoreDisplay.innerText = score;

    const answersList = document.getElementById('correct-answers-list');
    if (answersList) {
        answersList.innerHTML = '';
        correctlyMatchedPairs.forEach(pair => {
            const box = document.createElement('div');
            box.className = 'matched-pair-box';
            
            const nameDiv = document.createElement('div');
            nameDiv.className = 'matched-item';
            nameDiv.innerText = pair.name;
            
            const descDiv = document.createElement('div');
            descDiv.className = 'matched-item';
            descDiv.innerText = pair.desc;
            
            box.appendChild(nameDiv);
            box.appendChild(descDiv);
            answersList.appendChild(box);
        });
    }
}
hintBtn.addEventListener('click', () => {
    const unmatchedCards = Array.from(document.querySelectorAll('.memory-card:not(.matched)'));
    if (unmatchedCards.length < 2) return;
    const targetPairId = unmatchedCards[0].dataset.pairId;
    const pairElements = unmatchedCards.filter(c => c.dataset.pairId === targetPairId);
    if (pairElements.length === 2) {
        pairElements[0].classList.add('hint-highlight');
        pairElements[1].classList.add('hint-highlight');
    }
    hintBtn.classList.add('hidden');
    addPoints(-5); 
});