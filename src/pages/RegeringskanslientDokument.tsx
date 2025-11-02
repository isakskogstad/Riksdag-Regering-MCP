import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Calendar, ExternalLink, FileText } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { sv } from "date-fns/locale";
import EmptyState from "@/components/EmptyState";
import FilterBar from "@/components/FilterBar";
import { getAbsoluteUrl } from "@/utils/urlHelpers";

const RegeringskanslientDokument = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: dokument, isLoading } = useQuery({
    queryKey: ['regeringskansliet-dokument'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('regeringskansliet_dokument')
        .select('*')
        .order('publicerad_datum', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const filteredDok = dokument?.filter((d) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      d.titel?.toLowerCase().includes(searchLower) ||
      d.avsandare?.toLowerCase().includes(searchLower) ||
      d.typ?.toLowerCase().includes(searchLower) ||
      d.beteckningsnummer?.toLowerCase().includes(searchLower)
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
            Dokument
          </h1>
          <div className="w-20 h-1 bg-secondary mb-6"></div>
          <p className="text-muted-foreground">
            {filteredDok?.length || 0} dokument från regeringen.se
          </p>
        </header>

        <FilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          placeholder="Sök dokument, typ, avsändare..."
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
        ) : filteredDok && filteredDok.length === 0 ? (
          <EmptyState
            message={searchQuery ? "Inga dokument hittades" : "Inga dokument i databasen"}
            suggestion={searchQuery ? "Prova att ändra din sökning" : "Använd 'Hämta data'-knappen för att ladda ned dokument"}
          />
        ) : (
          <div className="space-y-4">
            {filteredDok?.map((dok) => (
              <Card key={dok.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        {dok.typ && (
                          <Badge variant="outline">
                            <FileText className="h-3 w-3 mr-1" />
                            {dok.typ}
                          </Badge>
                        )}
                        {dok.beteckningsnummer && (
                          <Badge variant="secondary">{dok.beteckningsnummer}</Badge>
                        )}
                        {dok.kategorier && dok.kategorier.length > 0 && (
                          dok.kategorier.slice(0, 2).map((kat, idx) => (
                            <Badge key={idx} variant="outline">{kat}</Badge>
                          ))
                        )}
                      </div>
                      <CardTitle className="text-xl mb-2">
                        {dok.titel || 'Dokument'}
                      </CardTitle>
                      {dok.avsandare && (
                        <CardDescription className="mb-2">
                          Avsändare: {dok.avsandare}
                        </CardDescription>
                      )}
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        {dok.publicerad_datum && (
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {formatDistanceToNow(new Date(dok.publicerad_datum), {
                              addSuffix: true,
                              locale: sv
                            })}
                          </div>
                        )}
                      </div>
                      {dok.local_files && Array.isArray(dok.local_files) && dok.local_files.length > 0 && (
                        <div className="mt-3 pt-3 border-t">
                          <p className="text-sm font-medium mb-2">Nedladdade filer:</p>
                          <div className="flex flex-wrap gap-2">
                            {dok.local_files.map((file: any, idx: number) => (
                              <a
                                key={idx}
                                href={file.local_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1 text-xs text-primary hover:underline"
                              >
                                <FileText className="h-3 w-3" />
                                {file.filename}
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col gap-2">
                      {dok.url && (
                        <a
                          href={getAbsoluteUrl(dok.url) || '#'}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-sm text-primary hover:underline"
                        >
                          Original <ExternalLink className="h-3 w-3" />
                        </a>
                      )}
                      {dok.markdown_url && (
                        <a
                          href={getAbsoluteUrl(dok.markdown_url) || '#'}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-sm text-primary hover:underline"
                        >
                          Markdown <ExternalLink className="h-3 w-3" />
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

export default RegeringskanslientDokument;
