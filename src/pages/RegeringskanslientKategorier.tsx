import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Tag } from "lucide-react";
import EmptyState from "@/components/EmptyState";
import FilterBar from "@/components/FilterBar";

const RegeringskanslientKategorier = () => {
  const [searchQuery, setSearchQuery] = useState("");
  
  const { data: kategorier, isLoading } = useQuery({
    queryKey: ['regeringskansliet-kategorier'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('regeringskansliet_kategorier')
        .select('*')
        .order('namn', { ascending: true });
      
      if (error) throw error;
      return data;
    },
  });

  const filteredKat = kategorier?.filter((k) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      k.namn?.toLowerCase().includes(searchLower) ||
      k.kod?.toLowerCase().includes(searchLower) ||
      k.beskrivning?.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="w-full bg-primary py-1"></div>
      
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        <header className="mb-12">
          <Link to="/regeringskansliet" className="text-primary hover:underline mb-4 inline-block">
            ← Tillbaka till Regeringskansliet
          </Link>
          <h1 className="text-4xl font-serif font-bold text-foreground mb-4">
            Kategorier
          </h1>
          <div className="w-20 h-1 bg-secondary mb-6"></div>
          <p className="text-muted-foreground">
            {filteredKat?.length || 0} dokumentkategorier
          </p>
        </header>

        <FilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          placeholder="Sök kategorier, kod..."
        />

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(12)].map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2" />
                </CardHeader>
              </Card>
            ))}
          </div>
        ) : filteredKat && filteredKat.length === 0 ? (
          <EmptyState
            message={searchQuery ? "Inga kategorier hittades" : "Inga kategorier i databasen"}
            suggestion={searchQuery ? "Prova att ändra din sökning" : "Använd 'Hämta data'-knappen för att ladda ned kategorier"}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredKat?.map((kat) => (
              <Card key={kat.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <Tag className="h-4 w-4 text-primary" />
                    <Badge variant="secondary">{kat.kod}</Badge>
                  </div>
                  <CardTitle className="text-lg">
                    {kat.namn || kat.kod}
                  </CardTitle>
                </CardHeader>
                {kat.beskrivning && (
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      {kat.beskrivning}
                    </p>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RegeringskanslientKategorier;
