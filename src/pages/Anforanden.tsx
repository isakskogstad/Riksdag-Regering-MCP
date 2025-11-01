import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Calendar, User } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { sv } from "date-fns/locale";
import EmptyState from "@/components/EmptyState";

const Anforanden = () => {
  const { data: anforanden, isLoading } = useQuery({
    queryKey: ['anforanden'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('riksdagen_anforanden')
        .select('*')
        .order('anfdatum', { ascending: false });
      
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

  return (
    <div className="min-h-screen bg-background">
      <div className="w-full bg-primary py-1"></div>
      
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        <header className="mb-12">
          <Link to="/riksdagen" className="text-primary hover:underline mb-4 inline-block">
            ← Tillbaka till Riksdagen
          </Link>
          <h1 className="text-4xl font-serif font-bold text-foreground mb-4">
            Anföranden
          </h1>
          <div className="w-20 h-1 bg-secondary mb-6"></div>
          <p className="text-muted-foreground">
            Senaste anförandena från riksdagens debatter
          </p>
        </header>

        {isLoading ? (
          <div className="space-y-4">
            {[...Array(10)].map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-20 w-full" />
                </CardHeader>
              </Card>
            ))}
          </div>
        ) : anforanden && anforanden.length === 0 ? (
          <EmptyState
            message="Inga anföranden hittades"
            suggestion="Anförande-API:et från Riksdagen är för tillfället inte tillgängligt. Prova att hämta data för dokument, ledamöter och voteringar istället."
          />
        ) : (
          <div className="space-y-4">
            {anforanden?.map((anf) => (
              <Card key={anf.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className={anf.parti ? partiColors[anf.parti] : 'bg-gray-600'}>
                        {anf.talare?.[0] || <User className="h-6 w-6" />}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        {anf.talare && (
                          <span className="font-semibold text-foreground">{anf.talare}</span>
                        )}
                        {anf.parti && (
                          <Badge className={`${partiColors[anf.parti] || 'bg-gray-600'} text-white`}>
                            {anf.parti}
                          </Badge>
                        )}
                      </div>
                      {anf.debattnamn && (
                        <CardTitle className="text-lg mb-3">
                          {anf.debattnamn}
                        </CardTitle>
                      )}
                      {anf.avsnittsrubrik && (
                        <p className="text-sm text-muted-foreground mb-3">
                          {anf.avsnittsrubrik}
                        </p>
                      )}
                      {anf.anftext && (
                        <CardContent className="p-0">
                          <p className="text-sm line-clamp-3 text-muted-foreground">
                            {anf.anftext}
                          </p>
                        </CardContent>
                      )}
                      <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                        {anf.anfdatum && (
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {formatDistanceToNow(new Date(anf.anfdatum), { 
                              addSuffix: true, 
                              locale: sv 
                            })}
                          </div>
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

export default Anforanden;
