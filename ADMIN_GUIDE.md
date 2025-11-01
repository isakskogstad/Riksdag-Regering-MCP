# Admin Panel Guide

## Översikt

Admin-panelen ger dig fullständig kontroll över datahämtning, filhantering och systemövervakning för Svensk Politik Arkiv. Denna guide förklarar alla funktioner och hur de används.

---

## 🎯 Snabbstart

### Första gången du använder admin-panelen:

1. **Kontrollera systemstatus** - Kolla att alla system är operativa i Översikt-fliken
2. **Konfigurera datahämtning** - Gå till Riksdagen/Regeringskansliet och starta första hämtningen
3. **Övervaka filnedladdning** - Följ nedladdningskön under Filer & Storage

---

## 📊 Översikt-flik

Den första fliken visar systemets övergripande hälsa och aktivitet.

### Systemstatus
- **Alla system operativa**: Databas och storage fungerar korrekt
- **Live-indikatorer**: Visar aktiva datahämtningar och filnedladdningar
- **Senaste aktivitet**: Visar när systemet senast uppdaterades

### Quick Stats
Fyra snabba metrics som ger dig en överblick:
- **Storage**: Hur mycket lagringsutrymme som används (av 1GB)
- **Filer**: Totalt antal filer och antal nya idag
- **DB Size**: Total databasstorlek och antal tabeller
- **Status**: Övergripande systemhälsa

### Varningar & Alerts
Visar endast kritiska eller viktiga varningar som kräver din uppmärksamhet:
- **Kritiska varningar** (röd): Kräver omedelbar åtgärd
- **Varningar** (gul): Bör åtgärdas snart
- Klicka på "Åtgärda nu" för att komma direkt till rätt ställe

### Snabbåtgärder
Fyra snabbknappar för vanliga uppgifter:
- **Hämta Riksdagsdata**: Öppnar Riksdagen-fliken
- **Kör filnedladdning**: Startar filnedladdningskön omedelbart
- **Kontrollera filer**: Öppnar Filer & Storage-fliken
- **Uppdatera statistik**: Uppdaterar storage-statistiken manuellt

### Detaljerad statistik (expanderbar)
Klicka på "Visa detaljerad statistik" för att se:
- **Storage Quota**: Detaljerad lagringsinformation per bucket
- **Filnedladdningskö**: Komplett översikt över nedladdningar
- **Activity Stream**: De 50 senaste admin-åtgärderna
- **Databasstatistik**: Storlek och status för alla tabeller
- **Datahämtningstidslinje**: Visuell tidslinje över datahämtningar

---

## 📚 Riksdagen-flik

Hantera datahämtning från Riksdagens öppna API.

### API-information
- Visar tillgängliga endpoints och vad de innehåller
- Länkar till Riksdagens API-dokumentation

### Datahämtningskonfiguration
För varje datatyp (dokument, ledamöter, voteringar, anföranden):

1. **Välj tidsspann**
   - Från-datum och till-datum
   - Tips: Börja med en kort period (1 månad) för att testa

2. **Starta hämtning**
   - Klicka på "Starta datahämtning"
   - Systemet hämtar data automatiskt i bakgrunden
   - Kan ta 5-30 minuter beroende på mängden data

3. **Övervaka progress**
   - Live-uppdatering var 5:e sekund
   - Visar: Aktuell sida / Totalt antal sidor
   - Status: in_progress, partial, completed, eller error

### Stoppa pågående hämtning
- Klicka på "Stoppa datahämtning" för att avbryta
- Data som redan hämtats sparas

---

## 🏛️ Regeringskansliet-flik

Hantera datahämtning från g0v.se API (Regeringskansliets dokument).

Fungerar identiskt med Riksdagen-fliken, men för Regeringskansliets data:
- Propositioner
- Pressmeddelanden
- SOU (Statens offentliga utredningar)
- Tal, remisser, rapporter, m.m.

---

## 📁 Filer & Storage-flik

Hantera alla nedladdade filer och lagringsutrymme.

### Filnedladdningskö (förbättrad)

**Översikt:**
- Total progress med procentvisning
- Status för väntande, bearbetande, klara och misslyckade filer

**Åtgärder:**
- **Kör nu**: Startar omedelbar bearbetning av köade filer
- **Återställ misslyckade**: Lägger tillbaka misslyckade filer i kön
- **Rensa klara**: Raderar klara filer från kön (filerna finns kvar i storage)
- **Auto-switch**: Aktiverar automatisk bearbetning

**Senaste filer:**
- Expandera för att se de 10 senaste filerna i kön
- Visar filväg och status

### Storage Browser (förbättrad)

**Navigation:**
- Använd breadcrumb-menyn (Root > mapp1 > mapp2) för att navigera
- Klicka på mappar för att öppna dem
- Hem-knappen tar dig tillbaka till root

**Funktioner:**
- **Sök**: Filter filer med realtidssökning
- **Öppna**: Klicka på 🔗-ikonen för att öppna filen i ny flik
- **Radera**: Klicka på 🗑️-ikonen för att radera filen (varning!)
- Växla mellan Regeringskansliet och Riksdagen buckets

### Storage Quota

**Information:**
- Total storage-användning i MB och procent
- Antal filer och genomsnittlig filstorlek
- Tillväxttakt per månad
- Estimerad tid till 80% kapacitet

**Varningar:**
- Vid >80% användning: Gul varning
- Vid >95% användning: Röd kritisk varning

### Storage-rensning (ny funktion!)

**Analyserar automatiskt:**
- Stora filer (>10 MB) som kan komprimeras
- Gamla filer (>365 dagar) som inte används
- Dubbletter och brutna länkar

**Användning:**
1. Granska listan över rensningskandidater
2. Markera filer du vill radera med checkboxes
3. Se estimerad diskbesparing
4. Klicka "Radera valda" för att bekräfta

⚠️ **VARNING**: Raderade filer kan inte återställas!

---

## ⚙️ Inställningar-flik

Hantera admin-användare och systeminställningar.

### Admin-användare
- Visa alla admin-användare med email
- Lägg till nya admins (kräver deras user ID)
- Ta bort admin-rättigheter

**Observera**: Den första admin-användaren kan inte tas bort automatiskt (av säkerhetsskäl).

---

## 🔧 Batch-operationer

Under Översikt-fliken finns avancerade batch-operationer.

### Tillgängliga operationer:

**1. Hämta bilagor för alla dokument utan filer**
- Lägger alla saknade bilagor i nedladdningskön
- Användbart efter initial datahämtning

**2. Radera alla filer äldre än 2 år**
- Rensar storage från gamla filer
- Användbart för att hålla storage under kontroll

### Användning:
1. Välj tabell (ex: Sakråd, Propositioner)
2. Välj operation
3. Klicka "Förhandsgranska påverkan" för att se estimat
4. Klicka "Kör batch-operation" för att köra

---

## 📈 Activity Stream

Under Översikt-fliken finns en logg över alla admin-åtgärder.

**Visar:**
- Typ av åtgärd (data fetch, file process, etc.)
- Beskrivning av vad som hände
- Tidsstämpel (relativ tid, ex: "för 5 minuter sedan")
- Metadata (om tillgänglig)

**Användbart för:**
- Felsökning: Se vad som hände innan ett fel
- Audit: Spåra vem som gjorde vad
- Övervakning: Se systemets aktivitet i realtid

---

## 🔍 Fil-integritetskontroll

Under Översikt-fliken finns ett verktyg för att kontrollera fil-länkar.

**Funktioner:**
- Kontrollerar alla fil-URL:er i databasen
- Rapporterar brutna länkar
- Visar giltiga vs. felaktiga filer
- Tar ~2-5 minuter att köra

**När ska man köra det?**
- Efter stora batch-operationer
- Vid misstanke om fel i filer
- Som rutinkontroll månadsvis

---

## 💡 Tips & Tricks

### Effektiv datahämtning
1. **Börja smått**: Hämta en månad först, testa att allt fungerar
2. **Schemalägg stora hämtningar**: Kör på kvällen när servern har låg belastning
3. **Övervaka storage**: Håll koll på lagringsutrymmet, rensa gamla filer regelbundet

### Filhantering
1. **Auto-processing**: Aktivera auto i filnedladdningskön för automatisk bearbetning
2. **Rensa regelbundet**: Använd storage-rensningsverktyget en gång i månaden
3. **Backup**: Kritiska filer bör ha backup utanför Supabase

### Felsökning
1. **Kontrollera Activity Stream**: Första stället att titta vid problem
2. **Kolla Edge Function logs**: Gå till Supabase dashboard > Functions > Logs
3. **Återställ misslyckade filer**: Vid sporadiska fel, återställ och försök igen

### Prestanda
1. **Batch-operationer**: Kör på icke-peak timmar
2. **Filnedladdning**: Maxgräns på 50 filer per körning (av prestandaskäl)
3. **Refresh stats**: Uppdatera storage-statistik efter stora förändringar

---

## 🆘 Vanliga problem & lösningar

### Problem: "Datahämtning fastnar på samma sida"
**Lösning**: Stoppa hämtningen, vänta 1 minut, starta om. Om problemet kvarstår, kontrollera API-källans status.

### Problem: "Filer misslyckas konstant i nedladdningskön"
**Lösning**: 
1. Kontrollera URL:erna (öppna i webbläsare)
2. Kolla Edge Function logs för specifika fel
3. Återställ och försök igen med färre filer

### Problem: "Storage fullt"
**Lösning**:
1. Använd storage-rensningsverktyget
2. Radera gamla/stora filer
3. Överväg att uppgradera storage-kvoten

### Problem: "Admin-panelen laddar inte"
**Lösning**:
1. Kontrollera att du är inloggad
2. Verifiera att du har admin-rättigheter (i profiles/user_roles-tabellen)
3. Rensa webbläsarens cache

---

## 🔐 Säkerhet

### Admin-åtkomst
- Endast användare i `user_roles`-tabellen med roll 'admin' har tillgång
- Första admin kan läggas till via bootstrap-mekanismen
- Efterföljande admins läggs till via Inställningar-fliken

### Edge Functions
- Alla edge functions kräver JWT-autentisering
- Admin-funktioner kontrollerar roll server-side
- Logs sparas i Supabase för audit trail

### Storage
- Public buckets för publika dokument
- RLS-policies förhindrar obehörig upload
- Service role krävs för automatiska uploads

---

## 📞 Support

### Loggfiler
- **Edge Functions**: Supabase Dashboard > Functions > Logs
- **Database**: Supabase Dashboard > Database > Logs
- **Activity Stream**: Direkt i admin-panelen

### Dokumentation
- [Riksdagens API-dokumentation](https://data.riksdagen.se/data/dokument/)
- [Supabase Documentation](https://supabase.com/docs)
- [Project SECURITY.md](./SECURITY.md) för säkerhetsinformation

---

*Senast uppdaterad: 2025-10-31*
