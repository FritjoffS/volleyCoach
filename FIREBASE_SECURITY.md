# Firebase Säkerhetsguide 🔐

## Viktigt att förstå om Firebase API-nycklar

### ✅ API-nycklar är INTE hemliga
Firebase API-nycklar är **designade att vara publika**. De:
- Identifierar bara ditt Firebase-projekt
- Kan inte användas för att komma åt data utan rätt behörigheter
- Är säkra att ha i klientkod

**Källa**: [Firebase Documentation](https://firebase.google.com/docs/projects/api-keys)

### 🔒 Det verkliga skyddet: Security Rules

Din data skyddas av **Firebase Security Rules**, inte API-nyckeln!

## Sätta upp Firebase Security Rules

### Steg 1: Gå till Firebase Console

1. Öppna [Firebase Console](https://console.firebase.google.com/)
2. Välj ditt projekt: `volleycoach-be999`
3. Gå till **Realtime Database** i vänstermenyn
4. Klicka på fliken **Rules**

### Steg 2: Kopiera säkerhetsreglerna

Kopiera innehållet från `firebase-security-rules.json` i detta projekt.

### Steg 3: Publicera reglerna

1. Klistra in reglerna i Firebase Console
2. Klicka på **Publish** (Publicera)
3. Bekräfta att du vill uppdatera reglerna

## Vad säkerhetsreglerna gör

### 🛡️ Grundskydd
```json
{
  ".read": false,
  ".write": false
}
```
- **Standard**: Ingen åtkomst till något
- Specifika regler öppnar upp vad som behövs

### ✅ Datavalidering

Reglerna validerar:
- **Lagnamn**: Måste finnas, 1-100 tecken
- **Lagtyp**: Endast "Dam", "Herr", eller "Mix"
- **Speltyp**: Endast "6manna", "4manna", eller "Beach"
- **Spelarnummer**: 0-99
- **Datum**: Rätt format (YYYY-MM-DD)
- **Positioner**: Endast 1-6

### 🚫 Förhindrar

- Tomma lagnamn
- Ogiltiga lagtyper
- Tröjnummer över 99
- Felaktigt formaterade datum
- Okända fält (förhindrar databas-pollution)

## Nuvarande säkerhetsstatus

### ⚠️ INNAN Security Rules
```json
{
  "rules": {
    ".read": true,
    ".write": true
  }
}
```
**Problem**: Vem som helst kan läsa/skriva ALLT!

### ✅ EFTER Security Rules
- ✅ Alla kan läsa lag (bra för publik app)
- ✅ Alla kan skriva lag (du kan ändra detta senare)
- ✅ Data valideras vid varje skrivning
- ✅ Felaktiga fält förhindras
- ✅ Skydd mot skadlig data

## Framtida förbättringar (Fas 2)

### 1. Lägg till autentisering

```javascript
// Kräv inloggning
{
  ".read": "auth != null",
  ".write": "auth != null"
}
```

### 2. Användarseparering

```javascript
// Endast ägare kan redigera sitt lag
{
  "teams": {
    "$teamId": {
      ".write": "auth != null && auth.uid == data.child('ownerId').val()"
    }
  }
}
```

### 3. Roll-baserad åtkomst

```javascript
// Coaches kan redigera, spelare kan bara läsa
{
  ".write": "auth != null && root.child('users').child(auth.uid).child('role').val() == 'coach'"
}
```

## Implementation Guide

### Scenario 1: Publik App (Nuvarande)
**Vem som helst kan skapa/redigera lag**

✅ Använd bifogade rules som de är
- Perfekt för testning
- Bra för små klubbar
- Ingen inloggning krävs

### Scenario 2: Privat App (Rekommenderad för produktion)

**Endast inloggade användare**

```json
{
  "rules": {
    ".read": "auth != null",
    ".write": "auth != null",
    "teams": {
      "$teamId": {
        ".read": "auth != null",
        ".write": "auth != null && 
                  (!data.exists() || 
                   data.child('ownerId').val() == auth.uid ||
                   data.child('coaches').child(auth.uid).exists())"
      }
    }
  }
}
```

Kräver att du lägger till Firebase Authentication.

### Scenario 3: Multi-tenant (För föreningar)

**Olika lag för olika föreningar**

```json
{
  "clubs": {
    "$clubId": {
      ".read": "auth != null && root.child('clubMembers').child(auth.uid).child($clubId).exists()",
      ".write": "auth != null && root.child('clubAdmins').child(auth.uid).child($clubId).exists()",
      "teams": { ... }
    }
  }
}
```

## Testing av Security Rules

### Test 1: Försök skapa lag utan validering
```javascript
// Detta ska MISSLYCKAS
firebase.database().ref('teams').push({
  name: "",  // Tomt namn - INTE TILLÅTET
  type: "InvalidType"  // Ogiltig typ - INTE TILLÅTET
});
```

### Test 2: Försök skapa lag med korrekt data
```javascript
// Detta ska FUNGERA
firebase.database().ref('teams').push({
  name: "Mitt lag",
  type: "Dam",
  mode: "6manna"
});
```

### Test 3: Försök lägga till okända fält
```javascript
// Detta ska MISSLYCKAS
firebase.database().ref('teams/teamId').update({
  unknownField: "value"  // Okänt fält - INTE TILLÅTET
});
```

## Troubleshooting

### Problem: "Permission denied"

**Lösning**: 
1. Kontrollera att rules är publicerade
2. Verifiera att din data matchar validation-reglerna
3. Kolla Firebase Console → Realtime Database → Rules

### Problem: Data skrivs inte

**Lösning**:
1. Öppna Developer Console (F12)
2. Kolla efter Firebase-fel
3. Validera att ditt data-objekt har alla required fields

### Problem: "Validation failed"

**Lösning**:
- Läs felmeddelandet noga
- Kolla att datum har formatet YYYY-MM-DD
- Verifiera att lagtyp är Dam/Herr/Mix
- Se till att speltyp är 6manna/4manna/Beach

## Monitoring

### Övervaka säkerhet i Firebase Console

1. **Rules Playground**: Testa dina rules innan deploy
2. **Usage Tab**: Se vilka operationer som körs
3. **Logs**: Kolla efter failed requests

## Sammanfattning

### ✅ Vad du har nu:
- Firebase API-nyckel i kod (OKEJ - designat så)
- Ingen datavalidering (PROBLEM)
- Öppen read/write för alla (RISK)

### ✅ Vad du får efter Security Rules:
- Firebase API-nyckel i kod (fortfarande OKEJ)
- Strikt datavalidering (SKYDD)
- Kontrollerad åtkomst (SÄKERHET)

### 🎯 Nästa steg:
1. ✅ Kopiera `firebase-security-rules.json`
2. ✅ Publicera i Firebase Console
3. ✅ Testa att skapa lag
4. ⏭️ (Senare) Lägg till Firebase Authentication
5. ⏭️ (Senare) Implementera roll-baserad åtkomst

**Kom ihåg**: Firebase API-nycklar i klientkod är INTE ett säkerhetsproblem. Security Rules är ditt verkliga skydd! 🛡️
