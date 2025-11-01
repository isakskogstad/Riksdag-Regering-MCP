# Struktur & Innehållsförbättringar - 20 Förslag

Baserat på analys av sidstrukturen, navigationen och innehållspresentationen.

---

## 🏠 Startsida & Landing

### 1. **Hero Section med Tydlig Value Proposition**
**Problem:** Nuvarande hero är för generisk ("Utforska svenska politiska institutioner...")
**Lösning:**
- Större, mer fokuserad hero med konkret nytta
- "Sök och analysera 500,000+ dokument från Riksdagen och Regeringen"
- Lägg till visuell statistik (stora siffror)
- CTA-knapp: "Börja utforska" → scrollar till sektioner

**Före:**
```tsx
<h1>Riksdag & Regering</h1>
<p>Utforska svenska politiska institutioner...</p>
```

**Efter:**
```tsx
<div className="max-w-5xl mx-auto text-center space-y-8">
  <h1 className="hero-title">
    Sök i Sveriges<br />Politiska Arkiv
  </h1>
  <p className="text-2xl text-muted-foreground max-w-3xl mx-auto">
    AI-driven tillgång till 500,000+ dokument från Riksdagen och Regeringskansliet
  </p>

  {/* Live stats */}
  <div className="flex justify-center gap-12">
    <div>
      <div className="text-5xl font-bold text-primary">500K+</div>
      <div className="text-sm text-muted-foreground">Dokument</div>
    </div>
    <div>
      <div className="text-5xl font-bold text-secondary">349</div>
      <div className="text-sm text-muted-foreground">Ledamöter</div>
    </div>
  </div>

  <Button size="lg" variant="gradient">
    Börja utforska <ArrowDown />
  </Button>
</div>
```

---

### 2. **Quick Search på Startsidan**
**Problem:** Ingen sökfunktion direkt på startsidan
**Lösning:**
- Stor sökbar direkt i hero
- Autocomplete med förslag
- "Sök i propositioner, ledamöter, debatter..."
- Smart routing baserat på vad man söker

**Implementation:**
```tsx
<div className="max-w-2xl mx-auto mb-12">
  <div className="relative">
    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
    <Input
      placeholder="Sök i propositioner, ledamöter, voteringar..."
      className="pl-12 h-14 text-lg"
    />
  </div>

  {/* Popular searches */}
  <div className="flex gap-2 mt-4 justify-center flex-wrap">
    <Badge variant="outline" className="cursor-pointer hover:bg-accent">
      Klimatlag
    </Badge>
    <Badge variant="outline" className="cursor-pointer hover:bg-accent">
      Budget 2024
    </Badge>
    <Badge variant="outline" className="cursor-pointer hover:bg-accent">
      SOU 2024:1
    </Badge>
  </div>
</div>
```

---

### 3. **"Featured" Innehåll på Startsidan**
**Problem:** Startsidan är statisk, visar ingen aktuell aktivitet
**Lösning:**
- Sektion "Senaste dokumenten" (5-10 st)
- "Populära sökningar denna vecka"
- "Aktuella debatter"
- Visar att sidan är levande med färskt innehåll

**Exempel:**
```tsx
<section className="mb-20">
  <h2 className="section-title text-center mb-10">Senaste från Riksdagen</h2>

  <div className="grid md:grid-cols-3 gap-6">
    {recentDocuments.slice(0, 3).map(doc => (
      <Card className="card-elevated">
        <CardHeader>
          <Badge>{doc.type}</Badge>
          <CardTitle className="line-clamp-2">{doc.title}</CardTitle>
          <CardDescription className="text-xs">
            {formatDistanceToNow(doc.date)} sedan
          </CardDescription>
        </CardHeader>
      </Card>
    ))}
  </div>

  <div className="text-center mt-6">
    <Button variant="outline-hover" asChild>
      <Link to="/riksdagen/dokument">Se alla dokument →</Link>
    </Button>
  </div>
</section>
```

---

## 🧭 Navigation & Wayfinding

### 4. **Persistent Header med Navigation**
**Problem:** Ingen global navigation, man måste gå tillbaka till startsidan
**Lösning:**
- Sticky header med logo + huvudnavigation
- Dropdown-menyer för underavdelningar
- Sökikonen alltid tillgänglig
- User menu för inloggade användare

**Struktur:**
```tsx
<header className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b">
  <div className="container flex h-16 items-center justify-between">
    {/* Logo */}
    <Link to="/" className="flex items-center gap-2">
      <Logo />
      <span className="font-bold">Riksdag & Regering</span>
    </Link>

    {/* Main nav */}
    <nav className="hidden md:flex gap-6">
      <NavigationMenu>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Riksdagen</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2">
              <li><Link to="/riksdagen/dokument">Dokument</Link></li>
              <li><Link to="/riksdagen/ledamoter">Ledamöter</Link></li>
              <li><Link to="/riksdagen/anforanden">Anföranden</Link></li>
              <li><Link to="/riksdagen/voteringar">Voteringar</Link></li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuTrigger>Regeringen</NavigationMenuTrigger>
          <NavigationMenuContent>
            {/* Regeringskansliet submenu */}
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenu>
    </nav>

    {/* Actions */}
    <div className="flex items-center gap-3">
      <Button variant="ghost" size="icon">
        <Search className="h-5 w-5" />
      </Button>
      <ThemeToggle />
      {user ? (
        <UserMenu user={user} />
      ) : (
        <Button variant="outline" size="sm" asChild>
          <Link to="/login">Logga in</Link>
        </Button>
      )}
    </div>
  </div>
</header>
```

---

### 5. **Breadcrumbs på Alla Undersidor**
**Problem:** Svårt att veta var man är i hierarkin
**Lösning:**
- Breadcrumbs högst upp på varje sida
- Dynamiska baserat på route
- Klickbara länkar tillbaka

**Exempel:**
```tsx
// På /riksdagen/dokument
<Breadcrumb>
  <BreadcrumbList>
    <BreadcrumbItem>
      <BreadcrumbLink href="/">Hem</BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem>
      <BreadcrumbLink href="/riksdagen">Riksdagen</BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem>
      <BreadcrumbPage>Dokument</BreadcrumbPage>
    </BreadcrumbItem>
  </BreadcrumbList>
</Breadcrumb>
```

---

### 6. **Sidebar Navigation för Regeringskansliet**
**Problem:** 30+ dokumenttyper visas samtidigt = information overload
**Lösning:**
- Vänster sidebar med kategorier
- Klicka på kategori → visa dokumenttyper till höger
- Eller använd Tabs för olika kategorier
- Behåll endast 5-7 items synliga åt gången

**Före:** Allt på en gång (30+ kort)

**Efter:** Sidebar navigation
```tsx
<div className="flex gap-8">
  {/* Sidebar */}
  <aside className="w-64 sticky top-20 self-start">
    <nav className="space-y-2">
      <Button
        variant={category === 'legal' ? 'default' : 'ghost'}
        className="w-full justify-start"
        onClick={() => setCategory('legal')}
      >
        <Scale className="mr-2 h-4 w-4" />
        Rättsliga dokument (11)
      </Button>

      <Button
        variant={category === 'communication' ? 'default' : 'ghost'}
        className="w-full justify-start"
        onClick={() => setCategory('communication')}
      >
        <Newspaper className="mr-2 h-4 w-4" />
        Kommunikation (5)
      </Button>

      {/* ... etc */}
    </nav>
  </aside>

  {/* Main content - endast vald kategori */}
  <main className="flex-1">
    <h2>{categoryTitle}</h2>
    <div className="grid md:grid-cols-2 gap-4">
      {filteredItems.map(...)}
    </div>
  </main>
</div>
```

**Eller:** Tabs-baserad navigation
```tsx
<Tabs value={category} onValueChange={setCategory}>
  <TabsList className="mb-8">
    <TabsTrigger value="legal">Rättsliga (11)</TabsTrigger>
    <TabsTrigger value="communication">Kommunikation (5)</TabsTrigger>
    <TabsTrigger value="international">Internationellt (5)</TabsTrigger>
    <TabsTrigger value="other">Övrigt (7)</TabsTrigger>
  </TabsList>

  <TabsContent value="legal">
    {/* 11 items */}
  </TabsContent>
</Tabs>
```

---

## 📄 Innehållspresentation

### 7. **Förenkla Stats Cards på Riksdagen-sidan**
**Problem:** Stats cards tar mycket plats, färgkodning är felaktig
**Lösning:**
- Kompaktare design: 1 rad istället för 2x2 grid
- Ta bort färgkodning (info/success/warning/error är för status, inte kategorier)
- Visa endast siffra + ikon + label
- Eller flytta stats till en "Overview" sidebar

**Före:** 2x2 grid med stora kort

**Efter:** Kompakt 1-rad stats
```tsx
<div className="flex justify-center gap-8 mb-12 p-6 bg-muted/30 rounded-lg">
  <div className="text-center">
    <FileText className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
    <div className="text-3xl font-bold">{stats.dokument.toLocaleString()}</div>
    <div className="text-xs text-muted-foreground">Dokument</div>
  </div>

  <Separator orientation="vertical" className="h-16" />

  <div className="text-center">
    <Users className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
    <div className="text-3xl font-bold">{stats.ledamoter}</div>
    <div className="text-xs text-muted-foreground">Ledamöter</div>
  </div>

  {/* ... */}
</div>
```

---

### 8. **Kategorisering med Visuell Hierarki**
**Problem:** Alla sektioner har samma vikt visuellt
**Lösning:**
- Primära kategorier: Större, mer prominent
- Sekundära: Mindre, subtle
- "Populära" märkning på mest använda

**Exempel:**
```tsx
{/* Primära */}
<div className="grid md:grid-cols-2 gap-6 mb-8">
  <PrimaryCard
    title="Propositioner"
    count={1234}
    popular={true}
  />
  <PrimaryCard
    title="SOU"
    count={567}
    popular={true}
  />
</div>

{/* Sekundära - mindre, mer kompakt */}
<Accordion type="single" collapsible>
  <AccordionItem value="more">
    <AccordionTrigger>
      Fler dokumenttyper (25)
    </AccordionTrigger>
    <AccordionContent>
      <div className="grid grid-cols-3 gap-3">
        {/* Mindre kort */}
      </div>
    </AccordionContent>
  </AccordionItem>
</Accordion>
```

---

### 9. **Flytta Admin-verktyg till Admin-sida**
**Problem:** DataFetchButton, ProgressTracker, FileQueueManager visas för alla
**Lösning:**
- Visa dessa ENDAST på /admin
- Riksdagen/Regeringskansliet-sidorna blir renare
- Lättare att fokusera på innehåll

**Före:** Admin-verktyg på Riksdagen-sidan (för alla användare)

**Efter:** Endast på /admin
```tsx
// Riksdagen.tsx - CLEAN
const Riksdagen = () => {
  return (
    <div>
      <Header />
      <Stats />
      <Sections />
      {/* INGEN DataFetchButton, ProgressTracker, etc */}
    </div>
  );
};

// Admin.tsx - Alla admin-verktyg
const Admin = () => {
  return (
    <Tabs>
      <TabsList>
        <TabsTrigger value="riksdagen">Riksdagen</TabsTrigger>
        <TabsTrigger value="regeringen">Regeringen</TabsTrigger>
      </TabsList>

      <TabsContent value="riksdagen">
        <DataFetchButton />
        <ProgressTracker source="riksdagen" />
        <FileQueueManager />
        <DatabaseStats />
      </TabsContent>
    </Tabs>
  );
};
```

---

### 10. **Dokument-lista: Lägg till Filtrering & Sortering**
**Problem:** Lång lista utan sätt att filtrera eller sortera
**Lösning:**
- Filter sidebar: Dokumenttyp, Datum, Organ, Status
- Sortering: Nyast först, Äldst först, Alfabetisk
- Antal per sida: 10, 25, 50, 100
- Sökfält för att filtrera listan

**Implementation:**
```tsx
<div className="flex gap-6">
  {/* Filter sidebar */}
  <aside className="w-64 space-y-6">
    <div>
      <h3 className="font-semibold mb-3">Dokumenttyp</h3>
      <div className="space-y-2">
        <label className="flex items-center gap-2">
          <Checkbox checked={filters.prop} />
          Proposition
        </label>
        <label className="flex items-center gap-2">
          <Checkbox checked={filters.mot} />
          Motion
        </label>
        {/* ... */}
      </div>
    </div>

    <div>
      <h3 className="font-semibold mb-3">Period</h3>
      <Select value={filters.year}>
        <SelectTrigger>
          <SelectValue placeholder="Välj år" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="2024">2024</SelectItem>
          <SelectItem value="2023">2023</SelectItem>
        </SelectContent>
      </Select>
    </div>
  </aside>

  {/* Main list */}
  <main className="flex-1">
    <div className="flex justify-between mb-4">
      <div>Visar {count} dokument</div>
      <Select value={sort}>
        <SelectTrigger className="w-48">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="date-desc">Nyast först</SelectItem>
          <SelectItem value="date-asc">Äldst först</SelectItem>
          <SelectItem value="title">Alfabetisk</SelectItem>
        </SelectContent>
      </Select>
    </div>

    {/* Document list */}
  </main>
</div>
```

---

### 11. **Kompaktare Dokumentkort**
**Problem:** Varje dokument-kort tar mycket plats, för mycket metadata
**Lösning:**
- Table-view som alternativ till cards
- Compact mode: endast titel, typ, datum
- Expandable för att se mer detaljer
- "Öppna" knapp istället för 3 länkar (PDF/HTML/Text)

**Före:** Stora kort med all metadata synlig

**Efter:** Compact table
```tsx
<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Dokument</TableHead>
      <TableHead>Typ</TableHead>
      <TableHead>Datum</TableHead>
      <TableHead className="w-[100px]">Actions</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {documents.map(doc => (
      <TableRow key={doc.id} className="hover:bg-muted/50 cursor-pointer">
        <TableCell>
          <div className="font-medium">{doc.titel}</div>
          {doc.subtitel && (
            <div className="text-sm text-muted-foreground line-clamp-1">
              {doc.subtitel}
            </div>
          )}
        </TableCell>
        <TableCell>
          <Badge variant="outline">{doc.doktyp}</Badge>
        </TableCell>
        <TableCell className="text-sm text-muted-foreground">
          {formatDate(doc.datum)}
        </TableCell>
        <TableCell>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                Öppna <ChevronDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>
                <FileText className="mr-2" /> Visa PDF
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Code className="mr-2" /> Visa HTML
              </DropdownMenuItem>
              <DropdownMenuItem>
                <FileType className="mr-2" /> Visa Text
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Heart className="mr-2" /> Lägg till favoriter
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>

{/* Toggle view mode */}
<div className="flex gap-2">
  <Button
    variant={view === 'cards' ? 'default' : 'outline'}
    size="sm"
    onClick={() => setView('cards')}
  >
    <LayoutGrid className="h-4 w-4" />
  </Button>
  <Button
    variant={view === 'table' ? 'default' : 'outline'}
    size="sm"
    onClick={() => setView('table')}
  >
    <List className="h-4 w-4" />
  </Button>
</div>
```

---

## 🎯 Focus & Prioritering

### 12. **"Snabbgenvägar" på Riksdagen/Regeringskansliet**
**Problem:** Måste scrolla för att hitta populära sektioner
**Lösning:**
- "Populära sökningar" sektion högst upp
- Quick action cards för 3-4 mest använda funktioner
- Visar senaste aktivitet (vad som är nytt)

**Exempel:**
```tsx
<div className="mb-12 p-6 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-lg">
  <h3 className="font-semibold mb-4">Populärt just nu</h3>
  <div className="grid md:grid-cols-3 gap-4">
    <QuickActionCard
      icon={<Sparkles />}
      title="Budget 2024"
      description="Senaste budgetpropositioner"
      href="/riksdagen/dokument?filter=budget-2024"
    />
    <QuickActionCard
      icon={<TrendingUp />}
      title="Klimatdebatt"
      description="92 nya anföranden"
      href="/riksdagen/anforanden?topic=klimat"
    />
    <QuickActionCard
      icon={<Vote />}
      title="Röstningar idag"
      description="Se resultat från 5 voteringar"
      href="/riksdagen/voteringar?date=today"
    />
  </div>
</div>
```

---

### 13. **Förenkla Regeringskansliet-kortet på Startsidan**
**Problem:** "30+ dokumenttyper" skrämmer bort nya användare
**Lösning:**
- Visa endast 4 huvudkategorier på korthet
- "Utforska alla 30+ typer →" länk i stället
- Fokus på vad man KAN göra, inte antalet alternativ

**Före:**
```tsx
<InstitutionCard
  title="Regeringskansliet"
  description="Upptäck regeringens arbete och organisation..."
/>
```

**Efter:**
```tsx
<InstitutionCard
  title="Regeringskansliet"
  description="Sök i propositioner, SOU, pressmeddelanden och tal"
>
  <div className="mt-4 space-y-2 text-sm">
    <div className="flex items-center gap-2">
      <Check className="h-4 w-4 text-success" />
      <span>1,234 Propositioner</span>
    </div>
    <div className="flex items-center gap-2">
      <Check className="h-4 w-4 text-success" />
      <span>567 SOU</span>
    </div>
    <div className="flex items-center gap-2">
      <Check className="h-4 w-4 text-success" />
      <span>890 Pressmeddelanden</span>
    </div>
    <div className="text-xs text-muted-foreground mt-2">
      + 27 andra dokumenttyper
    </div>
  </div>
</InstitutionCard>
```

---

### 14. **Favoriter: Visa Direkt i Header**
**Problem:** Favoriter-knapp tar plats på startsidan
**Lösning:**
- Hjärt-ikon i header (räknare om >0)
- Dropdown med favoriter vid klick
- "Se alla favoriter →" länk i dropdown

**Implementation:**
```tsx
<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="ghost" size="icon" className="relative">
      <Heart className="h-5 w-5" />
      {favoritesCount > 0 && (
        <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs">
          {favoritesCount}
        </Badge>
      )}
    </Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent align="end" className="w-80">
    <DropdownMenuLabel>Mina favoriter</DropdownMenuLabel>
    <DropdownMenuSeparator />

    {favorites.slice(0, 5).map(fav => (
      <DropdownMenuItem key={fav.id} asChild>
        <Link to={fav.url}>
          <div className="flex-1">
            <div className="font-medium text-sm">{fav.title}</div>
            <div className="text-xs text-muted-foreground">{fav.type}</div>
          </div>
        </Link>
      </DropdownMenuItem>
    ))}

    <DropdownMenuSeparator />
    <DropdownMenuItem asChild>
      <Link to="/favorites" className="text-primary">
        Se alla favoriter ({favoritesCount}) →
      </Link>
    </DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

---

## 🎨 Visual Minimalism

### 15. **Ta Bort Redundant Information**
**Problem:** Dokument-kort visar organ, status, beteckning, subtitel, datum... allt samtidigt
**Lösning:**
- Primär info: Titel + Typ + Datum
- Sekundär info: Dölj som "Show more" eller tooltip
- Eller visa endast vid hover

**Före:** Allt syns direkt
```tsx
<Card>
  <div>
    <Badge>{doktyp}</Badge>
    <Badge>{beteckning}</Badge>
    <h3>{titel}</h3>
    <p>{subtitel}</p>
    <div>Datum: {datum}</div>
    <div>Organ: {organ}</div>
    <div>Status: {status}</div>
    <div>PDF | HTML | Text</div>
  </div>
</Card>
```

**Efter:** Minimalistiskt
```tsx
<Card className="group">
  <div className="flex justify-between items-start">
    <div className="flex-1">
      <Badge variant="outline" className="mb-2">{doktyp}</Badge>
      <h3 className="font-semibold line-clamp-2">{titel}</h3>
      <p className="text-xs text-muted-foreground mt-1">
        {formatDate(datum)}
      </p>
    </div>

    {/* Actions - visa vid hover */}
    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
      <Button variant="ghost" size="sm">
        Öppna
      </Button>
    </div>
  </div>

  {/* Expandable details */}
  {expanded && (
    <div className="mt-4 pt-4 border-t space-y-2 text-sm">
      <div><strong>Beteckning:</strong> {beteckning}</div>
      <div><strong>Organ:</strong> {organ}</div>
      <div><strong>Status:</strong> {status}</div>
    </div>
  )}
</Card>
```

---

### 16. **Whitespace & Breathing Room**
**Problem:** Cards är för tätt packade
**Lösning:**
- Öka gap mellan kort: 6 → 8
- Öka padding i kort: p-4 → p-6
- Mer vertikalt spacing mellan sektioner: mb-12 → mb-16
- Max-width på content containers

**CSS-ändringar:**
```tsx
// Före
<div className="grid md:grid-cols-2 gap-4">

// Efter
<div className="grid md:grid-cols-2 gap-8">

// Före
<Card className="p-4">

// Efter
<Card className="p-6 md:p-8">

// Före
<section className="mb-8">

// Efter
<section className="mb-16 md:mb-20">
```

---

### 17. **Förenkla Badge-användning**
**Problem:** För många badges, blir rörigt
**Lösning:**
- Max 1-2 badges per kort
- Använd endast för viktig kategorisering
- Små, diskreta badges
- Monochrome istället för färgade

**Före:** 3-4 badges
```tsx
<Badge variant="outline">{doktyp}</Badge>
<Badge variant="secondary">{beteckning}</Badge>
<Badge variant="info">{status}</Badge>
<Badge variant="success">{organ}</Badge>
```

**Efter:** 1 badge + text
```tsx
<Badge variant="outline" className="text-xs">{doktyp}</Badge>
<span className="text-xs text-muted-foreground ml-2">{beteckning}</span>
```

---

## 🚀 Call-to-Actions & Onboarding

### 18. **"Kom igång"-Guide för Nya Användare**
**Problem:** Ingen vägledning för nya användare
**Lösning:**
- Toast/banner vid första besöket
- "Vad vill du göra idag?" stepper
- Guided tour (optional)
- Quick start tips

**Implementation:**
```tsx
{isFirstVisit && (
  <Card className="mb-8 border-primary bg-primary/5">
    <CardHeader>
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <Lightbulb className="h-6 w-6 text-primary" />
          <div>
            <CardTitle>Välkommen till Riksdag & Regering!</CardTitle>
            <CardDescription>
              Här kan du söka i 500,000+ dokument från svenska myndigheter
            </CardDescription>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => dismissWelcome()}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </CardHeader>
    <CardContent>
      <div className="flex gap-3">
        <Button variant="default" asChild>
          <Link to="/riksdagen/dokument">
            Utforska dokument
          </Link>
        </Button>
        <Button variant="outline" asChild>
          <Link to="/om">
            Läs mer om sidan
          </Link>
        </Button>
      </div>
    </CardContent>
  </Card>
)}
```

---

### 19. **Tydliga CTAs på Varje Sida**
**Problem:** Oklart vad man ska göra härnäst
**Lösning:**
- Varje sida har en primär CTA
- Riksdagen → "Sök dokument"
- Regeringskansliet → "Utforska propositioner"
- Footer med "Nyhetsbrev" eller "Följ uppdateringar"

**Exempel:**
```tsx
// Riksdagen-sida
<div className="text-center mb-12">
  <Button size="lg" variant="gradient" asChild>
    <Link to="/riksdagen/dokument">
      <Search className="mr-2" />
      Sök i dokument
    </Link>
  </Button>
  <p className="text-sm text-muted-foreground mt-2">
    Tillgång till 120,000+ riksdagsdokument
  </p>
</div>

// Footer CTA
<footer className="border-t mt-24 py-12">
  <div className="container max-w-4xl text-center">
    <h3 className="text-2xl font-bold mb-2">Håll dig uppdaterad</h3>
    <p className="text-muted-foreground mb-6">
      Få notifikationer när nya propositioner publiceras
    </p>
    <div className="flex gap-2 max-w-md mx-auto">
      <Input placeholder="Din e-post" type="email" />
      <Button>Prenumerera</Button>
    </div>
  </div>
</footer>
```

---

### 20. **Empty States med Action**
**Problem:** Nuvarande empty state säger "inga dokument" men ger begränsad hjälp
**Lösning:**
- Förklara VARFÖR det är tomt
- Ge konkreta steg för att fixa
- Visuell illustration
- CTA-knapp för snabb lösning

**Före:**
```tsx
<EmptyState
  message="Inga dokument hittades"
  suggestion="Använd 'Hämta data'-knappen..."
/>
```

**Efter:**
```tsx
<div className="text-center py-16 max-w-lg mx-auto">
  <div className="mb-6">
    <Database className="h-16 w-16 mx-auto text-muted-foreground/50" />
  </div>

  <h2 className="text-2xl font-bold mb-2">Databasen är tom</h2>

  <p className="text-muted-foreground mb-6">
    Det finns ingen data i databasen ännu. Som admin kan du hämta data från Riksdagens API.
  </p>

  {isAdmin ? (
    <div className="space-y-3">
      <Button size="lg" variant="gradient" asChild>
        <Link to="/admin">
          <Download className="mr-2" />
          Gå till Admin & Hämta Data
        </Link>
      </Button>

      <p className="text-xs text-muted-foreground">
        Det tar cirka 5-10 minuter att hämta all data
      </p>
    </div>
  ) : (
    <Alert>
      <AlertDescription>
        Du måste vara inloggad som admin för att hämta data.
        <Button variant="link" asChild className="ml-2">
          <Link to="/login">Logga in →</Link>
        </Button>
      </AlertDescription>
    </Alert>
  )}

  {/* Optional: Demo video/screenshot */}
  <div className="mt-8">
    <p className="text-sm text-muted-foreground mb-2">Vill du veta mer?</p>
    <Button variant="outline" size="sm">
      Se demo-video
    </Button>
  </div>
</div>
```

---

## 📊 Sammanfattning av Förbättringar

### Prioritering

**🔥 Critical (Implementera först):**
1. ✅ #4 - Persistent header med navigation
2. ✅ #6 - Sidebar/Tabs för Regeringskansliet (minska overload)
3. ✅ #9 - Flytta admin-verktyg till /admin
4. ✅ #10 - Filtrering & sortering på dokument
5. ✅ #11 - Kompaktare dokumentkort/table view

**⚡ High Priority:**
6. ✅ #1 - Förbättrad hero med value proposition
7. ✅ #2 - Quick search på startsida
8. ✅ #5 - Breadcrumbs
9. ✅ #7 - Förenkla stats cards
10. ✅ #15 - Ta bort redundant info

**💡 Medium Priority:**
11. ✅ #3 - Featured innehåll på startsida
12. ✅ #8 - Visuell hierarki i kategorier
13. ✅ #12 - Snabbgenvägar/populärt just nu
14. ✅ #14 - Favoriter i header
15. ✅ #16 - Mer whitespace

**🎨 Nice to Have:**
16. ✅ #13 - Förenkla Regeringskansliet-kort
17. ✅ #17 - Förenkla badge-användning
18. ✅ #18 - Kom igång-guide
19. ✅ #19 - Tydliga CTAs
20. ✅ #20 - Förbättrade empty states

---

## 🎯 Målsättning

Efter implementering ska sidan:
- ✅ Ha tydlig navigation (header + breadcrumbs)
- ✅ Visa endast viktig info initialt (minimalism)
- ✅ Ge användare kontroll (filter, sort, view toggle)
- ✅ Fokusera på content, inte chrome
- ✅ Guida nya användare (onboarding)
- ✅ Vara snabb att scanna visuellt
- ✅ Ha tydliga next steps (CTAs)

---

## 📦 Nya Komponenter Behövs

1. **Header** komponent (persistent navigation)
2. **Breadcrumbs** komponent
3. **QuickActionCard** komponent
4. **FilterSidebar** komponent
5. **TableView** för dokument
6. **UserMenu** dropdown
7. **WelcomeBanner** för nya användare
8. **ImprovedEmptyState** med actions

---

## 🚀 Implementation Plan

### Fas 1: Navigation (2h)
- Skapa persistent header
- Lägg till breadcrumbs
- Flytta favoriter till header dropdown

### Fas 2: Regeringskansliet Cleanup (1.5h)
- Tabs eller sidebar för kategorier
- Visa max 7 items åt gången
- Flytta admin-verktyg till /admin

### Fas 3: Dokument-lista (2h)
- Filter sidebar
- Sortering dropdown
- Table view toggle
- Kompaktera kort-design

### Fas 4: Startsida (1.5h)
- Förbättrad hero
- Quick search
- Featured content
- Welcome banner

### Fas 5: Polish (1h)
- Whitespace fixes
- Badge cleanup
- CTAs
- Empty states

**Total tid: ~8 timmar**

---

**Datum:** 2025-11-01
**Version:** Structure v1.0
**Status:** 📝 Planerat - Redo för implementation
