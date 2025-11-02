import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Calendar, ExternalLink, Building2, FileText } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { sv } from "date-fns/locale";
import EmptyState from "@/components/EmptyState";
import FilterBar from "@/components/FilterBar";
import { getAbsoluteUrl } from "@/utils/urlHelpers";

const Pressmeddelanden = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: pressmeddelanden, isLoading } = useQuery({
    queryKey: ['pressmeddelanden'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('regeringskansliet_pressmeddelanden')
        .select('*')
        .order('publicerad_datum', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const filteredPress = pressmeddelanden?.filter((p) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      p.titel?.toLowerCase().includes(searchLower) ||
      p.departement?.toLowerCase().includes(searchLower) ||
      p.innehall?.toLowerCase().includes(searchLower)
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
            Pressmeddelanden
          </h1>
          <div className="w-20 h-1 bg-secondary mb-6"></div>
          <p className="text-muted-foreground">
            {filteredPress?.length || 0} pressmeddelanden från regeringen
          </p>
        </header>

        <FilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          placeholder="Sök pressmeddelanden, departement..."
        />

        {isLoading ? (
          <div className="space-y-4">
            {[...Array(10)].map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2" />
                </CardHeader>
              </Card>
            ))}
          </div>
        ) : filteredPress && filteredPress.length === 0 ? (
          <EmptyState
            message={searchQuery ? "Inga pressmeddelanden hittades" : "Inga pressmeddelanden i databasen"}
            suggestion={searchQuery ? "Prova att ändra din sökning" : "Använd 'Hämta data'-knappen för att ladda ned pressmeddelanden"}
          />
        ) : (
          <div className="space-y-4">
            {filteredPress?.map((press) => (
              <Card key={press.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        {press.departement && (
                          <Badge variant="outline" className="gap-1">
                            <Building2 className="h-3 w-3" />
                            {press.departement}
                          </Badge>
                        )}
                      </div>
                      <CardTitle className="text-xl mb-2">
                        {press.titel || 'Pressmeddelande'}
                      </CardTitle>
                      {press.innehall && (
                        <CardDescription className="text-base line-clamp-2">
                          {press.innehall}
                        </CardDescription>
                      )}
                      <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                        {press.publicerad_datum && (
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {formatDistanceToNow(new Date(press.publicerad_datum), {
                              addSuffix: true,
                              locale: sv
                            })}
                          </div>
                        )}
                      </div>
                      {press.local_bilagor && Array.isArray(press.local_bilagor) && press.local_bilagor.length > 0 && (
                        <div className="mt-3 pt-3 border-t">
                          <p className="text-sm font-medium mb-2">Nedladdade bilagor:</p>
                          <div className="flex flex-wrap gap-2">
                            {press.local_bilagor.map((bilaga: any, idx: number) => (
                              <a
                                key={idx}
                                href={bilaga.local_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1 text-xs text-primary hover:underline"
                              >
                                <FileText className="h-3 w-3" />
                                {bilaga.filename}
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    {press.url && (
                      <a
                        href={getAbsoluteUrl(press.url) || '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-sm text-primary hover:underline"
                      >
                        Läs mer <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Pressmeddelanden;
