import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Download, RefreshCw, Trash2, CheckCircle2, AlertCircle, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { AutoFileProcessor } from "./AutoFileProcessor";

export const FileQueueControl = () => {
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  const { data: queueStats, refetch } = useQuery({
    queryKey: ["admin-file-queue-stats"],
    queryFn: async () => {
      const [pending, processing, completed, failed] = await Promise.all([
        supabase
          .from("file_download_queue")
          .select("*", { count: "exact" })
          .eq("status", "pending"),
        supabase
          .from("file_download_queue")
          .select("*", { count: "exact" })
          .eq("status", "processing"),
        supabase
          .from("file_download_queue")
          .select("*", { count: "exact" })
          .eq("status", "completed"),
        supabase
          .from("file_download_queue")
          .select("*", { count: "exact" })
          .eq("status", "failed"),
      ]);

      return {
        pending: pending.count || 0,
        processing: processing.count || 0,
        completed: completed.count || 0,
        failed: failed.count || 0,
        total:
          (pending.count || 0) +
          (processing.count || 0) +
          (completed.count || 0) +
          (failed.count || 0),
      };
    },
    refetchInterval: 5000,
  });

  const { data: recentFiles } = useQuery({
    queryKey: ["admin-recent-files"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("file_download_queue")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(10);

      if (error) throw error;
      return data || [];
    },
    refetchInterval: 5000,
  });

  const processQueue = async () => {
    setIsProcessing(true);
    try {
      const { data, error } = await supabase.functions.invoke("process-file-queue");

      if (error) throw error;

      const result = data as { processed?: number; failed?: number };

      toast({
        title: "Filprocessing slutförd",
        description: `${result.processed || 0} filer processade, ${result.failed || 0} misslyckades`,
      });

      refetch();
    } catch (error: any) {
      console.error("File queue processing error:", error);
      toast({
        title: "Fel vid filprocessing",
        description: error.message || "Okänt fel uppstod",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const resetFailed = async () => {
    try {
      const { error } = await supabase
        .from("file_download_queue")
        .update({ status: "pending", attempts: 0, error_message: null })
        .eq("status", "failed");

      if (error) throw error;

      toast({
        title: "Misslyckade filer återställda",
        description: "Filerna kommer försökas laddas ner igen",
      });

      refetch();
    } catch (error: any) {
      toast({
        title: "Fel vid återställning",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const clearCompleted = async () => {
    try {
      const { error } = await supabase
        .from("file_download_queue")
        .delete()
        .eq("status", "completed");

      if (error) throw error;

      toast({
        title: "Klara filer rensade",
        description: "Alla completed poster har tagits bort",
      });

      refetch();
    } catch (error: any) {
      toast({
        title: "Fel vid rensning",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (!queueStats) return null;

  const progress =
    queueStats.total > 0 ? (queueStats.completed / queueStats.total) * 100 : 0;

  return (
    <div className="space-y-6">
      <AutoFileProcessor />
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Filnedladdningskö</CardTitle>
              <CardDescription>Hantera bakgrundsnedladdningar</CardDescription>
            </div>
            <div className="flex gap-2">
              {queueStats.failed > 0 && (
                <Button variant="outline" size="sm" onClick={resetFailed}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Återställ misslyckade ({queueStats.failed})
                </Button>
              )}
              {queueStats.completed > 0 && (
                <Button variant="outline" size="sm" onClick={clearCompleted}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Rensa klara ({queueStats.completed})
                </Button>
              )}
              <Button
                size="sm"
                onClick={processQueue}
                disabled={isProcessing || queueStats.pending === 0}
              >
                <Download className="h-4 w-4 mr-2" />
                {isProcessing ? "Processar..." : `Processa kö (${queueStats.pending})`}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Totalt framsteg</span>
              <span className="font-medium">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          <div className="grid grid-cols-4 gap-4">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-yellow-500" />
              <div>
                <div className="text-2xl font-bold">{queueStats.pending}</div>
                <div className="text-xs text-muted-foreground">Väntande</div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <RefreshCw className="h-4 w-4 text-info" />
              <div>
                <div className="text-2xl font-bold">{queueStats.processing}</div>
                <div className="text-xs text-muted-foreground">Processar</div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-success" />
              <div>
                <div className="text-2xl font-bold">{queueStats.completed}</div>
                <div className="text-xs text-muted-foreground">Klara</div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-error" />
              <div>
                <div className="text-2xl font-bold">{queueStats.failed}</div>
                <div className="text-xs text-muted-foreground">Misslyckade</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {recentFiles && recentFiles.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Senaste filer</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {recentFiles.map((file: any) => (
                <div
                  key={file.id}
                  className="flex items-center justify-between p-2 border rounded"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {file.storage_path}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {file.table_name}
                    </p>
                  </div>
                  <Badge
                    variant={
                      file.status === "completed"
                        ? "default"
                        : file.status === "failed"
                        ? "destructive"
                        : "secondary"
                    }
                  >
                    {file.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};