# VolleyCoach - Laghanterings App

En komplett webbapplikation för att hantera volleybolllag med spelare, träningar och matcher.

## 🏐 Funktioner

### Grundfunktioner
- **Laghantering**: Skapa, redigera och ta bort lag
- **Spelarhantering**: Lägg till spelare med position, nummer och kontaktinfo
- **Träningshantering**: Planera och dokumentera träningar
- **Matchhantering**: Organisera matcher och resultat

### Avancerade funktioner
- **Spelarstatistik**: Närvaro, matcher spelade, poäng
- **Laddningsindikatorer**: Visuell feedback under dataoperationer
- **Felhantering**: Robust hantering av nätverksfel
- **Responsiv design**: Fungerar på mobil, surfplatta och desktop
- **PWA-stöd**: Installera som app på hemskärmen

## 🚀 Installation och körning

### 1. Firebase-konfiguration
Redigera `js/firebase-config.js` och fyll i din Firebase-konfiguration:

```javascript
const firebaseConfig = {
  apiKey: "din-api-nyckel",
  authDomain: "ditt-projekt.firebaseapp.com",
  databaseURL: "https://ditt-projekt-default-rtdb.region.firebasedatabase.app/",
  projectId: "ditt-projekt-id",
  storageBucket: "ditt-projekt.firebasestorage.app",
  messagingSenderId: "123456789",
  appId: "din-app-id"
};
```

### 2. Starta lokal server
För att testa appen lokalt (krävs för JavaScript-moduler):

**Med PowerShell (Windows):**
```powershell
# Kör från projektmappen
powershell -ExecutionPolicy Bypass -File server.ps1
```

**Med Python:**
```bash
python -m http.server 8000
```

**Med Node.js:**
```bash
npx http-server -p 8000
```

### 3. Öppna appen
Gå till `http://localhost:8000` i din webbläsare.

## 📱 PWA-installation

Appen kan installeras som en Progressive Web App:

1. Öppna appen i Chrome/Edge/Safari
2. Klicka på "Installera app" i adressfältet
3. Appen läggs till på hemskärmen/startmenyn

## 🗂️ Projektstruktur

```
volleyCoach/
├── index.html              # Huvudsida
├── manifest.json           # PWA-manifest
├── sw.js                   # Service Worker
├── server.ps1             # PowerShell HTTP-server
├── css/
│   └── style.css          # Stilmallar
├── js/
│   ├── main.js            # Huvudlogik
│   ├── ui.js              # UI-komponenter
│   ├── database.js        # Firebase-operationer
│   └── firebase-config.js # Firebase-konfiguration
└── scheme.png             # App-ikon
```

## 🔧 Teknisk information

### Frontend-teknologier
- **Vanilla JavaScript** (ES6+ moduler)
- **CSS3** med Grid och Flexbox
- **Progressive Web App** (PWA)
- **Service Worker** för offline-funktionalitet

### Backend & databas
- **Firebase Realtime Database**
- **Firebase Hosting** (optional)

### Kodstruktur
- **Modulär arkitektur** med separata filer för UI, databas och logik
- **Async/await** för databasoperationer
- **Error handling** med try/catch
- **Responsive design** med CSS Grid/Flexbox

## 📊 Databasstruktur

```json
{
  "teams": {
    "teamId": {
      "name": "Lagnamn",
      "type": "Dam|Herr|Mix",
      "mode": "6manna|4manna|Beach",
      "players": {
        "playerId": {
          "name": "Spelarnamn",
          "position": "Position",
          "number": 1,
          "contactInfo": "kontakt@email.com",
          "stats": {
            "trainingsAttended": 10,
            "totalTrainings": 12,
            "matchesPlayed": 5,
            "totalPoints": 150
          }
        }
      },
      "activities": {
        "trainings": {
          "trainingId": {
            "date": "2025-01-15",
            "time": "19:00",
            "location": "Gymnastiksal",
            "focus": "Teknik",
            "notes": "Fokus på serve",
            "attendance": {
              "playerId": "Spelarnamn"
            }
          }
        },
        "matches": {
          "matchId": {
            "date": "2025-01-20",
            "time": "18:00",
            "opponent": "Motståndare IF",
            "location": "Hemma",
            "type": "Seriematch",
            "result": "3-1",
            "notes": "Bra match!"
          }
        }
      }
    }
  }
}
```

## 🎯 Användning

### Skapa nytt lag
1. Klicka "Nytt lag" på startsidan
2. Fyll i lagnamn, typ och speltyp
3. Klicka "Spara"

### Hantera spelare
1. Välj lag från startsidan
2. Klicka "Spelare"
3. Lägg till nya spelare eller redigera befintliga
4. Statistik uppdateras automatiskt

### Planera träningar
1. Gå till "Aktiviteter" i lagmenyn
2. Klicka "Ny Träning"
3. Fyll i datum, tid, plats och fokus
4. Spara träningen

### Registrera matcher
1. Gå till "Aktiviteter"
2. Klicka "Ny Match"
3. Fyll i motståndare, datum och plats
4. Lägg till resultat efter matchen

## 🔄 Framtida förbättringar

- [ ] Närvaroregistrering med QR-koder
- [ ] Push-notifikationer för träningar
- [ ] Detaljerad matchstatistik
- [ ] Export av data till PDF/Excel
- [ ] Multi-team hantering för föreningar
- [ ] Bilduppladdning för spelare
- [ ] Kalenderintegration
- [ ] Chat-funktionalitet

## 🤝 Bidrag

Bidrag är välkomna! Vänligen:
1. Forka projektet
2. Skapa en feature branch
3. Committa dina ändringar
4. Pusha till branchen
5. Öppna en Pull Request

## 📝 Licens

Detta projekt är öppen källkod under MIT-licensen.

## 🐛 Buggrapporter

Rapportera buggar genom att skapa ett issue på GitHub.

---

Utvecklad med ❤️ för volleyboll-communityn