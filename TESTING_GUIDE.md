# Testguide - PWA och Responsiv Design

## 🚀 Snabbstart

### 1. Skapa temporära ikoner (snabbtest)

Om du har ImageMagick installerat:
```bash
cd d:\projects\volleyCoach
convert -size 192x192 xc:#667eea -gravity center -pointsize 80 -fill white -annotate +0+0 "VC" icon-192.png
convert -size 512x512 xc:#667eea -gravity center -pointsize 220 -fill white -annotate +0+0 "VC" icon-512.png
```

**ELLER** använd online-verktyg:
1. Gå till https://favicon.io/favicon-generator/
2. Text: VC
3. Background: #667eea (lila/blå)
4. Font: Bold
5. Ladda ner och byt namn till `icon-192.png` och `icon-512.png`

### 2. Starta servern

**Windows PowerShell:**
```powershell
cd d:\projects\volleyCoach
powershell -ExecutionPolicy Bypass -File server.ps1
```

**ELLER Python:**
```bash
cd d:\projects\volleyCoach
python -m http.server 8000
```

**ELLER VS Code Live Server:**
- Högerklicka på `index.html`
- Välj "Open with Live Server"

### 3. Öppna i webbläsare

```
http://localhost:8000
```

## ✅ Checklista - Testa Alla Förbättringar

### PWA och Service Worker

- [ ] **Öppna DevTools Console**
  - Ska se: "Service Worker registrerad: http://localhost:8000/"
  - Ska INTE se: 404-fel eller "Failed to register"

- [ ] **Kontrollera Service Worker i DevTools**
  - Application → Service Workers
  - Status: "activated and is running"
  - Scope: correct

- [ ] **Testa caching**
  - Ladda sidan första gången
  - DevTools → Network → Throttling → Offline
  - Ladda om sidan
  - Sidan ska laddas från cache (eller visa offline.html)

- [ ] **Testa install prompt**
  - Kolla efter install-knapp (grön knapp nere till höger)
  - Klicka och verifiera att install-dialog visas
  - (Funkar bara på HTTPS eller localhost)

### Responsiv Design - Desktop

- [ ] **Normal desktop-storlek (>900px)**
  - Laguppställning: Plan ska vara stor och tydlig
  - Cirklar: 64px diameter
  - Player picker: Centrerad under/över cirkel

- [ ] **Skapa en match och gå till "Laguppställningar"**
  - Klicka på cirklarna för att välja spelare
  - Player picker ska visas centrerad
  - Picker ska stanna inom viewport

### Responsiv Design - Tablet

- [ ] **Tablet-storlek (700-900px)**
  - Öppna DevTools → Toggle device toolbar
  - Välj iPad eller liknande
  - Laguppställning: Mindre plan, fortfarande användbar
  - Knappar: Staplas bättre

### Responsiv Design - Mobil

- [ ] **Mobil-storlek portrait (375-480px)**
  - DevTools → iPhone SE, iPhone 12 etc.
  - Laguppställning: Kompakt men användbar
  - Cirklar: Små (36-40px) men klickbara
  - Player picker: Smalare (180-200px)
  - Knappar: Full bredd, staplade

- [ ] **Liten mobil (<375px)**
  - DevTools → iPhone SE (375px) eller mindre
  - Allt ska fortfarande fungera
  - Text ska vara läsbar

### Responsiv Design - Landscape

- [ ] **Mobil landscape-läge**
  - Rotera enheten till landscape (DevTools: Rotate)
  - Laguppställning: Ska anpassa sig
  - Innehållet får scrolla om det behövs

### Player Picker - Advanced

- [ ] **Picker vid övre kanten**
  - Klicka på position 4 (övre vänster)
  - Picker ska öppnas nedanför om den får plats
  - Annars ovanför

- [ ] **Picker vid nedre kanten**
  - Klicka på position 1 (nedre höger)
  - Picker ska öppnas ovanför om den inte får plats nedanför

- [ ] **Picker vid vänster kant**
  - Klicka på cirklar nära vänster kant
  - Picker ska justeras högerut för att få plats

- [ ] **Picker vid höger kant**
  - Klicka på cirklar nära höger kant
  - Picker ska justeras vänsterut

- [ ] **Stäng picker**
  - Tryck ESC → Picker stängs
  - Klicka utanför → Picker stängs
  - Scrolla sidan → Picker stängs (efter 150ms)
  - Rotera enheten → Picker stängs

### Touch-interaktion (Endast mobil)

- [ ] **Touch feedback**
  - Klicka på cirklar → Ska se scale-animation
  - Klicka på picker items → Ska se background-change
  - Inga dubbla tap-effekter (tap-highlight borttaget)

- [ ] **Smooth scrolling**
  - Scrolla i player picker
  - Scrolla på sidan
  - Ska kännas smooth på iOS/Android

### Offline-funktionalitet

- [ ] **Testa offline-sida**
  - Ladda sidan normalt
  - DevTools → Network → Offline
  - Navigera till ny sida/ladda om
  - Ska visa `offline.html` med snygg design

- [ ] **Auto-reload**
  - När offline-sida visas
  - DevTools → Network → Online
  - Sidan ska auto-reload efter 1 sekund

### Meta Tags och Manifest

- [ ] **Kolla meta tags**
  - DevTools → Elements → `<head>`
  - Verifiera `mobile-web-app-capable` finns
  - Verifiera `theme-color` är #667eea

- [ ] **Kolla manifest**
  - DevTools → Application → Manifest
  - Name: VolleyCoach
  - Start URL: ./
  - Display: standalone
  - Icons: 2 st (om du skapat dem)

## 🐛 Vanliga Problem

### Problem: Service Worker registreras inte

**Lösning:**
1. Kör på `http://localhost` eller `https://` (inte `file://`)
2. Kolla att `sw.js` finns i root-mappen
3. Hard refresh: Ctrl+Shift+R (Windows) / Cmd+Shift+R (Mac)

### Problem: Player picker hamnar utanför skärmen

**Lösning:**
- Uppdatera sidan (ska vara fixat nu)
- Kolla console för fel
- Testa olika positioner

### Problem: Ikoner saknas (404)

**Lösning:**
- Skapa `icon-192.png` och `icon-512.png` enligt guide
- Service Worker ska hantera frånvaron utan krasch

### Problem: Offline-sida visas inte

**Lösning:**
1. Hard refresh för att uppdatera Service Worker
2. DevTools → Application → Service Workers → Unregister
3. Ladda om sidan
4. Testa offline igen

## 📱 Testa på Riktig Enhet

### Android

1. Öppna Chrome på Android
2. Navigera till `http://[DIN-DATOR-IP]:8000`
3. Testa touch-interaktioner
4. Testa install-prompt
5. Testa olika orientations

### iOS

1. Öppna Safari på iPhone/iPad
2. Navigera till `http://[DIN-DATOR-IP]:8000`
3. Dela → Lägg till på hemskärmen
4. Öppna från hemskärmen
5. Testa touch-interaktioner

**Hitta din dator-IP:**
```bash
# Windows
ipconfig

# Mac/Linux  
ifconfig
```

## 🎉 Allt Fungerar?

Om alla punkter är checkade:
- ✅ PWA-funktionalitet är komplett
- ✅ Responsiv design fungerar på alla skärmar
- ✅ Offline-funktionalitet är aktiv
- ✅ Touch-optimering är implementerad

**Grattis! Appen är redo för användning! 🏐**

## 📝 Rapportera Problem

Om något inte fungerar:
1. Kolla console för fel
2. Verifiera att alla filer finns
3. Hard refresh (Ctrl+Shift+R)
4. Unregister Service Worker och försök igen
