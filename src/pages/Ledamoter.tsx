import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import FilterBar from "@/components/FilterBar";
import EmptyState from "@/components/EmptyState";
import { SagtOchGjortStats } from "@/components/SagtOchGjortStats";

interface Ledamot {
  id: string;
  intressent_id: string;
  fornamn: string;
  efternamn: string;
  tilltalsnamn?: string;
  parti?: string;
  valkrets?: string;
  bild_url?: string;
  local_bild_url?: string;
  status?: string;
}

const Ledamoter = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLedamot, setSelectedLedamot] = useState<Ledamot | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const { data: ledamoter, isLoading } = useQuery({
    queryKey: ['ledamoter'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('riksdagen_ledamoter')
        .select('*')
        .order('efternamn', { ascending: true });
      
      if (error) throw error;
      return data;
    },
  });

  const partiColors: Record<string, string> = {
    'S': 'bg-red-600',
    'M': 'bg-blue-600',
    'SD': 'bg-yellow-600',
    'C': 'bg-green-600',
    'V': 'bg-red-700',
    'KD': 'bg-blue-800',
    'L': 'bg-blue-400',
    'MP': 'bg-green-500',
  };

  const filteredLedamoter = ledamoter?.filter((l) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      l.fornamn?.toLowerCase().includes(searchLower) ||
      l.efternamn?.toLowerCase().includes(searchLower) ||
      l.parti?.toLowerCase().includes(searchLower) ||
      l.valkrets?.toLowerCase().includes(searchLower)
    );
  });

  const handleLedamotClick = (ledamot: Ledamot) => {
    setSelectedLedamot(ledamot);
    setDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="w-full bg-primary py-1"></div>
      
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        <header className="mb-12">
          <Link to="/riksdagen" className="text-primary hover:underline mb-4 inline-block">
            ← Tillbaka till Riksdagen
          </Link>
          <h1 className="text-4xl font-serif font-bold text-foreground mb-4">
            Riksdagens Ledamöter
          </h1>
          <div className="w-20 h-1 bg-secondary mb-6"></div>
          <p className="text-muted-foreground">
            {filteredLedamoter?.length || 0} ledamöter i riksdagen
          </p>
        </header>

        <FilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          placeholder="Sök ledamot, parti eller valkrets..."
        />

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {[...Array(12)].map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-24 w-24 rounded-full mx-auto mb-4" />
                  <Skeleton className="h-6 w-3/4 mx-auto mb-2" />
                  <Skeleton className="h-4 w-1/2 mx-auto" />
                </CardHeader>
              </Card>
            ))}
          </div>
        ) : filteredLedamoter && filteredLedamoter.length === 0 ? (
          <EmptyState
            message={searchQuery ? "Inga ledamöter hittades" : "Inga ledamöter i databasen"}
            suggestion={searchQuery ? "Prova att ändra din sökning" : "Använd 'Hämta data'-knappen på Riksdagen-sidan för att ladda ned ledamöter"}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredLedamoter?.map((ledamot) => (
              <Card
                key={ledamot.id}
                className="hover:shadow-lg transition-all cursor-pointer hover:scale-[1.02]"
                onClick={() => handleLedamotClick(ledamot)}
              >
                <CardHeader className="text-center">
                  <Avatar className="h-24 w-24 mx-auto mb-4">
                    <AvatarImage 
                      src={ledamot.local_bild_url || ledamot.bild_url || undefined} 
                      alt={`${ledamot.fornamn} ${ledamot.efternamn}`} 
                    />
                    <AvatarFallback>
                      {ledamot.fornamn?.[0]}{ledamot.efternamn?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  <CardTitle className="text-lg">
                    {ledamot.tilltalsnamn || ledamot.fornamn} {ledamot.efternamn}
                  </CardTitle>
                  <div className="flex flex-col gap-2 items-center mt-2">
                    {ledamot.parti && (
                      <Badge className={`${partiColors[ledamot.parti] || 'bg-gray-600'} text-white`}>
                        {ledamot.parti}
                      </Badge>
                    )}
                    {ledamot.valkrets && (
                      <span className="text-sm text-muted-foreground">
                        {ledamot.valkrets}
                      </span>
                    )}
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        )}

        {/* Ledamot details dialog */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            {selectedLedamot && (
              <>
                <DialogHeader>
                  <div className="flex items-center gap-4 mb-4">
                    <Avatar className="h-20 w-20">
                      <AvatarImage
                        src={selectedLedamot.local_bild_url || selectedLedamot.bild_url || undefined}
                        alt={`${selectedLedamot.fornamn} ${selectedLedamot.efternamn}`}
                      />
                      <AvatarFallback className="text-2xl">
                        {selectedLedamot.fornamn?.[0]}{selectedLedamot.efternamn?.[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <DialogTitle className="text-2xl">
                        {selectedLedamot.tilltalsnamn || selectedLedamot.fornamn} {selectedLedamot.efternamn}
                      </DialogTitle>
                      <DialogDescription className="flex items-center gap-2 mt-2">
                        {selectedLedamot.parti && (
                          <Badge className={`${partiColors[selectedLedamot.parti] || 'bg-gray-600'} text-white`}>
                            {selectedLedamot.parti}
                          </Badge>
                        )}
                        {selectedLedamot.valkrets && (
                          <span className="text-sm">{selectedLedamot.valkrets}</span>
                        )}
                      </DialogDescription>
                    </div>
                  </div>
                </DialogHeader>

                {/* Statistics */}
                <div className="mt-6">
                  <SagtOchGjortStats intressentId={selectedLedamot.intressent_id} />
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Ledamoter;
