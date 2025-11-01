import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useAutoRetry = (enabled: boolean = true) => {
  const { toast } = useToast();

  useEffect(() => {
    if (!enabled) return;

    const interval = setInterval(async () => {
      try {
        // Fetch failed items with attempts < 3
        const { data: failedItems, error } = await supabase
          .from('file_download_queue')
          .select('*')
          .eq('status', 'failed')
          .lt('attempts', 3);

        if (error) throw error;

        if (failedItems && failedItems.length > 0) {
          console.log(`Auto-retry: Found ${failedItems.length} failed items, retrying...`);

          // Reset to pending
          const { error: updateError } = await supabase
            .from('file_download_queue')
            .update({ status: 'pending', error_message: null })
            .in('id', failedItems.map(i => i.id));

          if (updateError) throw updateError;

          // Trigger process
          await supabase.functions.invoke('process-file-queue');

          toast({
            title: "Auto-retry aktiverad",
            description: `Försöker ladda om ${failedItems.length} misslyckade filer`,
          });
        }
      } catch (error) {
        console.error('Auto-retry error:', error);
      }
    }, 300000); // Every 5 minutes

    return () => clearInterval(interval);
  }, [enabled, toast]);
};
