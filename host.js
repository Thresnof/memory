const generateSessionCode = () => {
    return Math.random().toString(36).substring(2, 7).toUpperCase();
};
const sessionCode = generateSessionCode();
const socket = io(); 
const players = {}; 
const sessionCodeDisplay = document.getElementById('session-code');
const gameLinkDisplay = document.getElementById('game-link');
const copyBtn = document.getElementById('copy-btn');
const playersList = document.getElementById('players-list');
const playerCountDisplay = document.getElementById('player-count');
const startGameBtn = document.getElementById('start-game-btn');
const endGameBtn = document.getElementById('end-game-btn');
const lobbyScreen = document.getElementById('lobby-screen');
const rankingScreen = document.getElementById('ranking-screen');
const rankingList = document.getElementById('ranking-list');
const dbItems = [
    { id: 1, name: 'Internet', desc: 'Globalna sieć połączonych komputerów', img: '<img src="https://loremflickr.com/200/200/internet" alt="Internet">' },
    { id: 2, name: 'Przeglądarka', desc: 'Program do przeglądania stron WWW', img: '<img src="https://loremflickr.com/200/200/browser" alt="Przeglądarka">' },
    { id: 3, name: 'Serwer', desc: 'Komputer udostępniający usługi', img: '<img src="https://loremflickr.com/200/200/server,computer" alt="Serwer">' },
    { id: 4, name: 'Baza Danych', desc: 'Zorganizowany zbiór informacji', img: '<img src="https://loremflickr.com/200/200/database" alt="Baza Danych">' },
    { id: 5, name: 'Kawa', desc: 'Napój dodający energii', img: '<img src="https://loremflickr.com/200/200/coffee" alt="Kawa">' },
    { id: 6, name: 'Pies', desc: 'Najlepszy przyjaciel człowieka', img: '<img src="https://loremflickr.com/200/200/dog" alt="Pies">' },
    { id: 7, name: 'Kot', desc: 'Zwierzę, które lubi spać', img: '<img src="https://loremflickr.com/200/200/cat" alt="Kot">' },
    { id: 8, name: 'Ziemia', desc: 'Trzecia planeta od Słońca', img: '<img src="https://loremflickr.com/200/200/earth" alt="Ziemia">' },
    { id: 9, name: 'Słońce', desc: 'Centralna gwiazda układu', img: '<img src="https://loremflickr.com/200/200/sun" alt="Słońce">' },
    { id: 10, name: 'Księżyc', desc: 'Naturalny satelita Ziemi', img: '<img src="https://loremflickr.com/200/200/moon" alt="Księżyc">' },
    { id: 11, name: 'HTML', desc: 'Szkielet struktury strony', img: '<img src="https://upload.wikimedia.org/wikipedia/commons/6/61/HTML5_logo_and_wordmark.svg" alt="HTML">' },
    { id: 12, name: 'CSS', desc: 'Arkusz stylów strony', img: '<img src="https://upload.wikimedia.org/wikipedia/commons/d/d5/CSS3_logo_and_wordmark.svg" alt="CSS">' },
    { id: 13, name: 'JavaScript', desc: 'Język skryptowy stron', img: '<img src="https://upload.wikimedia.org/wikipedia/commons/9/99/Unofficial_JavaScript_logo_2.svg" alt="JavaScript">' },
    { id: 14, name: 'Python', desc: 'Język z wężem w logo', img: '<img src="https://upload.wikimedia.org/wikipedia/commons/c/c3/Python-logo-notext.svg" alt="Python">' },
    { id: 15, name: 'Zegar', desc: 'Urządzenie do mierzenia czasu', img: '<img src="https://loremflickr.com/200/200/clock" alt="Zegar">' },
    { id: 16, name: 'Telefon', desc: 'Przenośne urządzenie komunikacyjne', img: '<img src="https://loremflickr.com/200/200/smartphone" alt="Telefon">' },
    { id: 17, name: 'Klawiatura', desc: 'Urządzenie z klawiszami', img: '<img src="https://loremflickr.com/200/200/keyboard" alt="Klawiatura">' },
    { id: 18, name: 'Myszka', desc: 'Gryzoń do komputera', img: '<img src="https://loremflickr.com/200/200/computer,mouse" alt="Myszka">' },
    { id: 19, name: 'Książka', desc: 'Zbiór zapisanych stron', img: '<img src="https://loremflickr.com/200/200/book" alt="Książka">' },
    { id: 20, name: 'Drzewo', desc: 'Roślina z pniem', img: '<img src="https://loremflickr.com/200/200/tree" alt="Drzewo">' },
    { id: 21, name: 'Samochód', desc: 'Pojazd na czterech kołach', img: '<img src="https://loremflickr.com/200/200/car" alt="Samochód">' },
    { id: 22, name: 'Samolot', desc: 'Pojazd latający', img: '<img src="https://loremflickr.com/200/200/airplane" alt="Samolot">' },
    { id: 23, name: 'Rower', desc: 'Pojazd dwukołowy', img: '<img src="https://loremflickr.com/200/200/bicycle" alt="Rower">' },
    { id: 24, name: 'Pociąg', desc: 'Pojazd poruszający się po torach', img: '<img src="https://loremflickr.com/200/200/train" alt="Pociąg">' },
    { id: 25, name: 'Git', desc: 'System kontroli wersji', img: '<img src="https://upload.wikimedia.org/wikipedia/commons/e/e0/Git-logo.svg" alt="Git">' },
    { id: 26, name: 'Kalkulator', desc: 'Liczydło elektroniczne', img: '<img src="https://loremflickr.com/200/200/calculator" alt="Kalkulator">' },
    { id: 27, name: 'Góry', desc: 'Wysokie formacje skalne', img: '<img src="https://loremflickr.com/200/200/mountains" alt="Góry">' },
    { id: 28, name: 'Plaża', desc: 'Piaszczysty brzeg', img: '<img src="https://loremflickr.com/200/200/beach" alt="Plaża">' },
    { id: 29, name: 'Szpital', desc: 'Miejsce leczenia chorych', img: '<img src="https://loremflickr.com/200/200/hospital" alt="Szpital">' },
    { id: 30, name: 'Szkoła', desc: 'Miejsce edukacji', img: '<img src="https://loremflickr.com/200/200/school" alt="Szkoła">' },
    { id: 31, name: 'Chmura', desc: 'Skupisko kropelek wody', img: '<img src="https://loremflickr.com/200/200/cloud" alt="Chmura">' },
    { id: 32, name: 'Deszcz', desc: 'Opady wody z nieba', img: '<img src="https://loremflickr.com/200/200/rain" alt="Deszcz">' },
    { id: 33, name: 'Śnieg', desc: 'Zamarznięte płatki wody', img: '<img src="https://loremflickr.com/200/200/snow" alt="Śnieg">' },
    { id: 34, name: 'Gitara', desc: 'Instrument strunowy', img: '<img src="https://loremflickr.com/200/200/guitar" alt="Gitara">' },
    { id: 35, name: 'Pianino', desc: 'Instrument klawiszowy', img: '<img src="https://loremflickr.com/200/200/piano" alt="Pianino">' }
];
function initHost() {
    sessionCodeDisplay.innerText = sessionCode;
    const currentUrl = window.location.href.replace('index.html', '').replace(/\/$/, '');
    const fullLink = `${currentUrl}/player.html?code=${sessionCode}`;
    gameLinkDisplay.innerText = fullLink;
    copyBtn.onclick = () => {
        navigator.clipboard.writeText(fullLink);
        copyBtn.innerText = 'Skopiowano!';
        setTimeout(() => { copyBtn.innerText = 'Kopiuj'; }, 2000);
    };
    socket.on('connect', () => {
        socket.emit('create_room', { code: sessionCode });
    });
    socket.on('player_joined', (data) => {
        players[data.playerId] = { name: data.name, score: 0, finished: false };
        updateLobbyUI();
    });
    socket.on('player_score', (data) => {
        if (players[data.playerId]) {
            players[data.playerId].score = data.score;
            updateRankingUI();
        }
    });
    socket.on('player_finished_board', (data) => {
        const newBoard = generateBoard(8); 
        socket.emit('send_board', { code: sessionCode, targetPlayerId: data.playerId, board: newBoard });
    });
    socket.on('player_left', (data) => {
        delete players[data.playerId];
        updateLobbyUI();
        updateRankingUI();
    });
}
function updateLobbyUI() {
    playersList.innerHTML = '';
    const playerKeys = Object.keys(players);
    playerCountDisplay.innerText = playerKeys.length;
    startGameBtn.disabled = playerKeys.length === 0;
    playerKeys.forEach(id => {
        const li = document.createElement('li');
        li.className = 'player-item';
        li.innerText = players[id].name;
        playersList.appendChild(li);
    });
}
function generateBoard(numPairs) {
    const shuffledItems = [...dbItems].sort(() => 0.5 - Math.random()).slice(0, numPairs);
    let selectedCards = [];
    shuffledItems.forEach(item => {
        selectedCards.push({ pairId: item.id, type: 'name', content: item.name });
        const useDesc = Math.random() > 0.5;
        if (useDesc) {
            selectedCards.push({ pairId: item.id, type: 'desc', content: item.desc });
        } else {
            selectedCards.push({ pairId: item.id, type: 'img', content: item.img });
        }
    });
    return selectedCards.sort(() => 0.5 - Math.random());
}
startGameBtn.addEventListener('click', () => {
    lobbyScreen.classList.remove('active');
    rankingScreen.classList.add('active');
    Object.keys(players).forEach(playerId => {
        const board = generateBoard(8);
        socket.emit('send_board', { code: sessionCode, targetPlayerId: playerId, board: board });
    });
    updateRankingUI();
});
endGameBtn.addEventListener('click', () => {
    if(confirm("Czy na pewno chcesz zakończyć grę dla wszystkich?")) {
        socket.emit('end_game_for_all', { code: sessionCode });
        endGameBtn.disabled = true;
        endGameBtn.innerText = "Zakończono!";
        Object.values(players).forEach(p => p.finished = true);
        updateRankingUI();
    }
});
function updateRankingUI() {
    rankingList.innerHTML = '';
    const sortedPlayers = Object.values(players).sort((a, b) => b.score - a.score);
    sortedPlayers.forEach((player, index) => {
        const li = document.createElement('li');
        li.className = `player-item ${index === 0 && player.score > 0 ? 'leader' : ''}`;
        const nameSpan = document.createElement('span');
        nameSpan.innerText = `${index + 1}. ${player.name}`;
        if(player.finished) nameSpan.innerText += ' (Koniec)';
        const scoreSpan = document.createElement('span');
        scoreSpan.className = 'score';
        scoreSpan.innerText = `${player.score} pkt`;
        li.appendChild(nameSpan);
        li.appendChild(scoreSpan);
        rankingList.appendChild(li);
    });
}
initHost();