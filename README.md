# 🧠 Memory Multiplayer

Prawdziwie interaktywna gra "Memory" (znajdź pary) dla wielu graczy na żywo! Aplikacja została zbudowana na potężnym duecie **Node.js** i **Socket.IO**, pozwalając jednemu komputerowi pełnić rolę Hosta, podczas gdy pozostali gracze używają swoich telefonów jako kontrolerów i plansz.

## ✨ Główne funkcje
- **Rozgrywka Cross-Platform:** Graj z telefonów, tabletów lub komputerów, o ile posiadasz kod sesji (działa lokalnie w tej samej sieci lub po udostępnieniu portu przez internet).
- **Zróżnicowane karty:** Gra losuje różne ikony, obrazki oraz pojęcia (HTML, CSS, JavaScript, Psy, Koty i znacznie więcej). System automatycznie łączy nazwę w parę z jej obrazkiem lub definicją!
- **Nieskończona gra:** Kiedy gracz dopasuje wszystkie karty na swojej planszy, gra się nie kończy – serwer natychmiast wysyła mu kolejny, nowy zestaw, podczas gdy jego punkty rosną.
- **Na żywo:** Wyniki i aktywność graczy aktualizują się w czasie rzeczywistym na wielkim ekranie Hosta (panel administracyjny).
- **Interaktywne efekty:** Karty zaświecą się na zielono przy prawidłowym dobraniu oraz na czerwono przy pomyłce.
- **Kary za podpowiedzi:** Użycie systemu podpowiedzi kosztuje punkty, stawiając na balans ryzyka.
- **Bezpieczeństwo:** Wbudowany system zapobiegający dołączeniu do gry pod wulgarnymi pseudonimami.

## 🚀 Jak uruchomić projekt na swoim komputerze?

### Wymagania:
Zainstalowane środowisko **Node.js**.

### Instalacja:
1. Pobierz repozytorium na swój dysk.
2. Otwórz terminal w folderze głównym (`memory-game`).
3. Pobierz i zainstaluj potrzebne pakiety wpisując:
   ```bash
   npm install
   ```

### Uruchomienie Serwera i Hosta:
Wpisz w konsoli komendę:
```bash
npm start
```
Następnie otwórz przeglądarkę i wejdź na swój lokalny adres sieciowy:
👉 `http://localhost:3000` (aby grać w pojedynkę) 
lub 
👉 `http://TWOJE_IP:3000` (np. `http://192.168.0.103:3000`, jeśli chcesz, aby inni dołączali z telefonów na domowym Wi-Fi).

## 🌍 Jak wdrożyć w internecie (Darmowy Hosting)
Aby udostępnić grę światu, możesz za darmo użyć platformy **Render.com** lub **Replit.com**.

1. Na **Render.com**: utwórz `New Web Service`, połącz swoje konto z tym repozytorium GitHub i zostaw domyślne komendy. Projekt uruchomi się automatycznie.
2. Na **Replit.com**: kliknij `Create Repl`, wybierz Node.js, podepnij swój link do repozytorium GitHub i wciśnij wielki przycisk Run.

## 🛠️ Technologie
- **Frontend:** Vanilla JavaScript, HTML5, CSS3 
- **Backend:** Node.js, Express.js
- **Komunikacja Real-time:** Socket.IO
