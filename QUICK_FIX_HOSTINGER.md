# 🔥 SNABB LÖSNING - Fixa vita sidor på Hostinger

## Problemet i korthet:
- **riksdagen.ai** och **regeringskansliet.ai** visar vita sidor
- Anledning: Obbyggd källkod (TypeScript) laddas istället för byggd JavaScript
- GitHub Pages fungerar eftersom den har rätt byggda filer

## ⚡ Snabbaste lösningen:

### 1. Ladda upp via Hostinger File Manager

1. **Logga in på Hostinger**: https://hpanel.hostinger.com

2. **För riksdagen.ai:**
   - Gå till Websites → riksdagen.ai → File Manager
   - Öppna `public_html` mappen
   - **Markera alla filer** och radera dem
   - Klicka "Upload Files"
   - **VIKTIGT**: Ladda upp alla filer från `/Users/isak/Riksdag-Regering.AI/dist/`
   - Se till att `index.html` hamnar direkt i `public_html/` (inte i en undermapp)

3. **För regeringskansliet.ai:**
   - Upprepa samma process

### 2. Alternativ: Använd zip-filen

Jag har skapat en färdig zip-fil:
- **Plats**: `/Users/isak/Riksdag-Regering.AI/riksdag-regering-build.zip`

1. Ladda upp denna zip till Hostinger File Manager
2. Extrahera innehållet direkt i `public_html/`
3. Radera zip-filen efteråt

## ✅ Kontrollera att det fungerar:

Efter uppladdning, öppna webbläsarens utvecklarverktyg (F12) och kolla:
1. Network-fliken ska visa att JS/CSS-filer laddas från `/assets/` (inte `/src/`)
2. Console ska inte visa några fel om "Cannot GET /src/main.tsx"

## 📂 Rätt filstruktur på Hostinger:

```
public_html/
├── index.html          ← Detta är huvudfilen
├── 404.html
├── favicon.ico
├── robots.txt
├── placeholder.svg
├── assets/             ← Mapp med alla JS/CSS-filer
│   ├── index-BdZp_7kV.js
│   ├── index-CXHDxwII.css
│   └── ... (40+ filer)
└── .nojekyll
```

## ⚠️ Vanliga misstag att undvika:

❌ **FEL**: Ladda upp hela projektet (med src/, node_modules/, etc.)
✅ **RÄTT**: Ladda upp endast innehållet från dist/

❌ **FEL**: Skapa dist/ mapp i public_html/
✅ **RÄTT**: Ladda upp innehållet från dist/ direkt till public_html/

❌ **FEL**: Ladda upp index.html från projektets rot
✅ **RÄTT**: Ladda upp index.html från dist/ mappen

## 🎯 Resultat:

När det är korrekt gjort ska:
- https://riksdagen.ai visa samma sida som GitHub Pages
- https://regeringskansliet.ai visa samma sida som GitHub Pages
- Ingen vit sida längre!

---

**Byggda filer finns i**: `/Users/isak/Riksdag-Regering.AI/dist/`
**Zip-fil finns i**: `/Users/isak/Riksdag-Regering.AI/riksdag-regering-build.zip`