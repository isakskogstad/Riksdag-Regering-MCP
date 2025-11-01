import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Heart, Trash2 } from "lucide-react";
import { Layout } from "@/components/Layout";
import { useAllFavorites } from "@/hooks/useFavorites";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import EmptyState from "@/components/EmptyState";

const Favorites = () => {
  const { data: favorites, isLoading } = useAllFavorites();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleRemove = async (favoriteId: string, tableName: string, documentId: string) => {
    const { error } = await supabase.from("favorites").delete().eq("id", favoriteId);
    
    if (error) {
      toast({
        title: "Fel",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Borttagen från favoriter",
    });

    queryClient.invalidateQueries({ queryKey: ["all-favorites"] });
    queryClient.invalidateQueries({ queryKey: ["favorite", tableName, documentId] });
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <Link to="/">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Tillbaka
            </Button>
          </Link>

          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent flex items-center gap-3">
              <Heart className="h-10 w-10 text-primary fill-primary" />
              Mina Favoriter
            </h1>
            <p className="text-muted-foreground text-lg">
              Dokument du har sparat för senare
            </p>
          </div>

          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Card key={i}>
                  <CardHeader>
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2 mt-2" />
                  </CardHeader>
                </Card>
              ))}
            </div>
          ) : !favorites || favorites.length === 0 ? (
            <EmptyState
              message="Inga favoriter ännu"
              suggestion="Använd hjärtikonerna på dokumentsidorna för att spara dokument"
            />
          ) : (
            <div className="space-y-4">
              {favorites.map((fav) => (
                <Card key={fav.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <CardTitle className="text-xl mb-2">
                          {fav.document_id}
                        </CardTitle>
                        <CardDescription>
                          <span className="text-sm">
                            Tabell: {fav.table_name}
                          </span>
                          <br />
                          <span className="text-xs text-muted-foreground">
                            Sparad: {new Date(fav.created_at).toLocaleDateString("sv-SE")}
                          </span>
                        </CardDescription>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemove(fav.id, fav.table_name, fav.document_id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Favorites;
