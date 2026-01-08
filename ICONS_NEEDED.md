# Ikoner som behövs

För att appen ska fungera optimalt som en PWA behöver följande ikonfiler skapas:

## Obligatoriska ikoner

### icon-192.png
- **Storlek**: 192x192 pixlar
- **Format**: PNG
- **Syfte**: Standard app-ikon för Android och Chrome
- **Innehåll**: VolleyCoach-logotyp eller volleybollrelaterad ikon

### icon-512.png
- **Storlek**: 512x512 pixlar
- **Format**: PNG
- **Syfte**: Högupplöst ikon för större skärmar och splash screens
- **Innehåll**: Samma design som icon-192.png men i högre upplösning

## Rekommendationer

1. **Design**: 
   - Använd en enkel, tydlig design
   - Undvik för mycket text
   - Använd färgerna från appen (#667eea - lila/blå)
   - Volleyboll-tema (boll, nät, etc.)

2. **Safe zone**: 
   - Håll viktig grafik inom 80% av ikonen (safe zone)
   - Detta för att undvika att grafik skärs bort på vissa enheter

3. **Maskable icons**:
   - Ikonerna mårkerade som "maskable" i manifest.json
   - Detta betyder att systemet kan beskära dem till olika former
   - Se till att designen fungerar även beskuren till cirkel

## Snabb lösning

Om du snabbt vill testa PWA-funktionalitet kan du:

1. Skapa en enkel ikon med text "VC" på färgad bakgrund
2. Använd ett online-verktyg som [Favicon.io](https://favicon.io/) eller [RealFaviconGenerator](https://realfavicongenerator.net/)
3. Generera båda storlekar från samma design

## Exempel på enkelt kommando med ImageMagick

```bash
# Om du har ImageMagick installerat
convert -size 192x192 xc:#667eea -gravity center -pointsize 80 -fill white -annotate +0+0 "VC" icon-192.png
convert -size 512x512 xc:#667eea -gravity center -pointsize 220 -fill white -annotate +0+0 "VC" icon-512.png
```

## Temporär lösning

Tills ikonerna är klara kan Service Worker hantera frånvaron av dem utan att krascha.
Appen kommer fortfarande att fungera men sakna visuell identitet när den installeras.
