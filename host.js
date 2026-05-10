// --- YOUTUBE MUSIC LOGIC ---
let ytPlayer;
let isYtReady = false;
let fadeInterval;
let isGameEnded = false;

const volumeSlider = document.getElementById('volume-slider');
const volumeIcon = document.getElementById('volume-icon');

function updateVolumeIcon(vol) {
    if (vol === 0) volumeIcon.innerText = '🔇';
    else if (vol < 50) volumeIcon.innerText = '🔉';
    else volumeIcon.innerText = '🔊';
}

window.onYouTubeIframeAPIReady = function () {
    ytPlayer = new YT.Player('yt-player-container', {
        height: '10',
        width: '10',
        videoId: 'jfKfPfyJRdk',
        playerVars: {
            'autoplay': 0,
            'loop': 1,
            'playlist': 'jfKfPfyJRdk',
            'controls': 0
        },
        events: {
            'onReady': () => { isYtReady = true; ytPlayer.setVolume(0); }
        }
    });
};

function fadeMusicIn() {
    if (!isYtReady || !ytPlayer) return;
    clearInterval(fadeInterval);
    ytPlayer.setVolume(0);
    ytPlayer.playVideo();
    let vol = 0;
    const targetVol = parseInt(volumeSlider.value);
    if (targetVol === 0) {
        ytPlayer.setVolume(0);
        return;
    }
    fadeInterval = setInterval(() => {
        vol += 2;
        if (vol >= targetVol) {
            ytPlayer.setVolume(targetVol);
            clearInterval(fadeInterval);
        } else {
            ytPlayer.setVolume(vol);
        }
    }, 100);
}

function fadeMusicOut() {
    if (!isYtReady || !ytPlayer) return;
    clearInterval(fadeInterval);
    let vol = ytPlayer.getVolume();
    if (vol === null || vol === undefined) vol = parseInt(volumeSlider.value);
    fadeInterval = setInterval(() => {
        vol -= 2;
        if (vol <= 0) {
            ytPlayer.setVolume(0);
            ytPlayer.pauseVideo();
            clearInterval(fadeInterval);
        } else {
            ytPlayer.setVolume(vol);
        }
    }, 100);
}

const generateSessionCode = () => {
    return Math.random().toString(36).substring(2, 7).toUpperCase();
};
const sessionCode = generateSessionCode();
const socket = io();
const players = {};
const sessionCodeDisplay = document.getElementById('session-code');
const gameLinkDisplay = document.getElementById('game-link');

volumeSlider.addEventListener('input', (e) => {
    const vol = parseInt(e.target.value);
    if (isYtReady && ytPlayer && ytPlayer.setVolume) {
        ytPlayer.setVolume(vol);
    }
    updateVolumeIcon(vol);
    clearInterval(fadeInterval);
});
const copyBtn = document.getElementById('copy-btn');
const playersList = document.getElementById('players-list');
const playerCountDisplay = document.getElementById('player-count');
const startGameBtn = document.getElementById('start-game-btn');
const endGameBtn = document.getElementById('end-game-btn');
const lobbyScreen = document.getElementById('lobby-screen');
const rankingScreen = document.getElementById('ranking-screen');
const rankingList = document.getElementById('ranking-list');
const dbItems = [
    { id: 1, name: 'Abstract Data Type', desc: 'Struktura danych ukrywająca szczegóły implementacji.', img: 'https://media.geeksforgeeks.org/wp-content/uploads/20260123110644215426/application_program-1.webp' },
    { id: 2, name: 'Abstraction', desc: 'Ogólny plan pomijający detale.', img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/Data_abstraction_levels.png/250px-Data_abstraction_levels.png' },
    { id: 3, name: 'Adaptive Maintenance', desc: 'Aktualizacja do nowego środowiska (np. nowy OS).', img: 'https://limeup.io/wp-content/uploads/2024/01/Adaptive-Maintenance-Definition.png' },
    { id: 4, name: 'Anticomposition Property', desc: 'Jeśli kryterium jest nieadekwatne dla każdej części osobno, jest też nieadekwatne dla całości.', img: '' },
    { id: 5, name: 'Antidecomposition Property', desc: 'Kryterium adekwatne dla całego programu nie musi być adekwatne dla każdej jego części osobno.', img: '' },
    { id: 6, name: 'Antiextensionality Property', desc: 'Podobne programy wymagają osobnych testów.', img: '' },
    { id: 7, name: 'Applicability Property', desc: 'Każdy program wymaga własnego zestawu testów.', img: '' },
    { id: 8, name: 'Application Framework', desc: 'Częściowo gotowy szablon dla aplikacji.', img: '' },
    { id: 9, name: 'Black-Box Testing', desc: 'Testowanie funkcjonalności bez patrzenia w kod.', img: '' },
    { id: 10, name: 'Booch Method', desc: 'Metoda projektowania przy użyciu obiektów.', img: '' },
    { id: 11, name: 'Bottom-Up Design', desc: 'Projektowanie od najprostszych do złożonych funkcji.', img: '' },
    { id: 12, name: 'Call Graph', desc: 'Diagram wywołań funkcji w programie.', img: '' },
    { id: 13, name: 'Class', desc: 'Grupa obiektów o tych samych cechach.', img: '' },
    { id: 14, name: 'Class Diagram', desc: 'Wizualna mapa powiązań między klasami.', img: '' },
    { id: 15, name: 'Cohesion', desc: 'Miara współpracy elementów w module.', img: '' },
    { id: 16, name: 'Collaboration Diagram', desc: 'Graf interakcji obiektów podczas zdarzenia.', img: '' },
    { id: 17, name: 'Complexity', desc: 'Miara trudności budowy lub zmiany systemu.', img: '' },
    { id: 18, name: 'Complexity Property', desc: 'Złożone programy to złożone zestawy testów.', img: '' },
    { id: 19, name: 'Component', desc: 'Wielorazowy element przetwarzający dane.', img: '' },
    { id: 20, name: 'Conceptual View', desc: 'Opis głównych elementów systemu i połączeń.', img: '' },
    { id: 21, name: 'Connector', desc: 'Element kontrolujący połączenia komponentu.', img: '' },
    { id: 22, name: 'Control Structure', desc: 'Komponent kontrolujący kolejność kodu.', img: '' },
    { id: 23, name: 'Corrective Maintenance', desc: 'Naprawianie błędów po wydaniu programu.', img: '' },
    { id: 24, name: 'Coupling', desc: 'Miara powiązań między modułami.', img: '' },
    { id: 25, name: 'Coverage-Based Testing', desc: 'Testowanie mierzone ilością pokrytego kodu.', img: '' },
    { id: 26, name: 'Data Flow Design', desc: 'Plan przepływu danych przez system.', img: '' },
    { id: 27, name: 'Demonstration Model', desc: 'Model testowania pokazujący poprawne działanie systemu w wybranych przypadkach użycia.', img: '' },
    { id: 28, name: 'Deployment View', desc: 'Przypisanie zadań oprogramowania do maszyn.', img: '' },
    { id: 29, name: 'Design Method', desc: 'Kroki używane do budowy systemu.', img: '' },
    { id: 30, name: 'Design Pattern', desc: 'Szablon rozwiązania problemu projektowego.', img: '' },
    { id: 31, name: 'Design Recovery', desc: 'Odtwarzanie programu dla lepszej czytelności.', img: '' },
    { id: 32, name: 'Destruction Model', desc: 'Agresywny model testowania mający na celu wykrycie dowolnych wad w systemie przez jego "zniszczenie".', img: '' },
    { id: 33, name: 'DFD', desc: 'Wizualna mapa trasy danych w systemie.', img: '' },
    { id: 34, name: 'DSSA', desc: 'Reużywalna architektura wzorcowa dla grupy systemów z tej samej dziedziny problemowej.', img: '' },
    { id: 35, name: 'Dynamic Analysis', desc: 'Testowanie przez uruchomienie i sprawdzanie wyników.', img: '' },
    { id: 36, name: 'Error', desc: 'Ludzki błąd powodujący niepoprawne działanie.', img: '' },
    { id: 37, name: 'Error-Based Testing', desc: 'Testowanie typowych ludzkich błędów.', img: '' },
    { id: 38, name: 'Evaluation Model', desc: 'Model testowania oceniający jakość systemu i jego zgodność z wymaganiami.', img: '' },
    { id: 39, name: 'Fagan Inspection', desc: 'Ręczny przegląd kodu w zespole.', img: '' },
    { id: 40, name: 'Failure', desc: 'Błędny wynik widoczny dla użytkownika.', img: '' },
    { id: 41, name: 'Fault', desc: 'Usterka w kodzie powodująca awarię.', img: '' },
    { id: 42, name: 'Fault Detection', desc: 'Proces ujawniania błędów w oprogramowaniu.', img: '' },
    { id: 43, name: 'Fault Prevention', desc: 'Testowanie w czasie tworzenia kodu by unikać błędów.', img: '' },
    { id: 44, name: 'Fault-Based Testing', desc: 'Testowanie skupione na znajdowaniu usterek.', img: '' },
    { id: 45, name: 'Functional Decomposition', desc: 'Dzielenie funkcji na mniejsze podfunkcje.', img: '' },
    { id: 46, name: 'Functional Equivalence', desc: 'Relacja między programami: dwa programy są funkcjonalnie równoważne, jeśli dają te same wyniki dla tych samych danych wejściowych.', img: '' },
    { id: 47, name: 'Functional Hierarchy', desc: 'Organizacja wymagań w specyfikacji.', img: '' },
    { id: 48, name: 'Fusion Method', desc: 'Proces tworzenia od analizy do implementacji.', img: '' },
    { id: 49, name: 'General Multiple Change Property', desc: 'Programy o tej samej strukturze potrzebują różnych testów.', img: '' },
    { id: 50, name: 'Idiom', desc: 'Niskopoziomowy wzorzec dla języka.', img: '' },
    { id: 51, name: 'Implementation Stage', desc: 'Przekształcenie projektu JSD w działający program.', img: '' },
    { id: 52, name: 'Implementation View', desc: 'Opis systemu jako pakietów i modułów.', img: '' },
    { id: 53, name: 'Implicit Invocation', desc: 'Akcje wyzwalane przez zdarzenia, nie użytkownika.', img: '' },
    { id: 54, name: 'Inadequate Empty Set Property', desc: 'Pusty zestaw testów nigdy nie wystarcza.', img: '' },
    { id: 55, name: 'Information Hiding', desc: 'Moduły ukrywają szczegóły przed resztą systemu.', img: '' },
    { id: 56, name: 'Interaction Diagram', desc: 'Graf wiadomości między obiektami.', img: '' },
    { id: 57, name: 'JSD', desc: 'Metoda Jacksona modelująca system na podstawie sekwencji zdarzeń w czasie rzeczywistym, realizowana w 3 fazach.', img: '' },
    { id: 58, name: 'JSP', desc: 'Metoda programowania Jacksona opierająca strukturę programu na strukturze danych wejściowych i wyjściowych.', img: '' },
    { id: 59, name: 'Law of Continuing Change', desc: 'Oprogramowanie w użyciu musi się stale rozwijać.', img: '' },
    { id: 60, name: 'Law of Increasing Complexity', desc: 'Każda zmiana zwiększa złożoność systemu.', img: '' },
    { id: 61, name: 'Legacy System', desc: 'Stary system nadal używany mimo przestarzałości.', img: '' },
    { id: 62, name: 'Main Program With Subroutines', desc: 'Główny moduł wywołujący inne.', img: '' },
    { id: 63, name: 'Modeling Stage', desc: 'Faza JSD opisująca rozwiązywany problem.', img: '' },
    { id: 64, name: 'Modularity', desc: 'Podział systemu na małe, połączone części.', img: '' },
    { id: 65, name: 'Module', desc: 'Powiązane funkcje jako jedna jednostka.', img: '' },
    { id: 66, name: 'Monotonicity Property', desc: 'Zawsze można zrobić więcej testów po zaliczeniu.', img: '' },
    { id: 67, name: 'Network Stage', desc: 'Faza JSD z siecią komunikujących się procesów.', img: '' },
    { id: 68, name: 'Non-Exhausting Applicability Property', desc: 'Test nie zawsze sprawdza wszystkie przypadki.', img: '' },
    { id: 69, name: 'OMT', desc: 'Metoda projektowania Rumbaugha oparta na trzech modelach: obiektowym, dynamicznym i funkcjonalnym.', img: '' },
    { id: 70, name: 'Oracle', desc: 'Narzędzie sprawdzające poprawność wyników.', img: '' },
    { id: 71, name: 'Peer Review', desc: 'Wzajemne sprawdzanie kodu przez inżynierów.', img: '' },
    { id: 72, name: 'Perfective Maintenance', desc: 'Aktualizowanie pod nowe wymagania użytkowników.', img: '' },
    { id: 73, name: 'Pipes and Filters', desc: 'Architektura danych przepływających przez etapy.', img: '' },
    { id: 74, name: 'Prevention Model', desc: 'Model testowania zapobiegający wprowadzaniu defektów do kodu na wszystkich etapach wytwarzania.', img: '' },
    { id: 75, name: 'Preventive Maintenance', desc: 'Ulepszanie struktury dla łatwiejszego utrzymania.', img: '' },
    { id: 76, name: 'Process View', desc: 'Opis zadań systemu i ich interakcji.', img: '' },
    { id: 77, name: 'Programming Plan', desc: 'Szablon typowego działania programistycznego.', img: '' },
    { id: 78, name: 'Proof of Correctness', desc: 'Matematyczny dowód zgodności ze specyfikacją.', img: '' },
    { id: 79, name: 'Redocumentation', desc: 'Poprawa dokumentacji kodu bez zmiany działania.', img: '' },
    { id: 80, name: 'Reengineering', desc: 'Gruntowne zmiany funkcjonalne w systemie.', img: '' },
    { id: 81, name: 'Renaming Property', desc: 'Różne nazwy zmiennych mogą mieć te same testy.', img: '' },
    { id: 82, name: 'Repository', desc: 'Architektura do zarządzania ustrukturyzowanymi danymi.', img: '' },
    { id: 83, name: 'Requirements Engineering', desc: 'Zbieranie i zarządzanie wymaganiami.', img: '' },
    { id: 84, name: 'Restructuring', desc: 'Zmiana wewnętrznej struktury przy tej samej funkcjonalności.', img: '' },
    { id: 85, name: 'Reverse Engineering', desc: 'Analiza istniejącego systemu dla jego abstrakcji.', img: '' },
    { id: 86, name: 'SA', desc: 'Structured Analysis — metoda analizy i modelowania wymagań systemowych, często z użyciem diagramów przepływu danych.', img: '' },
    { id: 87, name: 'Scenario-Based Evaluation', desc: 'Testowanie rzeczywistych scenariuszy użycia.', img: '' },
    { id: 88, name: 'SD', desc: 'Structured Design — metoda projektowania modułowego optymalizująca strukturę systemu przez minimalizację coupling i maksymalizację cohesion.', img: '' },
    { id: 89, name: 'Sequence Diagram', desc: 'Kolejność chronologiczna wiadomości między obiektami.', img: '' },
    { id: 90, name: 'Software Architecture', desc: 'Postrzeganie systemu przez jego główne komponenty.', img: '' },
    { id: 91, name: 'Software Maintenance', desc: 'Modyfikacja w celu naprawy lub optymalizacji.', img: '' },
    { id: 92, name: 'State Diagram', desc: 'Graf zmian stanu obiektu pod wpływem zdarzeń.', img: '' },
    { id: 93, name: 'Statement Coverage Property', desc: 'Każda linia kodu wywołana min. 1 raz w testach.', img: '' },
    { id: 94, name: 'Static Analysis', desc: 'Badanie struktury bez uruchamiania.', img: '' },
    { id: 95, name: 'Stepwise Abstraction', desc: 'Technika rozumienia kodu polegająca na stopniowym abstrahowaniu szczegółów implementacyjnych w celu wnioskowania o zachowaniu programu.', img: '' },
    { id: 96, name: 'Stepwise Refinement', desc: 'Podział problemu na mniejsze części.', img: '' },
    { id: 97, name: 'Structure Chart', desc: 'Schemat funkcji od najprostszych do złożonych.', img: '' },
    { id: 98, name: 'Structure Diagram', desc: 'Diagram złożonych komponentów w systemie.', img: '' },
    { id: 99, name: 'Subfunction', desc: 'Mały komponent tworzący większą funkcję.', img: '' },
    { id: 100, name: 'System Model', desc: 'Opis komponentów i ich połączeń.', img: '' },
    { id: 101, name: 'Test Adequacy Criteria', desc: 'Wymagania mierzące skuteczność testowania.', img: '' },
    { id: 102, name: 'Test Criterion', desc: 'Standard oceny przetestowania programu.', img: '' },
    { id: 103, name: 'Top-Down Design', desc: 'Projektowanie od głównych do mniejszych funkcji.', img: '' },
    { id: 104, name: 'Unstructured Code', desc: 'Źle zorganizowany, nieczytelny kod.', img: '' },
    { id: 105, name: 'User Class', desc: 'Kategoria użytkowników o wspólnych cechach, poziomie dostępu lub zestawie funkcji systemu.', img: '' },
    { id: 106, name: 'Validation', desc: 'Sprawdzanie poprawności i kompletności wymagań.', img: '' },
    { id: 107, name: 'Verification', desc: 'Sprawdzanie czy rozwiązanie pasuje do wymagań.', img: '' },
    { id: 108, name: 'White-Box Testing', desc: 'Testowanie patrzące w wewnętrzną logikę kodu.', img: '' },
    { id: 109, name: 'Wicked Problem', desc: 'Złożony problem bez prostego rozwiązania.', img: '' },
];
function initHost() {
    sessionCodeDisplay.innerText = sessionCode;
    const currentUrl = window.location.href.replace('index.html', '').replace(/\/$/, '');
    const fullLink = `${currentUrl}/player.html?code=${sessionCode}`;
    gameLinkDisplay.innerText = fullLink;

    const qrContainer = document.getElementById('qr-code-container');
    if (qrContainer) {
        qrContainer.innerHTML = `<img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(fullLink)}" alt="QR Code" style="border-radius: 8px; border: 4px solid white;">`;
    }
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
        if (!isGameEnded) {
            delete players[data.playerId];
            updateLobbyUI();
            updateRankingUI();
        } else if (players[data.playerId]) {
            // Gracze nie znikają, jeśli gra się już skończyła
            if (!players[data.playerId].name.includes('(Wyszedł)')) {
                players[data.playerId].name += ' (Wyszedł)';
                updateRankingUI();
            }
        }
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
        selectedCards.push({ pairId: item.id, type: 'desc', content: item.desc });
    });
    return selectedCards.sort(() => 0.5 - Math.random());
}
startGameBtn.addEventListener('click', () => {
    lobbyScreen.classList.remove('active');
    rankingScreen.classList.add('active');
    fadeMusicIn();
    Object.keys(players).forEach(playerId => {
        const board = generateBoard(8);
        socket.emit('send_board', { code: sessionCode, targetPlayerId: playerId, board: board });
    });
    updateRankingUI();
});
endGameBtn.addEventListener('click', () => {
    if (confirm("Czy na pewno chcesz zakończyć grę dla wszystkich?")) {
        isGameEnded = true;
        fadeMusicOut();
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
        if (player.finished) nameSpan.innerText += ' (Koniec)';
        const scoreSpan = document.createElement('span');
        scoreSpan.className = 'score';
        scoreSpan.innerText = `${player.score} pkt`;
        li.appendChild(nameSpan);
        rankingList.appendChild(li);
    });
}
initHost();

// Theme Toggle Logic
const themeToggle = document.getElementById('theme-toggle');
if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        if (document.body.classList.contains('dark-mode')) {
            localStorage.setItem('theme', 'dark');
        } else {
            localStorage.setItem('theme', 'light');
        }
    });
}