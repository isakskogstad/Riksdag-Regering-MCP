import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useFavorites = (tableName: string, documentId: string) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: isFavorite, isLoading } = useQuery({
    queryKey: ["favorite", tableName, documentId],
    queryFn: async () => {
      const { data: session } = await supabase.auth.getSession();
      if (!session.session) return false;

      const { data, error } = await supabase
        .from("favorites")
        .select("id")
        .eq("table_name", tableName)
        .eq("document_id", documentId)
        .single();

      if (error && error.code !== "PGRST116") throw error;
      return !!data;
    },
  });

  const toggleFavorite = useMutation({
    mutationFn: async () => {
      const { data: session } = await supabase.auth.getSession();
      if (!session.session) {
        throw new Error("Du måste vara inloggad");
      }

      if (isFavorite) {
        const { error } = await supabase
          .from("favorites")
          .delete()
          .eq("table_name", tableName)
          .eq("document_id", documentId);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("favorites")
          .insert({ table_name: tableName, document_id: documentId } as any);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favorite", tableName, documentId] });
      toast({
        title: isFavorite ? "Borttagen från favoriter" : "Tillagd i favoriter",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Fel",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return { isFavorite, isLoading, toggleFavorite: toggleFavorite.mutate };
};

export const useAllFavorites = () => {
  return useQuery({
    queryKey: ["all-favorites"],
    queryFn: async () => {
      const { data: session } = await supabase.auth.getSession();
      if (!session.session) return [];

      const { data, error } = await supabase
        .from("favorites")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });
};
