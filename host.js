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
    { id: 1, name: 'Abstract Data Type', desc: 'Struktura danych definiująca zachowanie i operacje, ukrywając szczegóły implementacji.', img: 'https://media.geeksforgeeks.org/wp-content/uploads/20260123110644215426/application_program-1.webp' },
    { id: 2, name: 'Abstraction', desc: 'Ogólny plan systemu, który pomija nieistotne szczegóły.', img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/Data_abstraction_levels.png/250px-Data_abstraction_levels.png' },
    { id: 3, name: 'Adaptive Maintenance', desc: 'Aktualizowanie oprogramowania, aby działało w zmienionym środowisku, np. po zmianie systemu operacyjnego.', img: 'https://limeup.io/wp-content/uploads/2024/01/Adaptive-Maintenance-Definition.png' },
    { id: 4, name: 'Anticomposition Property', desc: 'Zasada testowania mówiąca, że komponenty testowane osobno powinny być też testowane razem.', img: '' },
    { id: 5, name: 'Antidecomposition Property', desc: 'Zasada testowania mówiąca, że całość przetestowana razem powinna być też testowana osobno.', img: '' },
    { id: 6, name: 'Antiextensionality Property', desc: 'Zasada mówiąca, że programy o podobnych funkcjach nadal wymagają osobnych testów.', img: '' },
    { id: 7, name: 'Applicability Property', desc: 'Zasada mówiąca, że dla każdego programu musi istnieć odpowiedni zestaw testów.', img: '' },
    { id: 8, name: 'Application Framework', desc: 'Częściowo gotowy system stanowiący szablon do tworzenia podobnych aplikacji.', img: '' },
    { id: 9, name: 'Black-Box Testing', desc: 'Testowanie oprogramowania na podstawie tego, co robi, bez patrzenia na jego kod.', img: '' },
    { id: 10, name: 'Booch Method', desc: 'Metoda modelowania i projektowania oprogramowania przy użyciu obiektów.', img: '' },
    { id: 11, name: 'Bottom-Up Design', desc: 'Projektowanie oprogramowania zaczynające od najprostszych funkcji i stopniowo budujące bardziej złożone.', img: '' },
    { id: 12, name: 'Call Graph', desc: 'Diagram pokazujący, które funkcje wywołują inne funkcje w programie.', img: '' },
    { id: 13, name: 'Class', desc: 'Grupa obiektów posiadających ten sam zestaw cech i danych.', img: '' },
    { id: 14, name: 'Class Diagram', desc: 'Wizualna mapa pokazująca powiązania między klasami w systemie.', img: '' },
    { id: 15, name: 'Cohesion', desc: 'Miara tego, jak dobrze elementy modułu współpracują w jednym celu.', img: '' },
    { id: 16, name: 'Collaboration Diagram', desc: 'Graf pokazujący interakcje między obiektami podczas konkretnego zdarzenia.', img: '' },
    { id: 17, name: 'Complexity', desc: 'Miara czasu i zasobów potrzebnych do zbudowania lub zmiany systemu.', img: '' },
    { id: 18, name: 'Complexity Property', desc: 'Zasada mówiąca, że złożone programy wymagają równie złożonych zestawów testów.', img: '' },
    { id: 19, name: 'Component', desc: 'Wielokrotnego użytku element oprogramowania przechowujący lub przetwarzający dane.', img: '' },
    { id: 20, name: 'Conceptual View', desc: 'Opis systemu skupiający się na jego głównych elementach i ich połączeniach.', img: '' },
    { id: 21, name: 'Connector', desc: 'Element komponentu kontrolujący sposób jego połączenia z innymi komponentami.', img: '' },
    { id: 22, name: 'Control Structure', desc: 'Komponent kontrolujący kolejność wykonywania innych części programu.', img: '' },
    { id: 23, name: 'Corrective Maintenance', desc: 'Naprawianie błędów odkrytych w oprogramowaniu po jego wydaniu.', img: '' },
    { id: 24, name: 'Coupling', desc: 'Miara siły powiązań między modułami w systemie.', img: '' },
    { id: 25, name: 'Coverage-Based Testing', desc: 'Podejście do testowania mierzące jakość przez sprawdzenie, ile kodu zostało przetestowane.', img: '' },
    { id: 26, name: 'Data Flow Design', desc: 'Plan pokazujący, jak dane przemieszczają się przez system.', img: '' },
    { id: 27, name: 'Demonstration Model', desc: 'Rodzaj testu potwierdzający, że oprogramowanie robi to, do czego jest przeznaczone.', img: '' },
    { id: 28, name: 'Deployment View', desc: 'Opis sposobu przypisania zadań oprogramowania do fizycznych maszyn.', img: '' },
    { id: 29, name: 'Design Method', desc: 'Zestaw wytycznych i kroków używanych do planowania i budowy systemu.', img: '' },
    { id: 30, name: 'Design Pattern', desc: 'Gotowy szablon rozwiązania często spotykanych problemów projektowych.', img: '' },
    { id: 31, name: 'Design Recovery', desc: 'Odtwarzanie programu działającego tak samo, ale lepiej zorganizowanego i czytelnego.', img: '' },
    { id: 32, name: 'Destruction Model', desc: 'Rodzaj testu skupiający się na znajdowaniu wad w nowym oprogramowaniu.', img: '' },
    { id: 33, name: 'DFD', desc: 'Diagram przepływu danych — wizualna mapa trasy danych w systemie.', img: '' },
    { id: 34, name: 'DSSA', desc: 'Architektura oprogramowania specyficzna dla danej dziedziny zastosowań.', img: '' },
    { id: 35, name: 'Dynamic Analysis', desc: 'Testowanie oprogramowania przez jego uruchomienie i sprawdzenie wyników.', img: '' },
    { id: 36, name: 'Error', desc: 'Błąd popełniony przez człowieka powodujący niepoprawne działanie oprogramowania.', img: '' },
    { id: 37, name: 'Error-Based Testing', desc: 'Testowanie celujące w typowe błędy popełniane przez ludzi.', img: '' },
    { id: 38, name: 'Evaluation Model', desc: 'Rodzaj testu wykrywający problemy w wymaganiach, projekcie lub implementacji.', img: '' },
    { id: 39, name: 'Fagan Inspection', desc: 'Proces, w którym zespół inżynierów ręcznie przegląda kod w poszukiwaniu błędów.', img: '' },
    { id: 40, name: 'Failure', desc: 'Sytuacja, gdy oprogramowanie produkuje błędny wynik widoczny dla użytkownika.', img: '' },
    { id: 41, name: 'Fault', desc: 'Usterka w kodzie stworzona przez programistę, która może powodować awarię.', img: '' },
    { id: 42, name: 'Fault Detection', desc: 'Proces znajdowania i ujawniania błędów i awarii w oprogramowaniu.', img: '' },
    { id: 43, name: 'Fault Prevention', desc: 'Wielokrotne testowanie w czasie tworzenia, aby zapobiec pojawieniu się błędów.', img: '' },
    { id: 44, name: 'Fault-Based Testing', desc: 'Technika testowania skupiająca się wyłącznie na znajdowaniu usterek w kodzie.', img: '' },
    { id: 45, name: 'Functional Decomposition', desc: 'Podejście projektowe polegające na dzieleniu dużej funkcji na mniejsze podfunkcje.', img: '' },
    { id: 46, name: 'Functional Equivalence', desc: 'Miara podobieństwa dwóch programów pod względem działania, niezależnie od kodu.', img: '' },
    { id: 47, name: 'Functional Hierarchy', desc: 'Nieokreślony system organizowania wymagań w dokumencie specyfikacji.', img: '' },
    { id: 48, name: 'Fusion Method', desc: 'Obiektowy proces tworzenia oprogramowania z fazami analizy, projektowania i implementacji.', img: '' },
    { id: 49, name: 'General Multiple Change Property', desc: 'Zasada mówiąca, że programy o tej samej strukturze nadal wymagają różnych testów.', img: '' },
    { id: 50, name: 'Idiom', desc: 'Niskopoziomowy wzorzec kodu charakterystyczny dla jednego języka programowania.', img: '' },
    { id: 51, name: 'Implementation Stage', desc: 'Faza JSD, w której projekt systemu zostaje przekształcony w działający program.', img: '' },
    { id: 52, name: 'Implementation View', desc: 'Opis systemu oprogramowania w kategoriach pakietów i modułów.', img: '' },
    { id: 53, name: 'Implicit Invocation', desc: 'System, w którym akcje są wyzwalane automatycznie przez zdarzenia, nie przez użytkownika.', img: '' },
    { id: 54, name: 'Inadequate Empty Set Property', desc: 'Zasada mówiąca, że pusty zestaw testów nigdy nie jest wystarczający.', img: '' },
    { id: 55, name: 'Information Hiding', desc: 'Zasada projektowania, w której moduły ukrywają swoje szczegóły przed innymi częściami systemu.', img: '' },
    { id: 56, name: 'Interaction Diagram', desc: 'Graf przedstawiający sekwencję wiadomości przekazywanych między obiektami.', img: '' },
    { id: 57, name: 'JSD', desc: 'Jackson System Development — metoda budowania systemów w trzech fazach.', img: '' },
    { id: 58, name: 'JSP', desc: 'Jackson Structured Programming — metoda programowania oparta na przepływie danych.', img: '' },
    { id: 59, name: 'Law of Continuing Change', desc: 'Zasada mówiąca, że oprogramowanie w użyciu musi się stale rozwijać, inaczej staje się przestarzałe.', img: '' },
    { id: 60, name: 'Law of Increasing Complexity', desc: 'Zasada mówiąca, że każda zmiana w systemie zwiększa jego złożoność.', img: '' },
    { id: 61, name: 'Legacy System', desc: 'Stary system oprogramowania, który nadal jest używany i aktualizowany mimo przestarzałości.', img: '' },
    { id: 62, name: 'Main Program With Subroutines', desc: 'System, w którym główny moduł wywołuje inne moduły w określonej kolejności.', img: '' },
    { id: 63, name: 'Modeling Stage', desc: 'Faza JSD, w której opisywany jest problem, który oprogramowanie ma rozwiązać.', img: '' },
    { id: 64, name: 'Modularity', desc: 'Sposób postrzegania systemu jako serii mniejszych, połączonych ze sobą części.', img: '' },
    { id: 65, name: 'Module', desc: 'Grupa powiązanych funkcji oprogramowania zgrupowanych razem jako jedna jednostka.', img: '' },
    { id: 66, name: 'Monotonicity Property', desc: 'Zasada mówiąca, że zawsze można przeprowadzić więcej testów, nawet po zaliczeniu programu.', img: '' },
    { id: 67, name: 'Network Stage', desc: 'Faza JSD, w której system jest przedstawiony jako sieć komunikujących się procesów.', img: '' },
    { id: 68, name: 'Non-Exhausting Applicability Property', desc: 'Zasada mówiąca, że kryterium testowe nie zawsze wymaga sprawdzenia wszystkich przypadków.', img: '' },
    { id: 69, name: 'OMT', desc: 'Technika modelowania obiektów — obiektowe podejście do projektowania oprogramowania.', img: '' },
    { id: 70, name: 'Oracle', desc: 'Narzędzie lub mechanizm używany do sprawdzenia poprawności wyników oprogramowania.', img: '' },
    { id: 71, name: 'Peer Review', desc: 'Proces, w którym inżynierowie sprawdzają nawzajem swój kod w celu znalezienia błędów.', img: '' },
    { id: 72, name: 'Perfective Maintenance', desc: 'Aktualizowanie oprogramowania, aby spełniało nowe wymagania użytkowników.', img: '' },
    { id: 73, name: 'Pipes and Filters', desc: 'Styl architektury, w którym dane przepływają przez kolejne etapy przetwarzania.', img: '' },
    { id: 74, name: 'Prevention Model', desc: 'Rodzaj testu zapobiegający pojawianiu się błędów w projekcie lub wymaganiach.', img: '' },
    { id: 75, name: 'Preventive Maintenance', desc: 'Ulepszanie struktury systemu, aby był łatwiejszy do utrzymania w przyszłości.', img: '' },
    { id: 76, name: 'Process View', desc: 'Opis systemu w kategoriach zadań, które wykonuje, i ich wzajemnych interakcji.', img: '' },
    { id: 77, name: 'Programming Plan', desc: 'Fragment kodu lub szablon opisujący typowe działanie programistyczne.', img: '' },
    { id: 78, name: 'Proof of Correctness', desc: 'Formalny proces matematycznego dowodzenia, że program spełnia swoją specyfikację.', img: '' },
    { id: 79, name: 'Redocumentation', desc: 'Porządkowanie i ulepszanie dokumentacji kodu bez zmiany jego działania.', img: '' },
    { id: 80, name: 'Reengineering', desc: 'Wprowadzanie gruntownych zmian funkcjonalnych w istniejącym systemie.', img: '' },
    { id: 81, name: 'Renaming Property', desc: 'Zasada mówiąca, że programy różniące się tylko nazwami zmiennych mogą dzielić te same testy.', img: '' },
    { id: 82, name: 'Repository', desc: 'Styl architektoniczny dla systemów zarządzających dużymi ilościami ustrukturyzowanych danych.', img: '' },
    { id: 83, name: 'Requirements Engineering', desc: 'Praktyka zbierania, dokumentowania i zarządzania wymaganiami systemu.', img: '' },
    { id: 84, name: 'Restructuring', desc: 'Aktualizowanie wewnętrznej struktury systemu przy zachowaniu tej samej funkcjonalności.', img: '' },
    { id: 85, name: 'Reverse Engineering', desc: 'Analiza istniejącego systemu w celu lepszego zrozumienia i stworzenia jego abstrakcji.', img: '' },
    { id: 86, name: 'SA', desc: 'Analiza Strukturalna — metoda przekształcania rzeczywistych wymagań w oprogramowanie.', img: '' },
    { id: 87, name: 'Scenario-Based Evaluation', desc: 'Model testowania symulujący rzeczywiste scenariusze użytkowania oprogramowania.', img: '' },
    { id: 88, name: 'SD', desc: 'Projektowanie Strukturalne — tworzenie modułów i hierarchii modułów dla optymalnej struktury.', img: '' },
    { id: 89, name: 'Sequence Diagram', desc: 'Graf pokazujący kolejność chronologiczną wiadomości między obiektami.', img: '' },
    { id: 90, name: 'Software Architecture', desc: 'Praktyka postrzegania systemu przez pryzmat jego głównych komponentów i ich interakcji.', img: '' },
    { id: 91, name: 'Software Maintenance', desc: 'Dostosowywanie lub modyfikowanie systemu w celu naprawy błędów lub poprawy wydajności.', img: '' },
    { id: 92, name: 'State Diagram', desc: 'Graf pokazujący, jak jeden obiekt zmienia stany pod wpływem zdarzeń.', img: '' },
    { id: 93, name: 'Statement Coverage Property', desc: 'Zasada mówiąca, że każda linia kodu powinna być wykonana przez przynajmniej jeden test.', img: '' },
    { id: 94, name: 'Static Analysis', desc: 'Badanie struktury programu bez jego uruchamiania.', img: '' },
    { id: 95, name: 'Stepwise Abstraction', desc: 'Technika analizująca cały kod od poziomu najbardziej podstawowego do najbardziej abstrakcyjnego.', img: '' },
    { id: 96, name: 'Stepwise Refinement', desc: 'Podejście projektowe polegające na dzieleniu problemu na mniejsze, łatwiejsze do zarządzania części.', img: '' },
    { id: 97, name: 'Structure Chart', desc: 'Schemat pokazujący funkcje systemu od najbardziej złożonych do najprostszych.', img: '' },
    { id: 98, name: 'Structure Diagram', desc: 'Diagram przedstawiający złożone komponenty w strukturze oprogramowania.', img: '' },
    { id: 99, name: 'Subfunction', desc: 'Mały komponent łączący się z innymi podfunkcjami, tworząc większą funkcję.', img: '' },
    { id: 100, name: 'System Model', desc: 'Opis systemu w kategoriach jego komponentów i sposobu ich połączenia.', img: '' },
    { id: 101, name: 'Test Adequacy Criteria', desc: 'Zestaw wymagań mierzących skuteczność procesu testowania oprogramowania.', img: '' },
    { id: 102, name: 'Test Criterion', desc: 'Standard używany do oceny, czy oprogramowanie zostało odpowiednio przetestowane.', img: '' },
    { id: 103, name: 'Top-Down Design', desc: 'Projektowanie oprogramowania zaczynające od głównych funkcji i rozkładające je na mniejsze części.', img: '' },
    { id: 104, name: 'Unstructured Code', desc: 'Kod źle zorganizowany, trudny do czytania i śledzenia.', img: '' },
    { id: 105, name: 'User Class', desc: 'Rozróżnienie zmieniające działanie oprogramowania w zależności od tego, kto go używa.', img: '' },
    { id: 106, name: 'Validation', desc: 'Sprawdzanie, czy wymagania dotyczące problemu są poprawne i kompletne.', img: '' },
    { id: 107, name: 'Verification', desc: 'Sprawdzanie, czy rozwiązanie poprawnie odpowiada swoim wymaganiom.', img: '' },
    { id: 108, name: 'White-Box Testing', desc: 'Testowanie zaglądające do kodu i sprawdzające jego wewnętrzną logikę.', img: '' },
    { id: 109, name: 'Wicked Problem', desc: 'Złożony problem projektowy bez prostego rozwiązania, często wywołany przez inny problem.', img: '' },
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
        selectedCards.push({ pairId: item.id, type: 'desc', content: item.desc });
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
    if (confirm("Czy na pewno chcesz zakończyć grę dla wszystkich?")) {
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
        li.appendChild(scoreSpan);
        rankingList.appendChild(li);
    });
}
initHost(); id