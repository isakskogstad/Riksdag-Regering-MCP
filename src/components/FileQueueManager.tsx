import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAutoRetry } from "@/hooks/useAutoRetry";
import { Loader2, Clock, CheckCircle2, AlertCircle, Play, RefreshCw } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const FileQueueManager = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [autoProcess, setAutoProcess] = useState(false);
  const { toast } = useToast();
  useAutoRetry(autoProcess);

  const { data: queueStats, refetch } = useQuery({
    queryKey: ["file-queue-stats"],
    queryFn: async () => {
      const { data: pending } = await supabase
        .from("file_download_queue")
        .select("id", { count: "exact", head: true })
        .eq("status", "pending");

      const { data: processing } = await supabase
        .from("file_download_queue")
        .select("id", { count: "exact", head: true })
        .eq("status", "processing");

      const { data: completed } = await supabase
        .from("file_download_queue")
        .select("id", { count: "exact", head: true })
        .eq("status", "completed");

      const { data: failed } = await supabase
        .from("file_download_queue")
        .select("id", { count: "exact", head: true })
        .eq("status", "failed");

      const total = (pending?.length || 0) + (processing?.length || 0) + (completed?.length || 0) + (failed?.length || 0);
      
      return {
        pending: pending?.length || 0,
        processing: processing?.length || 0,
        completed: completed?.length || 0,
        failed: failed?.length || 0,
        total,
      };
    },
    refetchInterval: 5000,
  });

  const processQueue = async () => {
    setIsProcessing(true);
    try {
      const { error } = await supabase.functions.invoke("process-file-queue");
      
      if (error) throw error;

      toast({
        title: "Filprocessing startad",
        description: "Filer laddas ner i bakgrunden",
      });
      
      refetch();
    } catch (error: any) {
      toast({
        title: "Fel vid filprocessing",
        description: error.message,
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

  if (!queueStats || queueStats.total === 0) return null;

  const progress = queueStats.total > 0 ? (queueStats.completed / queueStats.total) * 100 : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Filnedladdningskö</span>
          {queueStats && queueStats.processing > 0 && (
            <Badge variant="secondary" className="animate-pulse">Live</Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4 p-3 border rounded-lg bg-muted/50">
          <Switch id="auto" checked={autoProcess} onCheckedChange={setAutoProcess} />
          <Label htmlFor="auto">Auto-process (var 5:e minut)</Label>
        </div>
        <div className="flex gap-2">
          <Button onClick={processQueue} disabled={isProcessing || !queueStats?.pending} className="flex-1">
            {isProcessing ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Bearbetar...</> : <><Play className="mr-2 h-4 w-4" />Kör nu</>}
          </Button>
          {queueStats?.failed > 0 && <Button variant="outline" onClick={resetFailed}>Återställ ({queueStats.failed})</Button>}
        </div>
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
  );
};

export default FileQueueManager;