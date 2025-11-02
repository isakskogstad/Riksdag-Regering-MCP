import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Calendar, ExternalLink, FileText, Download } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { sv } from "date-fns/locale";
import EmptyState from "@/components/EmptyState";
import FilterBar from "@/components/FilterBar";
import { getAbsoluteUrl } from "@/utils/urlHelpers";

const RegeringskanslientPropositioner = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: propositioner, isLoading } = useQuery({
    queryKey: ['propositioner'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('regeringskansliet_propositioner')
        .select('*')
        .order('publicerad_datum', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const filteredProp = propositioner?.filter((p) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      p.titel?.toLowerCase().includes(searchLower) ||
      p.departement?.toLowerCase().includes(searchLower) ||
      p.beteckningsnummer?.toLowerCase().includes(searchLower)
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
            Propositioner
          </h1>
          <div className="w-20 h-1 bg-secondary mb-6"></div>
          <p className="text-muted-foreground">
            {filteredProp?.length || 0} propositioner från regeringen
          </p>
        </header>

        <FilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          placeholder="Sök propositioner, beteckningsnummer..."
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
        ) : filteredProp && filteredProp.length === 0 ? (
          <EmptyState
            message={searchQuery ? "Inga propositioner hittades" : "Inga propositioner i databasen"}
            suggestion={searchQuery ? "Prova att ändra din sökning" : "Använd 'Hämta data'-knappen för att ladda ned propositioner"}
          />
        ) : (
          <div className="space-y-4">
            {filteredProp?.map((prop) => (
              <Card key={prop.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        {prop.beteckningsnummer && (
                          <Badge variant="outline">
                            <FileText className="h-3 w-3 mr-1" />
                            {prop.beteckningsnummer}
                          </Badge>
                        )}
                        {prop.departement && (
                          <Badge variant="secondary">{prop.departement}</Badge>
                        )}
                      </div>
                      <CardTitle className="text-xl mb-3">
                        {prop.titel || 'Proposition'}
                      </CardTitle>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        {prop.publicerad_datum && (
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {formatDistanceToNow(new Date(prop.publicerad_datum), {
                              addSuffix: true,
                              locale: sv
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      {prop.local_pdf_url && (
                        <a
                          href={prop.local_pdf_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-sm text-primary hover:underline font-medium"
                        >
                          PDF (Lokal) <Download className="h-3 w-3" />
                        </a>
                      )}
                      {prop.url && (
                        <a
                          href={getAbsoluteUrl(prop.url) || '#'}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-sm text-primary hover:underline"
                        >
                          Läs mer <ExternalLink className="h-3 w-3" />
                        </a>
                      )}
                      {prop.pdf_url && !prop.local_pdf_url && (
                        <a
                          href={getAbsoluteUrl(prop.pdf_url) || '#'}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-sm text-primary hover:underline"
                        >
                          PDF <Download className="h-3 w-3" />
                        </a>
                      )}
                    </div>
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

export default RegeringskanslientPropositioner;
