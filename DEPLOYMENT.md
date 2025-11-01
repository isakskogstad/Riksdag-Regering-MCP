# 🚀 Deployment Guide

## ⚠️ VIKTIG SÄKERHETSNOTIS

**KRITISKT**: `.env`-filen har exponerats i repo-historiken med Supabase-nycklar. Följ instruktionerna nedan för att rensa historiken.

## 🔒 Ta bort exponerade hemligheter från Git-historik

### Alternativ 1: Använd BFG Repo-Cleaner (Rekommenderat)
```bash
# 1. Installera BFG
brew install bfg  # Mac
# eller ladda ner från: https://rtyley.github.io/bfg-repo-cleaner/

# 2. Klona en ny kopia av repot
git clone --mirror https://github.com/KSAklfszf921/Riksdag-Regering.AI.git

# 3. Skapa backup
cp -r Riksdag-Regering.AI.git Riksdag-Regering.AI.git.bak

# 4. Ta bort .env från alla commits
cd Riksdag-Regering.AI.git
bfg --delete-files .env

# 5. Rensa och komprimera repot
git reflog expire --expire=now --all && git gc --prune=now --aggressive

# 6. Force push till GitHub
git push --force
```

### Alternativ 2: Använd git filter-branch
```bash
# Varning: Detta kommer att omskriva all historik
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch .env" \
  --prune-empty --tag-name-filter cat -- --all

# Force push
git push origin --force --all
git push origin --force --tags
```

### Efter rensning:
1. **Rotera alla Supabase-nycklar omedelbart**
2. Gå till Supabase Dashboard → Settings → API
3. Regenerera anon key och service role key
4. Uppdatera GitHub Secrets med nya nycklar

## 📦 GitHub Pages Deployment

### Automatisk deployment (GitHub Actions)

Deployment sker automatiskt vid push till `main`- eller `work`-branchen (standard).

### Manuell deployment

1. **Bygg projektet lokalt:**
```bash
npm install
npm run build
```

2. **Deploy till GitHub Pages:**
```bash
# Installera gh-pages
npm install --save-dev gh-pages

# Deploy
npx gh-pages -d dist
```

## 🔧 GitHub Konfiguration

### 1. Lägg till GitHub Secrets

Gå till Settings → Secrets and variables → Actions och lägg till:

- `VITE_SUPABASE_PROJECT_ID` - Din Supabase projekt-ID
- `VITE_SUPABASE_PUBLISHABLE_KEY` - Din Supabase anon key
- `VITE_SUPABASE_URL` - Din Supabase URL

### 2. Aktivera GitHub Pages

1. Gå till Settings → Pages
2. Source: GitHub Actions
3. Vänta på första deployment

### 3. Verifiera deployment

Efter deployment, besök:
```
https://ksaklfszf921.github.io/Riksdag-Regering.AI/
```

## 🏗️ Projektstruktur för GitHub Pages

```
public/
├── 404.html         # SPA routing fallback
├── .nojekyll        # Bypass Jekyll processing
└── favicon.svg      # Site favicon

src/
├── App.tsx          # Router med basename för GitHub Pages
└── ...

vite.config.ts       # Base URL konfiguration
.github/
└── workflows/
    ├── ci.yml       # CI/CD pipeline
    └── deploy.yml   # GitHub Pages deployment
```

## 🔍 Felsökning

### Problem: 404 på routes
**Lösning**: Säkerställ att `404.html` finns i `public/` mappen

### Problem: Blank sida
**Lösning**: Kontrollera att basename i Router matchar GitHub Pages URL

### Problem: Resurser laddas inte
**Lösning**: Verifiera base URL i `vite.config.ts`

### Problem: Environment variables fungerar inte
**Lösning**: Kontrollera GitHub Secrets och workflow-filen

## 📝 Lokal utveckling

1. **Kopiera environment variables:**
```bash
cp .env.example .env
# Redigera .env med dina värden
```

2. **Starta utvecklingsserver:**
```bash
npm run dev
```

3. **Besök:**
```
http://localhost:8080
```

## 🔄 Continuous Integration

CI/CD pipeline körs automatiskt och inkluderar:
- ✅ ESLint
- ✅ TypeScript type checking
- ✅ Build verification
- ✅ Security audit
- ✅ Automatisk deployment till GitHub Pages

## 📚 Relaterade dokument

- [README.md](README.md) - Projektöversikt
- [SECURITY.md](SECURITY.md) - Säkerhetspolicy
- [ADMIN_GUIDE.md](ADMIN_GUIDE.md) - Administratörsguide

## 🆘 Support

Vid problem, skapa en issue på GitHub eller kontakta projektadministratören.

---

**Senast uppdaterad**: 2025-11-01