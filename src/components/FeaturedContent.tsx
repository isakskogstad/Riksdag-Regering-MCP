import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { FileText, Clock, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { sv } from "date-fns/locale";

export const FeaturedContent = () => {
  const { data: recentDocs, isLoading } = useQuery({
    queryKey: ['featured-recent-documents'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('riksdagen_dokument')
        .select('id, titel, subtitel, doktyp, datum, beteckning')
        .not('titel', 'is', null)
        .not('datum', 'is', null)
        .order('datum', { ascending: false })
        .limit(3);

      if (error) throw error;
      return data;
    },
  });

  // Don't render anything if no data
  if (!isLoading && (!recentDocs || recentDocs.length === 0)) {
    return null;
  }

  return (
    <section className="mb-20 md:mb-28">
      <div className="text-center mb-12">
        <h2 className="section-title inline-flex items-center gap-3">
          <FileText className="h-8 w-8 text-primary/60" />
          Senaste från Riksdagen
        </h2>
        <p className="text-muted-foreground mt-3 max-w-2xl mx-auto">
          Upptäck de nyaste dokumenten som publicerats i riksdagens arkiv
        </p>
      </div>

      {isLoading ? (
        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="h-full">
              <CardHeader>
                <Skeleton className="h-6 w-20 mb-2" />
                <Skeleton className="h-6 w-full mb-2" />
                <Skeleton className="h-4 w-3/4" />
              </CardHeader>
            </Card>
          ))}
        </div>
      ) : (
        <>
          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {recentDocs?.map((doc) => (
              <Card
                key={doc.id}
                className="group h-full card-elevated hover:scale-[1.02] transition-all duration-300 cursor-pointer border-2 hover:border-primary/30"
              >
                <CardHeader>
                  <div className="flex items-center justify-between mb-3">
                    <Badge variant="outline" className="font-mono text-xs">
                      {doc.doktyp || 'Dokument'}
                    </Badge>
                    {doc.datum && (
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span className="line-clamp-1">
                          {formatDistanceToNow(new Date(doc.datum), {
                            addSuffix: true,
                            locale: sv,
                          })}
                        </span>
                      </div>
                    )}
                  </div>

                  <CardTitle className="text-lg line-clamp-2 group-hover:text-primary transition-colors">
                    {doc.titel || 'Dokument utan titel'}
                  </CardTitle>

                  {doc.subtitel && (
                    <CardDescription className="line-clamp-2">
                      {doc.subtitel}
                    </CardDescription>
                  )}

                  {doc.beteckning && (
                    <div className="mt-3 text-xs text-muted-foreground font-mono">
                      {doc.beteckning}
                    </div>
                  )}
                </CardHeader>

                <CardContent>
                  <div className="flex items-center text-sm text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                    <span>Läs mer</span>
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-8">
            <Button variant="outline-hover" size="lg" asChild>
              <Link to="/riksdagen/dokument">
                Se alla dokument
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </>
      )}
    </section>
  );
};
