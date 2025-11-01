import { useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Download, Loader2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface DataFetchButtonProps {
  type?: 'riksdagen' | 'regeringskansliet';
}

const DataFetchButton = ({ type = 'riksdagen' }: DataFetchButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [activeDataType, setActiveDataType] = useState<string | null>(null);
  const { toast } = useToast();

  const stopFetching = async (dataType: string) => {
    try {
      const source = type === 'riksdagen' ? 'riksdagen' : 'regeringskansliet';
      const { error } = await supabase
        .from('data_fetch_control')
        .upsert({
          source,
          data_type: dataType,
          should_stop: true
        }, { onConflict: 'source,data_type' });

      if (error) throw error;

      toast({
        title: "Stoppsignal skickad",
        description: "Datahämtningen stoppas vid nästa kontrollpunkt",
      });
      
      setActiveDataType(null);
    } catch (error: any) {
      toast({
        title: "Fel vid stopp",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const fetchData = async (dataType: string, paginate: boolean = true) => {
    setIsLoading(true);
    setActiveDataType(dataType);
    const functionName = type === 'riksdagen' ? 'fetch-riksdagen-data' : 'fetch-regeringskansliet-data';
    
    // Reset stop signal innan vi börjar
    const source = type === 'riksdagen' ? 'riksdagen' : 'regeringskansliet';
    await supabase
      .from('data_fetch_control')
      .upsert({
        source,
        data_type: dataType,
        should_stop: false
      }, { onConflict: 'source,data_type' });
    
    try {
      const { data, error } = await supabase.functions.invoke(functionName, {
        body: { 
          dataType,
          paginate: paginate,
          maxPages: paginate ? null : 1
        }
      });

      if (error) throw error;

      const pages = data.pages ? ` (${data.pages} sidor)` : '';
      const errors = data.errors > 0 ? `, ${data.errors} fel` : '';
      
      toast({
        title: "Data hämtad!",
        description: `${data.inserted} ${dataType} hämtades${pages}${errors}`,
      });
    } catch (error: any) {
      toast({
        title: "Fel vid hämtning",
        description: error.message || "Kunde inte hämta data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setActiveDataType(null);
    }
  };

  return (
    <div className="flex gap-2 items-center">
      {isLoading && activeDataType && (
        <Button 
          variant="destructive" 
          size="sm"
          onClick={() => stopFetching(activeDataType)}
        >
          Stoppa hämtning
        </Button>
      )}
      <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="sm"
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : (
            <Download className="h-4 w-4 mr-2" />
          )}
          Hämta data
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="max-h-[400px] overflow-y-auto">
        {type === 'riksdagen' ? (
          <>
            <DropdownMenuItem onClick={() => fetchData('dokument')}>
              Hämta dokument
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => fetchData('ledamoter')}>
              Hämta ledamöter
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => fetchData('anforanden')}>
              Hämta anföranden
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => fetchData('voteringar')}>
              Hämta voteringar
            </DropdownMenuItem>
          </>
        ) : (
          <>
            <DropdownMenuItem onClick={() => fetchData('pressmeddelanden')}>
              Pressmeddelanden
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => fetchData('propositioner')}>
              Propositioner
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => fetchData('dokument')}>
              Alla dokument
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => fetchData('kategorier')}>
              Kategorier
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => fetchData('departementsserien')}>
              Departementsserien
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => fetchData('forordningsmotiv')}>
              Förordningsmotiv
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => fetchData('kommittedirektiv')}>
              Kommittédirektiv
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => fetchData('lagradsremiss')}>
              Lagradsremiss
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => fetchData('skrivelse')}>
              Skrivelser
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => fetchData('sou')}>
              SOU (Statens offentliga utredningar)
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => fetchData('internationella-overenskommelser')}>
              Internationella överenskommelser
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => fetchData('faktapromemoria')}>
              Faktapromemoria
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => fetchData('informationsmaterial')}>
              Informationsmaterial
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => fetchData('mr-granskningar')}>
              MR-granskningar
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => fetchData('dagordningar')}>
              Kommenterade dagordningar
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => fetchData('rapporter')}>
              Rapporter
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => fetchData('remisser')}>
              Remisser
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => fetchData('regeringsuppdrag')}>
              Regeringsuppdrag
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => fetchData('regeringsarenden')}>
              Regeringsärenden
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => fetchData('sakrad')}>
              Sakråd
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => fetchData('bistands-strategier')}>
              Biståndsstrategier
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => fetchData('overenskommelser-avtal')}>
              Överenskommelser och avtal
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => fetchData('arendeforteckningar')}>
              Ärendeförteckningar
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => fetchData('artiklar')}>
              Artiklar
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => fetchData('debattartiklar')}>
              Debattartiklar
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => fetchData('tal')}>
              Tal
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => fetchData('ud-avrader')}>
              UD avråder
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => fetchData('uttalanden')}>
              Uttalanden
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
    </div>
  );
};

export default DataFetchButton;
