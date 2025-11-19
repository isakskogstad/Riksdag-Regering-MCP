# Changelog

Alla betydande ändringar i detta projekt dokumenteras i denna fil.

Formatet baseras på [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
och detta projekt följer [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-11-19

### Tillagd

#### Core funktionalitet
- Initial release av Riksdag-Regering MCP Server
- Komplett TypeScript implementation
- Supabase integration för dataåtkomst

#### Sökverktyg (Search Tools)
- `search_ledamoter` - Sök efter ledamöter med filter för namn, parti, valkrets och status
- `search_dokument` - Sök efter Riksdagsdokument med stöd för dokumenttyp, riksmöte, organ och datum
- `search_anforanden` - Sök efter anföranden med filter för talare, parti och text
- `search_voteringar` - Sök efter voteringar med filter för titel, riksmöte och datum
- `search_regering` - Sök i Regeringskansliets dokument (pressmeddelanden, propositioner, SOU, etc.)

#### Analysverktyg (Analysis Tools)
- `analyze_partifordelning` - Analysera fördelning av ledamöter per parti
- `analyze_votering` - Detaljerad analys av röstningsresultat med partifördelning
- `analyze_ledamot` - Analysera en ledamots aktivitet och röstningsstatistik
- `analyze_dokument_statistik` - Statistisk analys av dokument per typ och organ
- `analyze_trend` - Trendanalys över tid med gruppering per dag, vecka, månad eller år

#### Jämförelseverktyg (Comparison Tools)
- `compare_ledamoter` - Jämför två ledamöters aktivitet och röstningsstatistik
- `compare_parti_rostning` - Jämför partiernas röstbeteende mellan två voteringar
- `compare_riksdag_regering` - Jämför dokument från Riksdagen och Regeringen om samma ämne
- `compare_partier` - Jämför aktivitet och statistik mellan två partier

#### Resources
- `riksdagen://ledamoter` - Lista över alla ledamöter
- `riksdagen://partier` - Översikt över alla partier med antal ledamöter
- `riksdagen://dokument/typer` - Lista över dokumenttyper med antal dokument
- `regeringen://departement` - Lista över departement med antal dokument
- `riksdagen://statistik` - Sammanställd statistik över all data

#### Dokumentation
- Omfattande README.md med installation och användning
- USAGE_GUIDE.md med praktiska exempel och användarfall
- Inline JSDoc kommentarer i all kod
- TypeScript type definitions för alla datastrukturer

#### Konfiguration
- package.json med alla dependencies
- tsconfig.json för TypeScript kompilering
- .env.example för miljövariabler
- Stöd för Claude Desktop och Cline (VS Code)

#### Hjälpfunktioner
- Supabase client management
- Databearbetningsfunktioner (gruppering, sortering, statistik)
- Datumformatering
- HTML-stripping och texttrunkering

### Datakällor

#### Riksdagen (data.riksdagen.se)
- Ledamöter med fullständig information
- Dokument (motioner, propositioner, betänkanden, skrivelser, etc.)
- Anföranden med talare och debattinformation
- Voteringar med detaljerade röster per ledamot och parti

#### Regeringskansliet (g0v.se)
- Pressmeddelanden
- Propositioner
- Statens offentliga utredningar (SOU)
- Departementsserien
- Remisser
- Rapporter
- Kommittédirektiv
- Faktapromemoria
- Internationella MR-granskningar
- Dagordningar
- Regeringsuppdrag och regeringsärenden

### Teknisk stack
- Node.js 18+
- TypeScript 5.8+
- Model Context Protocol SDK 1.0.4
- Supabase JS Client 2.78.0
- Zod 3.25+ för validering

## [Unreleased]

### Planerat
- Caching för bättre prestanda
- Webhooks för realtidsuppdateringar
- Export-funktionalitet (CSV, Excel, PDF)
- Visualiseringsverktyg
- AI-driven sammanfattning av dokument
- Sentiment-analys av anföranden
- Prediktiv analys av röstningar
- GraphQL API
- WebSocket support för realtidsdata
- Multispråksstöd (Svenska/Engelska)

### Under utveckling
- Utökad felhantering
- Automatisk retry-logik
- Rate limiting
- Improved logging och monitoring
- Unit och integration tests
- Performance optimization

---

## Versionshistorik format

### [Version] - YYYY-MM-DD

#### Tillagd (Added)
För ny funktionalitet

#### Ändrad (Changed)
För ändringar i befintlig funktionalitet

#### Föråldrad (Deprecated)
För funktioner som snart kommer tas bort

#### Borttagen (Removed)
För borttagna funktioner

#### Fixad (Fixed)
För buggfixar

#### Säkerhet (Security)
För säkerhetsuppdateringar
