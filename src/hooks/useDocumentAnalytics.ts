import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useDocumentAnalytics = () => {
  const trackView = useMutation({
    mutationFn: async ({ tableName, documentId }: { tableName: string; documentId: string }) => {
      const { error } = await supabase.rpc("increment_document_view", {
        p_table_name: tableName,
        p_document_id: documentId,
      });
      if (error) throw error;
    },
  });

  return { trackView: trackView.mutate };
};
