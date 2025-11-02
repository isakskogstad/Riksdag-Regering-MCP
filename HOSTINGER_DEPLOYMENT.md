# 🚀 Hostinger Deployment Guide

## ⚠️ PROBLEM IDENTIFIERAT
Dina domäner serverar den **obbyggda källkoden** istället för den **byggda produktionsversionen**. Detta orsakar de vita sidorna eftersom webbläsaren inte kan köra TypeScript-filer direkt.

## 🔧 LÖSNING

### Steg 1: Logga in på Hostinger hPanel
1. Gå till https://hpanel.hostinger.com
2. Logga in med dina uppgifter

### Steg 2: Hitta dina domäner
1. I hPanel, navigera till "Websites"
2. Hitta **riksdagen.ai** och **regeringskansliet.ai**

### Steg 3: Ladda upp rätt filer

**VIKTIGT**: Du måste ladda upp innehållet från `dist/` mappen, **INTE** projektets rotmapp!

#### Option A: Via File Manager (Rekommenderat)
1. Klicka på domänen (t.ex. riksdagen.ai)
2. Gå till **File Manager**
3. Navigera till `public_html` mappen
4. **Radera alla befintliga filer** (de innehåller obbyggd kod)
5. Ladda upp **innehållet från `dist/` mappen** (INTE hela dist-mappen)
   - Alla filer i dist/ ska hamna direkt i public_html/
   - index.html ska ligga i public_html/index.html
   - assets/ mappen ska ligga i public_html/assets/

#### Option B: Via FTP
1. Använd FTP-uppgifterna från Hostinger
2. Anslut till servern
3. Navigera till `public_html` för domänen
4. Radera allt innehåll
5. Ladda upp **innehållet från `dist/`** direkt till public_html/

### Steg 4: Verifiera filstruktur
Efter uppladdning ska strukturen se ut så här:
```
public_html/
├── index.html
├── 404.html
├── favicon.ico
├── robots.txt
├── placeholder.svg
├── assets/
│   ├── index-[hash].js
│   ├── index-[hash].css
│   └── ... (alla andra assets)
└── .nojekyll
```

### Steg 5: Upprepa för båda domäner
Gör samma sak för både:
- riksdagen.ai
- regeringskansliet.ai

## 📁 Filer som är redo för deployment

Jag har byggt produktionsversionen åt dig:
- **Build location**: `/Users/isak/Riksdag-Regering.AI/dist/`
- **Zip-fil**: `/Users/isak/Riksdag-Regering.AI/riksdag-regering-build.zip`

## ✅ Verifiering

Efter deployment, testa att:
1. Besök https://riksdagen.ai - sidan ska ladda korrekt
2. Besök https://regeringskansliet.ai - sidan ska ladda korrekt
3. Kontrollera konsolen (F12) - inga fel om saknade filer

## 🆘 Felsökning

### Problem: Fortfarande vit sida
- **Kontrollera**: Att du laddade upp innehållet FRÅN dist/, inte hela dist-mappen
- **Lösning**: index.html ska ligga direkt i public_html/, inte i public_html/dist/

### Problem: 404-fel på JavaScript/CSS
- **Kontrollera**: Att assets/ mappen finns direkt under public_html/
- **Lösning**: Strukturen måste vara public_html/assets/, inte public_html/dist/assets/

### Problem: "Cannot GET /src/main.tsx"
- **Diagnos**: Du har laddat upp källkoden istället för byggd version
- **Lösning**: Radera allt och ladda upp från dist/ mappen

## 🔄 Framtida deployments

För framtida uppdateringar:
1. Gör ändringar i koden
2. Kör `npm run build`
3. Ladda upp nya filer från `dist/` till Hostinger

## 📋 Alternativ: GitHub Actions Automation

Om du vill automatisera deployment kan du:
1. Sätta upp GitHub Actions för auto-deployment
2. Använda Hostinger's Git integration om tillgänglig
3. Eller använda FTP deploy action

---

**Status**: Byggd version redo för deployment i `/dist/` mappen!