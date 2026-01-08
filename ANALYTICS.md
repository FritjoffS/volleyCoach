# Firebase Analytics - VolleyCoach

## 📊 Översikt

Firebase Analytics är nu integrerat i appen och spårar automatiskt användarinteraktioner och viktiga händelser.

## 🎯 Spårade events

### Sidvisningar och navigation
- `page_view` - När appen öppnas
- `view_team_list` - Startsidan med alla lag
- `view_team` - Visar ett specifikt lag
- `view_activities` - Visar aktiviteter (träningar/matcher)
- `view_players` - Visar spelarlistan
- `view_training` - Visar träningsdetaljer
- `view_match` - Visar matchdetaljer
- `view_squad_manager` - Öppnar trupphantering
- `view_lineup_manager` - Öppnar laguppställning

### CRUD-operationer (Create, Read, Update, Delete)

#### Lag
- `team_created` - Nytt lag skapat
  - Parameters: `team_type` (Dam/Herr/Mix), `team_mode` (6manna/4manna/Beach)
- `team_list_loaded` - Lag laddade
  - Parameters: `team_count` (antal lag)

#### Spelare
- `player_created` - Ny spelare tillagd
  - Parameters: `position` (spelarens position)
- `player_updated` - Spelare uppdaterad
- `players_loaded` - Spelare laddade
  - Parameters: `player_count` (antal spelare)

#### Aktiviteter
- `training_created` - Ny träning skapad
- `match_created` - Ny match skapad
- `activities_loaded` - Aktiviteter laddade
  - Parameters: `activity_count` (antal aktiviteter)

#### Trupp & Uppställningar
- `squad_saved` - Matchtrupp sparad
  - Parameters: `player_count` (antal spelare i truppen)
- `lineup_saved` - Laguppställning sparad
  - Parameters: `set_number` (vilket set)

### PWA-händelser
- `pwa_installed` - Användaren installerade appen
- `pwa_install_dismissed` - Användaren avvisade installation
- `install_banner_dismissed` - Användaren stängde installationsbannern

## 📈 Var hittar jag data?

### Firebase Console
1. Gå till: https://console.firebase.google.com/project/volleycoach-be999
2. Välj **Analytics** i menyn
3. Dashboard visar:
   - Aktiva användare (realtid, dag, vecka, månad)
   - Användarbeteenden
   - Populära events
   - Enheter och plattformar
   - Geografisk fördelning

### Realtidsöverblick
- **Analytics > Realtid**: Se pågående aktivitet live
- **Analytics > Events**: Se alla custom events och frekvens
- **Analytics > Målgrupper**: Skapa målgrupper baserat på beteende
- **Analytics > Trafikkällor**: Hur användare hittar appen

## 🔍 Användbara rapporter

### 1. Mest använda funktioner
Gå till **Events** och sortera efter antal:
- Se vilka funktioner som används mest
- Optimera vanliga flöden

### 2. Användarengagemang
**Engagement > Overview**:
- Genomsnittlig sessionstid
- Antal sessioner per användare
- Retention (återkommande användare)

### 3. Enheter och plattformar
**Tech > Overview**:
- Android vs iOS vs Desktop
- Webbläsare
- Skärmupplösningar

### 4. Konverteringsflöde
**Events > Conversion funnel**:
Skapa tratt t.ex.:
1. `page_view` → 2. `team_created` → 3. `player_created` → 4. `match_created`

## 🛠️ Utveckling och debugging

### Console-loggar
Varje analytics-event loggas i browserns console:
```
📊 Analytics event: team_created {team_type: 'Dam', team_mode: '6manna'}
📊 Analytics event: player_created {position: 'Passare'}
```

### Testa Analytics lokalt
1. Öppna appen: http://localhost:8000
2. Öppna DevTools Console
3. Utför åtgärder i appen
4. Se loggarna `📊 Analytics event:`
5. Efter ~1 timme: Se events i Firebase Console > Analytics > DebugView

### Aktivera DebugView
För att se events i realtid under utveckling:

**Chrome/Edge:**
```javascript
// Kör i Console
window.gtag('config', 'G-FTRQQXMNZ0', {
  'debug_mode': true
});
```

**Eller lägg till URL-parameter:**
```
https://volleycoach-be999.web.app/?debug_mode=true
```

## 📋 Custom Events - Best Practices

### Namngivning
- ✅ Använd `snake_case`: `player_created`
- ❌ Undvik camelCase: `playerCreated`
- ✅ Använd verb: `view_`, `create_`, `update_`, `delete_`
- ✅ Var specifik: `squad_saved` istället för bara `save`

### Parameters
- Max 25 parameters per event
- Parameter-namn: max 40 tecken
- Parameter-värden: max 100 tecken (sträng)
- Undvik personligt identifierbar information (PII)

### Exempel på bra events
```javascript
// ✅ Bra: Beskrivande med relevanta parameters
trackEvent('match_created', { 
  opponent: 'Team ABC', // OK: Lagnamn är inte PII
  match_type: 'league'
});

// ✅ Bra: Användbart för analys
trackEvent('lineup_saved', { 
  set_number: 1,
  formation: '4-2'
});

// ❌ Dåligt: För generiskt
trackEvent('button_click');

// ❌ Dåligt: Innehåller PII
trackEvent('player_created', {
  player_name: 'Anders Svensson', // ❌ Personnamn
  email: 'anders@example.com'     // ❌ Email
});
```

## 🔒 Privacy & GDPR

### Automatiskt anonymiserat
Firebase Analytics anonymiserar automatiskt:
- IP-adresser (de senaste oktetten)
- Användar-ID (genereras slumpmässigt)

### Vad spåras INTE
- Personnamn
- Email-adresser
- Telefonnummer
- Annan personligt identifierbar information (PII)

### Opt-out
Om du vill låta användare välja bort analytics:
```javascript
import { analytics } from './firebase-config.js';
import { getAnalytics, setAnalyticsCollectionEnabled } from 'firebase/analytics';

// Stäng av analytics
setAnalyticsCollectionEnabled(analytics, false);
```

## 🎓 Lär mer

- [Firebase Analytics Docs](https://firebase.google.com/docs/analytics)
- [Event Reference](https://firebase.google.com/docs/reference/js/analytics)
- [Best Practices](https://firebase.google.com/docs/analytics/best-practices)
- [Privacy & Security](https://firebase.google.com/support/privacy)

## 🔧 Felsökning

### Events syns inte i Console
- Vänta 24-48h för första data
- Använd DebugView för realtidsdata
- Kolla att `measurementId` är korrekt i config

### "Analytics not available"
- Kontrollera internetanslutning
- Verifiera att Firebase Hosting fungerar
- Kolla browserns console för fel

### Events dubbleras
- Kontrollera att sidan inte laddas om onödigt
- Se till att event-loggar inte körs flera gånger

## 📊 Export och integrationer

### BigQuery Export
Exportera rådata för avancerad analys:
1. Firebase Console > Analytics > Settings
2. Aktivera BigQuery Export
3. Kör SQL-queries på din data

### Google Analytics 4
Firebase Analytics är kopplat till GA4:
- Samma data synlig i båda verktygen
- Använd GA4 för webbfokuserade rapporter
- Använd Firebase för app-fokuserade rapporter
