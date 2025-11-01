# 🔐 Strong Password Policy - Konfigurationsguide

**Säkerhetsnivå:** Rekommenderad  
**Komplexitet:** Låg  
**Tidsåtgång:** 5 minuter  
**Prioritet:** Låg (preventiv åtgärd)

---

## 📋 Översikt

Denna guide beskriver hur du konfigurerar starkare lösenordskrav i Supabase för att förbättra autentiseringssäkerheten. Implementering är valfri men rekommenderad för produktionsmiljöer.

### Aktuell Status
- ✅ **Minimum lösenordslängd:** 6 tecken (Supabase default)
- ⚠️ **Komplexitetskrav:** Inga (siffror, specialtecken)
- ✅ **Magic link authentication:** Aktiverad (rekommenderad metod)

### Rekommenderad Status
- ✅ **Minimum lösenordslängd:** 8+ tecken
- ✅ **Komplexitetskrav:** Aktiverade
- ✅ **Magic link authentication:** Bibehållen som primär metod

---

## 🚀 Snabbguide: Aktivera Strong Password

### Metod 1: Via Supabase Dashboard (Rekommenderad)

1. **Logga in på Supabase Dashboard**
   - Gå till: https://supabase.com/dashboard
   - Välj ditt projekt

2. **Navigera till Authentication**
   ```
   Dashboard > Authentication > Providers
   ```

3. **Konfigurera Email Provider**
   - Klicka på "Email" i provider-listan
   - Scrolla ner till "Email Settings"

4. **Aktivera Strong Password**
   - Hitta alternativet "Minimum password length"
   - Sätt värdet till **8** (eller högre)
   - Aktivera "Require at least one uppercase letter"
   - Aktivera "Require at least one lowercase letter"
   - Aktivera "Require at least one number"
   - (Valfritt) Aktivera "Require at least one special character"

5. **Spara ändringar**
   - Klicka på "Save" längst ner på sidan
   - Vänta på bekräftelse

---

### Metod 2: Via Supabase SQL (Avancerad)

```sql
-- VARNING: Denna metod kräver att du har tillgång till Supabase SQL Editor
-- Användas endast om dashboard-metoden inte fungerar

-- Konfiguration lagras i auth.config
-- Kontakta Supabase support för custom password policies
```

**OBS:** Password policies konfigureras primärt via Dashboard. SQL-metoden är begränsad.

---

## 📊 Rekommenderade Inställningar

### För Publika Arkiv (Som denna applikation)

```
Minimum password length: 8 tecken
Uppercase required: Ja
Lowercase required: Ja
Number required: Ja
Special character required: Nej (valfritt)

Magic link: Aktiverad (primär metod)
Email confirmation: Aktiverad
```

**Motivering:**
- Balans mellan säkerhet och användarvänlighet
- Magic links rekommenderas som primär autentiseringsmetod
- Lösenord som backup-metod

### För Kritiska System

```
Minimum password length: 12 tecken
Uppercase required: Ja
Lowercase required: Ja
Number required: Ja
Special character required: Ja

Magic link: Aktiverad
Email confirmation: Aktiverad
MFA: Överväg aktivering
```

---

## 🔄 Påverkan på Befintliga Användare

### Vid Aktivering av Strong Password

✅ **Befintliga användare:**
- Kan fortfarande logga in med sina nuvarande lösenord
- Nya krav gäller endast vid lösenordsbyte

✅ **Nya användare:**
- Måste följa nya lösenordskrav vid registrering

✅ **Magic link-användare:**
- Påverkas inte - fortsätter fungera som vanligt

---

## 🧪 Testning Efter Konfiguration

### Test 1: Nytt Svagt Lösenord (Förväntat: Avvisas)

1. Försök registrera ny användare med lösenord: `test123`
2. **Förväntat resultat:** Felmeddelande om lösenordskrav
3. **Om test misslyckas:** Kontrollera Dashboard-inställningar

### Test 2: Nytt Starkt Lösenord (Förväntat: Accepteras)

1. Försök registrera ny användare med lösenord: `SecurePass123`
2. **Förväntat resultat:** Lyckad registrering
3. **Om test misslyckas:** Kontrollera email confirmation-inställningar

### Test 3: Befintlig Användare (Förväntat: Oförändrat)

1. Logga in med befintligt konto (svagt lösenord)
2. **Förväntat resultat:** Lyckad inloggning
3. **Notering:** Gamla lösenord påverkas inte

---

## 🔍 Felsökning

### Problem: Kan inte hitta password settings i Dashboard

**Lösning:**
1. Kontrollera att du har projektadmin-rättigheter
2. Navigera till: `Authentication > Providers > Email`
3. Om alternativet saknas, kontakta Supabase support

### Problem: Inställningar sparas inte

**Lösning:**
1. Hårduppdatera sidan (Ctrl+Shift+R)
2. Kontrollera browser console för fel
3. Försök i inkognito-läge
4. Kontakta Supabase support

### Problem: Användare kan fortfarande använda svaga lösenord

**Förklaring:**
- Detta är korrekt beteende
- Befintliga lösenord påverkas inte
- Nya krav gäller endast vid lösenordsbyte

**Om detta är ett problem:**
- Tvinga lösenordsbyte via email (manuell process)
- Eller acceptera att gamla lösenord är grandfather:ade

---

## 📈 Säkerhetsimpact

### Före Strong Password Policy

```
Risk för svaga lösenord: MEDEL
Brute force-motstånd: LÅG (6 tecken, inget komplexitetskrav)
Användarupplevelse: Enkel
```

### Efter Strong Password Policy

```
Risk för svaga lösenord: LÅG
Brute force-motstånd: MEDEL-HÖG (8+ tecken, komplexitetskrav)
Användarupplevelse: Något mer komplex (men magic links finns)
```

### Med Magic Link som Primär Metod

```
Risk för svaga lösenord: MYCKET LÅG (lösenord är backup)
Brute force-motstånd: EJ RELEVANT (inga lösenord i praktiken)
Användarupplevelse: ENKEL
```

---

## 🎯 Rekommendation

**För denna applikation (Publikt arkiv):**

1. **Prioritet:** Låg till Medel
2. **Rekommenderad åtgärd:** Sätt minimum till 8 tecken med basic komplexitet
3. **Motivering:**
   - Magic links är primär autentiseringsmetod
   - Lösenord används som backup
   - Balans mellan säkerhet och användarvänlighet

**Implementering:**
```
Tidsåtgång: 5 minuter
Användarimpact: Minimal (magic links påverkas inte)
Säkerhetsförbättring: Preventiv (ingen kritisk sårbarhet)
```

**Status:** ⚠️ Rekommenderad men ej kritisk  
**Nästa åtgärd:** Implementera vid lämplig tidpunkt (t.ex. nästa maintenance window)

---

## 📚 Relaterade Dokument

- **SECURITY.md** - Övergripande säkerhetsdokumentation
- **SECURITY_AUDIT_2025.md** - Senaste säkerhetsaudit
- **ADMIN_GUIDE.md** - Administratörsinstruktioner

---

## 🔗 Externa Resurser

- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [OWASP Password Guidelines](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)
- [NIST Password Guidelines](https://pages.nist.gov/800-63-3/sp800-63b.html#sec5)

---

**Senast uppdaterad:** 2025-01-31  
**Författare:** System Security Team  
**Version:** 1.0
