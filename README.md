# Memory Multiplayer

Gra "Memory" (znajdź pary) dla wielu graczy. Aplikacja została zbudowana na **Node.js** i **Socket.IO**, pozwalając jednemu komputerowi pełnić rolę Hosta, podczas gdy pozostali gracze używają swoich telefonów jako kontrolerów i plansz.

## Jak uruchomić projekt na swoim komputerze?

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
 `http://localhost:3000` (aby grać w pojedynkę) 
lub 
 `http://TWOJE_IP:3000` (np. `http://192.168.0.103:3000`, jeśli chcesz, aby inni dołączali z telefonów na domowym Wi-Fi).
