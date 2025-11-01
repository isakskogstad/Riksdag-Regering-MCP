import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info, ExternalLink, Database, FileText, Users, Vote } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function RiksdagenApiInfo() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Info className="h-5 w-5" />
          Riksdagens öppna data - API-information
        </CardTitle>
        <CardDescription>
          Översikt över Riksdagens API:er och tillgänglig data
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Översikt</TabsTrigger>
            <TabsTrigger value="endpoints">Endpoints</TabsTrigger>
            <TabsTrigger value="parameters">Parametrar</TabsTrigger>
            <TabsTrigger value="codes">Koder</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                Riksdagens öppna data är ett REST-API som ger tillgång till dokument, ledamöter, 
                anföranden och voteringar från Sveriges riksdag. All data är fritt tillgänglig 
                under Creative Commons CC0-licens.
              </AlertDescription>
            </Alert>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2 p-4 border rounded-lg">
                <div className="flex items-center gap-2 font-semibold">
                  <FileText className="h-5 w-5" />
                  Dokument
                </div>
                <p className="text-sm text-muted-foreground">
                  API och dataset för dokument, bland annat riksdagsbeslut, propositioner, 
                  motioner och protokoll. Vissa dokumenttyper finns från 1961.
                </p>
                <a 
                  href="https://www.riksdagen.se/sv/dokument-och-lagar/riksdagens-oppna-data/dokument/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-sm text-primary hover:underline"
                >
                  Läs mer <ExternalLink className="ml-1 h-3 w-3" />
                </a>
              </div>

              <div className="space-y-2 p-4 border rounded-lg">
                <div className="flex items-center gap-2 font-semibold">
                  <Users className="h-5 w-5" />
                  Ledamöter
                </div>
                <p className="text-sm text-muted-foreground">
                  Information om alla ledamöter som sitter eller har suttit i riksdagen från 
                  omkring 1990. Inkluderar uppgifter om uppdrag och vad ledamoten sagt och gjort.
                </p>
                <a 
                  href="https://www.riksdagen.se/sv/dokument-och-lagar/riksdagens-oppna-data/ledamoter/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-sm text-primary hover:underline"
                >
                  Läs mer <ExternalLink className="ml-1 h-3 w-3" />
                </a>
              </div>

              <div className="space-y-2 p-4 border rounded-lg">
                <div className="flex items-center gap-2 font-semibold">
                  <Database className="h-5 w-5" />
                  Anföranden
                </div>
                <p className="text-sm text-muted-foreground">
                  Tal som riksdagsledamöterna håller under debatter i kammaren. 
                  Anföranden finns tillgängliga från riksmötet 1993/94 och framåt.
                </p>
                <a 
                  href="https://www.riksdagen.se/sv/dokument-och-lagar/riksdagens-oppna-data/anforanden/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-sm text-primary hover:underline"
                >
                  Läs mer <ExternalLink className="ml-1 h-3 w-3" />
                </a>
              </div>

              <div className="space-y-2 p-4 border rounded-lg">
                <div className="flex items-center gap-2 font-semibold">
                  <Vote className="h-5 w-5" />
                  Voteringar
                </div>
                <p className="text-sm text-muted-foreground">
                  Data om omröstningar i riksdagen. Visar hur ledamöter och partier 
                  röstat. Uppgifter finns från riksmötet 1993/94 och framåt.
                </p>
                <a 
                  href="https://www.riksdagen.se/sv/dokument-och-lagar/riksdagens-oppna-data/voteringar/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-sm text-primary hover:underline"
                >
                  Läs mer <ExternalLink className="ml-1 h-3 w-3" />
                </a>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="endpoints" className="space-y-4">
            <div className="space-y-4">
              <div className="p-4 border rounded-lg space-y-2">
                <code className="text-sm font-mono">https://data.riksdagen.se/dokumentlista/</code>
                <p className="text-sm text-muted-foreground">
                  Hämta dokument som propositioner, motioner, betänkanden m.m.
                </p>
              </div>

              <div className="p-4 border rounded-lg space-y-2">
                <code className="text-sm font-mono">https://data.riksdagen.se/personlista/</code>
                <p className="text-sm text-muted-foreground">
                  Hämta information om riksdagsledamöter och deras uppdrag
                </p>
              </div>

              <div className="p-4 border rounded-lg space-y-2">
                <code className="text-sm font-mono">https://data.riksdagen.se/anforandelista/</code>
                <p className="text-sm text-muted-foreground">
                  Hämta tal från debatter i riksdagen (anföranden)
                </p>
              </div>

              <div className="p-4 border rounded-lg space-y-2">
                <code className="text-sm font-mono">https://data.riksdagen.se/voteringlista/</code>
                <p className="text-sm text-muted-foreground">
                  Hämta omröstningsresultat med röster per ledamot
                </p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="parameters" className="space-y-4">
            <div className="space-y-3">
              <div className="grid grid-cols-[120px_1fr] gap-4 p-3 border rounded-lg">
                <code className="text-sm font-mono">rm</code>
                <p className="text-sm text-muted-foreground">
                  Riksmöte (t.ex. "2024/25", "2023/24")
                </p>
              </div>

              <div className="grid grid-cols-[120px_1fr] gap-4 p-3 border rounded-lg">
                <code className="text-sm font-mono">parti</code>
                <p className="text-sm text-muted-foreground">
                  Partifilter (S, M, SD, C, V, KD, L, MP)
                </p>
              </div>

              <div className="grid grid-cols-[120px_1fr] gap-4 p-3 border rounded-lg">
                <code className="text-sm font-mono">iid</code>
                <p className="text-sm text-muted-foreground">
                  Intressent-ID (unikt ID för ledamot)
                </p>
              </div>

              <div className="grid grid-cols-[120px_1fr] gap-4 p-3 border rounded-lg">
                <code className="text-sm font-mono">sz</code>
                <p className="text-sm text-muted-foreground">
                  Sidstorlek - antal resultat per sida (standard: 200)
                </p>
              </div>

              <div className="grid grid-cols-[120px_1fr] gap-4 p-3 border rounded-lg">
                <code className="text-sm font-mono">utformat</code>
                <p className="text-sm text-muted-foreground">
                  Format (xml, json, csv, html)
                </p>
              </div>

              <div className="grid grid-cols-[120px_1fr] gap-4 p-3 border rounded-lg">
                <code className="text-sm font-mono">from/tom</code>
                <p className="text-sm text-muted-foreground">
                  Datumintervall (YYYY-MM-DD)
                </p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="codes" className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-semibold">Partikoder</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {[
                    { code: "S", name: "Socialdemokraterna" },
                    { code: "M", name: "Moderaterna" },
                    { code: "SD", name: "Sverigedemokraterna" },
                    { code: "C", name: "Centerpartiet" },
                    { code: "V", name: "Vänsterpartiet" },
                    { code: "KD", name: "Kristdemokraterna" },
                    { code: "L", name: "Liberalerna" },
                    { code: "MP", name: "Miljöpartiet" },
                  ].map(parti => (
                    <div key={parti.code} className="p-2 border rounded text-sm">
                      <code className="font-mono font-bold">{parti.code}</code>
                      <p className="text-xs text-muted-foreground mt-1">{parti.name}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold">Dokumenttyper (exempel)</h4>
                <div className="space-y-2">
                  <div className="grid grid-cols-[80px_1fr] gap-4 p-2 border rounded text-sm">
                    <code className="font-mono">prop</code>
                    <span>Proposition</span>
                  </div>
                  <div className="grid grid-cols-[80px_1fr] gap-4 p-2 border rounded text-sm">
                    <code className="font-mono">mot</code>
                    <span>Motion</span>
                  </div>
                  <div className="grid grid-cols-[80px_1fr] gap-4 p-2 border rounded text-sm">
                    <code className="font-mono">bet</code>
                    <span>Betänkande</span>
                  </div>
                  <div className="grid grid-cols-[80px_1fr] gap-4 p-2 border rounded text-sm">
                    <code className="font-mono">ip</code>
                    <span>Interpellation</span>
                  </div>
                </div>
              </div>

              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  <p className="font-semibold mb-2">Dokument-ID struktur</p>
                  <p className="text-sm">
                    Alla dokument har ett unikt ID som består av tre delar: 
                    riksmöte/år-kod + dokumentserie + dokumentbeteckning
                  </p>
                  <code className="text-xs mt-2 block">Exempel: GZ01MJU21</code>
                </AlertDescription>
              </Alert>
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-6 pt-6 border-t">
          <h4 className="font-semibold mb-2">Externa länkar</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <a 
                href="https://www.riksdagen.se/sv/dokument-och-lagar/riksdagens-oppna-data/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-primary hover:underline"
              >
                Riksdagens öppna data <ExternalLink className="ml-1 h-3 w-3" />
              </a>
            </li>
            <li>
              <a 
                href="https://data.riksdagen.se/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-primary hover:underline"
              >
                API-portal <ExternalLink className="ml-1 h-3 w-3" />
              </a>
            </li>
            <li>
              <a 
                href="https://www.riksdagen.se/sv/dokument-och-lagar/riksdagens-oppna-data/anvandarstod/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-primary hover:underline"
              >
                Användarstöd och dokumentation <ExternalLink className="ml-1 h-3 w-3" />
              </a>
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
