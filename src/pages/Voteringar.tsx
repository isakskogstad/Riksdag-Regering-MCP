import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Calendar, CheckCircle2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { sv } from "date-fns/locale";
import EmptyState from "@/components/EmptyState";

const Voteringar = () => {
  const { data: voteringar, isLoading } = useQuery({
    queryKey: ['voteringar'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('riksdagen_voteringar')
        .select('*')
        .order('votering_datum', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="w-full bg-primary py-1"></div>
      
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        <header className="mb-12">
          <Link to="/riksdagen" className="text-primary hover:underline mb-4 inline-block">
            ← Tillbaka till Riksdagen
          </Link>
          <h1 className="text-4xl font-serif font-bold text-foreground mb-4">
            Voteringar
          </h1>
          <div className="w-20 h-1 bg-secondary mb-6"></div>
          <p className="text-muted-foreground">
            Senaste omröstningarna i riksdagen
          </p>
        </header>

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
        ) : voteringar && voteringar.length === 0 ? (
          <EmptyState
            message="Inga voteringar hittades"
            suggestion="Använd 'Hämta data'-knappen på Riksdagen-sidan för att ladda ned voteringar från Riksdagens API"
          />
        ) : (
          <div className="space-y-4">
            {voteringar?.map((vot) => (
              <Card key={vot.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        {vot.beteckning && (
                          <Badge variant="outline">{vot.beteckning}</Badge>
                        )}
                        {vot.rm && (
                          <Badge variant="secondary">RM {vot.rm}</Badge>
                        )}
                        {vot.punkt && (
                          <Badge variant="secondary">Punkt {vot.punkt}</Badge>
                        )}
                      </div>
                      <CardTitle className="text-xl mb-2">
                        {vot.titel || 'Votering'}
                      </CardTitle>
                      {vot.vinnare && (
                        <div className="flex items-center gap-2 mt-3">
                          <CheckCircle2 className="h-4 w-4 text-success" />
                          <span className="text-sm font-medium text-success">
                            Resultat: {vot.vinnare}
                          </span>
                        </div>
                      )}
                      <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                        {vot.votering_datum && (
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {formatDistanceToNow(new Date(vot.votering_datum), { 
                              addSuffix: true, 
                              locale: sv 
                            })}
                          </div>
                        )}
                        {vot.votering_typ && (
                          <span>Typ: {vot.votering_typ}</span>
                        )}
                      </div>
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

export default Voteringar;
