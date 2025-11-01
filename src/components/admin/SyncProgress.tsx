import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SyncProgressProps {
  source: "riksdagen" | "regeringskansliet";
}

export const SyncProgress = ({ source }: SyncProgressProps) => {
  const [isSyncing, setIsSyncing] = useState(false);
  const { toast } = useToast();

  const syncProgress = async () => {
    setIsSyncing(true);
    try {
      const tables = source === "riksdagen" 
        ? ["riksdagen_dokument", "riksdagen_ledamoter", "riksdagen_anforanden", "riksdagen_voteringar"]
        : [
            "regeringskansliet_dokument", "regeringskansliet_pressmeddelanden", 
            "regeringskansliet_propositioner", "regeringskansliet_kategorier",
            "regeringskansliet_departementsserien", "regeringskansliet_skrivelse",
            "regeringskansliet_sou", "regeringskansliet_tal", "regeringskansliet_remisser",
            "regeringskansliet_kommittedirektiv", "regeringskansliet_faktapromemoria",
            "regeringskansliet_informationsmaterial", "regeringskansliet_mr_granskningar",
            "regeringskansliet_dagordningar", "regeringskansliet_rapporter",
            "regeringskansliet_regeringsuppdrag", "regeringskansliet_regeringsarenden",
            "regeringskansliet_sakrad", "regeringskansliet_bistands_strategier",
            "regeringskansliet_overenskommelser_avtal", "regeringskansliet_arendeforteckningar",
            "regeringskansliet_artiklar", "regeringskansliet_debattartiklar",
            "regeringskansliet_ud_avrader", "regeringskansliet_uttalanden",
            "regeringskansliet_lagradsremiss", "regeringskansliet_forordningsmotiv",
            "regeringskansliet_internationella_overenskommelser"
          ];

      for (const table of tables) {
        const { count } = await supabase
          .from(table as any)
          .select("*", { count: "exact", head: true });

        // Konvertera tabellnamn till dataType med bindestreck (konsistent med Edge Functions)
        const dataType = table
          .replace(`${source}_`, "")
          .replace(/_/g, "-"); // Konvertera understreck till bindestreck

        await supabase
          .from("data_fetch_progress")
          .upsert(
            {
              source,
              data_type: dataType,
              items_fetched: count || 0,
              total_items: count || 0,
              status: count && count > 0 ? "completed" : "pending",
              current_page: 1,
              total_pages: 1,
            },
            { onConflict: "source,data_type" }
          );
      }

      toast({
        title: "Progress synkad",
        description: `Progress-data har uppdaterats för ${source}`,
      });
    } catch (error: any) {
      toast({
        title: "Fel vid synkning",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Synka progress-data</CardTitle>
        <CardDescription>
          Räkna faktiska poster i databasen och uppdatera progress
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button onClick={syncProgress} disabled={isSyncing}>
          <RefreshCw className={`h-4 w-4 mr-2 ${isSyncing ? "animate-spin" : ""}`} />
          {isSyncing ? "Synkar..." : "Synka progress"}
        </Button>
      </CardContent>
    </Card>
  );
};