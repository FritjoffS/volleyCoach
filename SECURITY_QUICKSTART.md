# Snabbguide: Säkra din Firebase-databas 🔐

## 5-minuters säkerhetsfix

### Steg 1: Öppna Firebase Console
```
https://console.firebase.google.com/
```

### Steg 2: Navigera till Security Rules
1. Välj projekt: **volleycoach-be999**
2. Klicka på **Realtime Database** (vänster meny)
3. Klicka på fliken **Rules** (högst upp)

### Steg 3: Ersätt reglerna

**Ta bort det här** (osäkert):
```json
{
  "rules": {
    ".read": true,
    ".write": true
  }
}
```

**Klistra in det här istället**:
Öppna filen `firebase-security-rules.json` i detta projekt och kopiera ALLT innehåll.

### Steg 4: Publicera
1. Klicka på **Publish** (blå knapp)
2. Bekräfta

### ✅ Klart!

Din databas är nu skyddad med:
- ✅ Datavalidering
- ✅ Typkontroll  
- ✅ Längdkontroll
- ✅ Format-validering

## Testa att det fungerar

1. Öppna din app
2. Skapa ett nytt lag
3. Lägg till spelare
4. Om allt fungerar = Security Rules är korrekt installerade! 🎉

## Om något går fel

**Fel**: "Permission denied"
- Kolla att du publicerade reglerna
- Vänta 10 sekunder och försök igen

**Fel**: "Validation failed"  
- Din data matchar inte reglerna
- Kolla Developer Console (F12) för detaljer

## Varför är det här säkert?

**Innan**:
- ❌ Vem som helst kunde skriva vad som helst
- ❌ Ingen validering av data
- ❌ Risk för skadlig data

**Nu**:
- ✅ Data måste följa strikta regler
- ✅ Ogiltiga värden avvisas
- ✅ Databasen skyddad från skräp

## API-nycklar är OK!

**Viktigt**: Din Firebase API-nyckel i `firebase-config.js` är INTE hemlig.
- Den är designad att vara publik
- Den identifierar bara ditt projekt
- Security Rules skyddar data, inte API-nyckeln

Mer info: [Firebase Documentation om API-nycklar](https://firebase.google.com/docs/projects/api-keys)

---

**Behöver mer info?** Läs `FIREBASE_SECURITY.md` för fullständig guide.
