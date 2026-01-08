# PWA Installationsguide - VolleyCoach

## 🔍 Så testar du installationen:

### På Android (Chrome/Edge):

1. **Öppna appen** i Chrome: `https://volleycoach-be999.web.app`

2. **Öppna DevTools Console** (valfritt för debugging):
   - Tre prickar → Fler verktyg → Utvecklarverktyg → Console
   - Kolla efter dessa meddelanden:
     ```
     ✅ Manifest.json laddad
     ✅ Service Worker registrerad
     🎉 PWA install prompt available - appen kan installeras!
     ```

3. **Installera appen på 2 sätt:**
   
   **A) Via installationsbannern (automatisk):**
   - Gradient-banner dyker upp högst upp
   - Klicka på "INSTALLERA"-knappen
   - Bekräfta i systemdialogrutan
   
   **B) Via webbläsarens meny:**
   - Tre prickar → "Installera app" eller "Lägg till på startskärmen"
   - Bekräfta installation

4. **Verifiera installationen:**
   - Appen läggs till på hemskärmen med ikon
   - Öppnar i eget fönster (ingen webbläsarkontroll)
   - Kan öppnas offline (efter första besöket)

### På iPhone/iPad (Safari):

1. **Öppna appen** i Safari: `https://volleycoach-be999.web.app`

2. **Installera:**
   - Tryck på dela-knappen (📤)
   - Välj "Lägg till på hemskärmen"
   - Bekräfta namnet "VolleyCoach"
   - Tryck "Lägg till"

3. **Verifiera:**
   - Ikon visas på hemskärmen
   - Öppnar som fullskärmsapp

### På Desktop (Chrome/Edge):

1. **Öppna appen**: `https://volleycoach-be999.web.app`

2. **Installera:**
   - Klicka på installationsikonen (➕) i adressfältet (höger sida)
   - ELLER klicka på "INSTALLERA" i bannern högst upp
   - ELLER tre prickar → "Installera VolleyCoach"

3. **Verifiera:**
   - Appen öppnas i eget fönster
   - Finns i Start-menyn/programlistan
   - Kan pinnas i aktivitetsfältet

## 🐛 Felsökning:

### Ingen installationsknapp visas?

**Kontrollera följande:**

1. **Öppna DevTools Console** och leta efter fel:
   ```
   ❌ Kunde inte ladda manifest.json
   ❌ Service Worker stöds inte
   ```

2. **Kontrollera PWA-krav:**
   - Appen måste köras över HTTPS ✅ (Firebase har detta)
   - Manifest.json måste vara giltig ✅
   - Service Worker måste vara registrerad ✅
   - Ikoner måste finnas (192x192 och 512x512) ✅

3. **Testa PWA-status:**
   - Chrome DevTools → Application → Manifest
   - Kontrollera att alla fält är ifyllda
   - Chrome DevTools → Application → Service Workers
   - Kontrollera att SW är "activated"

4. **Redan installerad?**
   - Om appen redan är installerad visas inte bannern
   - Console visar: `✅ Appen körs redan som installerad PWA`

5. **Rensa cache och testa igen:**
   - Chrome DevTools → Application → Clear storage
   - Kryssa i "Unregister service workers"
   - Klicka "Clear site data"
   - Ladda om sidan

### "Lägg till på startsidan" skapar bara genväg?

Detta betyder att PWA-kraven inte är uppfyllda:

**iOS Safari:**
- iOS stödjer PWA men har begränsningar
- "Lägg till på hemskärmen" är rätt metod
- Appen kommer inte ha full offline-support som Android

**Android Chrome:**
- Om du ser "Lägg till på startskärmen" istället för "Installera app"
- Något PWA-krav är inte uppfyllt
- Kolla console-meddelanden för felmeddelanden

## ✅ Verifiering att PWA fungerar:

Efter installation, testa:

1. **Offline-funktionalitet:**
   - Stäng av internet
   - Öppna appen
   - Sidan ska ladda (Service Worker cache)

2. **Fullskärmsläge:**
   - Ingen webbläsarkontroll synlig
   - Bara appens innehåll

3. **Splash screen:**
   - Lila bakgrund med "VolleyCoach" vid start

4. **App-ikon:**
   - Syns på hemskärmen/startmenyn

## 📱 App-URL:

**Produktion:** https://volleycoach-be999.web.app

## 🔄 Uppdateringar:

När du deployer nya versioner:
- Service Worker uppdateras automatiskt
- Användare får nya versionen vid nästa reload
- Inget behov av ominstallation
