import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Play, Info, AlertCircle } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { riksdagenFetchSchema, validateInput, type RiksdagenFetchInput } from "@/lib/validationSchemas";

interface FetchConfig {
  dataType: string;
  rm?: string;           // Riksmöte (t.ex. "2024/25")
  parti?: string;        // Parti (t.ex. "S", "M", "SD")
  iid?: string;          // Intressent ID (ledamots-ID)
  from?: string;         // Från datum
  tom?: string;          // Till datum
  sz?: string;           // Antal per sida
  doktyp?: string;       // Dokumenttyp
}

const PARTI_OPTIONS = [
  { value: "S", label: "Socialdemokraterna (S)" },
  { value: "M", label: "Moderaterna (M)" },
  { value: "SD", label: "Sverigedemokraterna (SD)" },
  { value: "C", label: "Centerpartiet (C)" },
  { value: "V", label: "Vänsterpartiet (V)" },
  { value: "KD", label: "Kristdemokraterna (KD)" },
  { value: "L", label: "Liberalerna (L)" },
  { value: "MP", label: "Miljöpartiet (MP)" },
];

const RIKSMOTE_OPTIONS = [
  "2024/25", "2023/24", "2022/23", "2021/22", "2020/21",
  "2019/20", "2018/19", "2017/18", "2016/17", "2015/16"
];

export default function RiksdagenDataFetchConfig() {
  const { toast } = useToast();
  const [loading, setLoading] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [config, setConfig] = useState<FetchConfig>({
    dataType: "anforanden",
    sz: "200"
  });

  const fetchData = async () => {
    if (!config.dataType) return;
    
    // Validera input med Zod
    const validation = validateInput(riksdagenFetchSchema, config);
    if (!validation.success) {
      setValidationError(validation.error);
      toast({
        title: "Valideringsfel",
        description: validation.error,
        variant: "destructive",
      });
      return;
    }
    
    setValidationError(null);
    setLoading(config.dataType);
    
    try {
      // Prepare request body
      const requestBody: any = {
        dataType: config.dataType,
        paginate: true,
      };
      
      // Add filters if they exist
      if (config.rm) requestBody.rm = config.rm;
      if (config.parti) requestBody.parti = config.parti;
      if (config.iid) requestBody.iid = config.iid;
      if (config.from) requestBody.from = config.from;
      if (config.tom) requestBody.tom = config.tom;
      if (config.sz) requestBody.sz = config.sz;
      if (config.doktyp) requestBody.doktyp = config.doktyp;

      const { data, error } = await supabase.functions.invoke('fetch-riksdagen-data', {
        body: requestBody
      });

      if (error) throw error;

      if (data.success) {
        toast({
          title: "Hämtning startad",
          description: data.message || `Hämtar ${config.dataType} data från Riksdagen`,
        });
      } else {
        throw new Error(data.message || "Okänt fel");
      }
    } catch (error) {
      console.error("Fetch error:", error);
      toast({
        title: "Fel vid hämtning",
        description: error instanceof Error ? error.message : "Ett fel uppstod",
        variant: "destructive",
      });
    } finally {
      setLoading(null);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Riksdagens öppna data - Avancerad hämtning</CardTitle>
        <CardDescription>
          Konfigurera och hämta data från Riksdagens API med filtreringsmöjligheter
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Datatyp */}
        <div className="space-y-2">
          <Label htmlFor="dataType">Datatyp</Label>
          <Select
            value={config.dataType}
            onValueChange={(value) => setConfig({ ...config, dataType: value })}
          >
            <SelectTrigger id="dataType">
              <SelectValue placeholder="Välj datatyp" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="anforanden">Anföranden (Tal i kammaren)</SelectItem>
              <SelectItem value="voteringar">Voteringar (Omröstningar)</SelectItem>
              <SelectItem value="dokument">Dokument</SelectItem>
              <SelectItem value="ledamoter">Ledamöter (Riksdagsledamöter)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Filtreringsalternativ */}
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="filters">
            <AccordionTrigger>
              <div className="flex items-center gap-2">
                <Info className="h-4 w-4" />
                Filtreringsalternativ (valfritt)
              </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-4 pt-4">
              {/* Riksmöte */}
              <div className="space-y-2">
                <Label htmlFor="rm">Riksmöte</Label>
                <Select
                  value={config.rm || ""}
                  onValueChange={(value) => setConfig({ ...config, rm: value || undefined })}
                >
                  <SelectTrigger id="rm">
                    <SelectValue placeholder="Välj riksmöte (alla)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Alla riksmöten</SelectItem>
                    {RIKSMOTE_OPTIONS.map(rm => (
                      <SelectItem key={rm} value={rm}>{rm}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Parti */}
              <div className="space-y-2">
                <Label htmlFor="parti">Parti</Label>
                <Select
                  value={config.parti || ""}
                  onValueChange={(value) => setConfig({ ...config, parti: value || undefined })}
                >
                  <SelectTrigger id="parti">
                    <SelectValue placeholder="Välj parti (alla)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Alla partier</SelectItem>
                    {PARTI_OPTIONS.map(parti => (
                      <SelectItem key={parti.value} value={parti.value}>
                        {parti.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Intressent ID */}
              <div className="space-y-2">
                <Label htmlFor="iid">Ledamots-ID (Intressent ID)</Label>
                <Input
                  id="iid"
                  placeholder="t.ex. 0746469840917"
                  value={config.iid || ""}
                  onChange={(e) => setConfig({ ...config, iid: e.target.value || undefined })}
                />
                <p className="text-xs text-muted-foreground">
                  Hitta ledamots-ID på Riksdagens webbplats eller genom ledamötslistan
                </p>
              </div>

              {/* Datumintervall */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="from">Från datum</Label>
                  <Input
                    id="from"
                    type="date"
                    value={config.from || ""}
                    onChange={(e) => setConfig({ ...config, from: e.target.value || undefined })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tom">Till datum</Label>
                  <Input
                    id="tom"
                    type="date"
                    value={config.tom || ""}
                    onChange={(e) => setConfig({ ...config, tom: e.target.value || undefined })}
                  />
                </div>
              </div>

              {/* Antal per sida */}
              <div className="space-y-2">
                <Label htmlFor="sz">Antal resultat per sida</Label>
                <Select
                  value={config.sz || "200"}
                  onValueChange={(value) => setConfig({ ...config, sz: value })}
                >
                  <SelectTrigger id="sz">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="50">50</SelectItem>
                    <SelectItem value="100">100</SelectItem>
                    <SelectItem value="200">200 (rekommenderad)</SelectItem>
                    <SelectItem value="500">500</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        {/* Valideringsfel */}
        {validationError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{validationError}</AlertDescription>
          </Alert>
        )}

        {/* Information om vald konfiguration */}
        <div className="rounded-lg bg-muted p-4 space-y-2">
          <h4 className="font-medium text-sm">Aktiv konfiguration:</h4>
          <div className="text-sm text-muted-foreground space-y-1">
            <p><strong>Datatyp:</strong> {config.dataType}</p>
            {config.rm && <p><strong>Riksmöte:</strong> {config.rm}</p>}
            {config.parti && <p><strong>Parti:</strong> {config.parti}</p>}
            {config.iid && <p><strong>Ledamots-ID:</strong> {config.iid}</p>}
            {(config.from || config.tom) && (
              <p><strong>Period:</strong> {config.from || "början"} - {config.tom || "nu"}</p>
            )}
            <p><strong>Resultat per sida:</strong> {config.sz || "200"}</p>
          </div>
        </div>

        {/* Hämtningsknapp */}
        <Button 
          onClick={fetchData} 
          disabled={!!loading || !config.dataType}
          className="w-full"
          size="lg"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Hämtar data...
            </>
          ) : (
            <>
              <Play className="mr-2 h-4 w-4" />
              Starta hämtning
            </>
          )}
        </Button>

        {/* Hjälptext */}
        <div className="text-sm text-muted-foreground space-y-2">
          <p><strong>Tips:</strong></p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>Hämtning sker i batcher för att undvika timeout</li>
            <li>Data uppdateras automatiskt när ny information finns tillgänglig</li>
            <li>Använd filtrering för att begränsa mängden data som hämtas</li>
            <li>Anföranden finns från riksmötet 1993/94 och framåt</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
