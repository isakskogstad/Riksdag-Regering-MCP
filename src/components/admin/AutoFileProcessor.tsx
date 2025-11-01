import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Zap, Play } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const AutoFileProcessor = () => {
  const [isAutoEnabled, setIsAutoEnabled] = useState(() => {
    return localStorage.getItem("autoFileProcessor") === "true";
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const { data: pendingCount } = useQuery({
    queryKey: ["auto-pending-files"],
    queryFn: async () => {
      const { count } = await supabase
        .from("file_download_queue")
        .select("*", { count: "exact", head: true })
        .eq("status", "pending");

      return count || 0;
    },
    refetchInterval: isAutoEnabled ? 10000 : false, // Check every 10 seconds if auto is enabled
  });

  useEffect(() => {
    const processFiles = async () => {
      if (!isAutoEnabled || isProcessing || !pendingCount || pendingCount === 0) {
        return;
      }

      console.log(`Auto-processing ${pendingCount} pending files...`);
      setIsProcessing(true);

      try {
        const { data, error } = await supabase.functions.invoke("process-file-queue");

        if (error) throw error;

        const result = data as { processed?: number; failed?: number };

        if (result.processed && result.processed > 0) {
          toast({
            title: "Automatisk filprocessing",
            description: `${result.processed} filer processade automatiskt`,
          });
        }
      } catch (error: any) {
        console.error("Auto file processing error:", error);
        toast({
          title: "Fel vid automatisk filprocessing",
          description: error.message || "Okänt fel uppstod",
          variant: "destructive",
        });
      } finally {
        setIsProcessing(false);
      }
    };

    if (isAutoEnabled && pendingCount && pendingCount > 0) {
      processFiles();
    }
  }, [isAutoEnabled, pendingCount, isProcessing, toast]);

  const handleToggle = (enabled: boolean) => {
    setIsAutoEnabled(enabled);
    localStorage.setItem("autoFileProcessor", String(enabled));
    
    toast({
      title: enabled ? "Automatisk filprocessing aktiverad" : "Automatisk filprocessing avaktiverad",
      description: enabled 
        ? "Filer kommer att laddas ner automatiskt när de läggs i kön"
        : "Filer måste startas manuellt",
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Automatisk filprocessing
            </CardTitle>
            <CardDescription>
              Starta filnedladdning automatiskt när filer läggs i kön
            </CardDescription>
          </div>
          <Switch checked={isAutoEnabled} onCheckedChange={handleToggle} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Status:</span>
          <div className="flex items-center gap-2">
            {isAutoEnabled ? (
              <>
                <Badge variant="default" className="gap-1">
                  <Play className="h-3 w-3" />
                  Aktiverad
                </Badge>
                {isProcessing && (
                  <span className="text-xs text-muted-foreground">
                    (processar...)
                  </span>
                )}
              </>
            ) : (
              <Badge variant="outline">Avaktiverad</Badge>
            )}
          </div>
        </div>
        {isAutoEnabled && pendingCount !== undefined && (
          <p className="text-xs text-muted-foreground mt-2">
            {pendingCount > 0 
              ? `${pendingCount} väntande filer kommer att processas automatiskt`
              : "Inga väntande filer just nu"}
          </p>
        )}
      </CardContent>
    </Card>
  );
};
