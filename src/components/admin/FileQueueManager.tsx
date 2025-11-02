import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Play, RotateCcw, Trash2, ChevronDown, Loader2, FileText,
  CheckCircle2, XCircle, Clock
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAutoRetry } from "@/hooks/useAutoRetry";

interface FileQueueManagerProps {
  mode?: "full" | "compact";
}

/**
 * Unified File Queue Manager
 * Consolidates 3 previous components into one with mode toggle
 */
export const FileQueueManager = ({ mode = "full" }: FileQueueManagerProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [autoProcess, setAutoProcess] = useState(false);
  const { toast } = useToast();

  // Auto-retry hook for automatic processing
  useAutoRetry(autoProcess);

  const { data: queueStats, refetch } = useQuery({
    queryKey: ['file-queue-stats'],
    queryFn: async () => {
      const { data: allItems } = await supabase
        .from('file_download_queue')
        .select('status');

      const stats = {
        pending: allItems?.filter(i => i.status === 'pending').length || 0,
        processing: allItems?.filter(i => i.status === 'processing').length || 0,
        completed: allItems?.filter(i => i.status === 'completed').length || 0,
        failed: allItems?.filter(i => i.status === 'failed').length || 0,
        total: allItems?.length || 0,
      };

      return stats;
    },
    refetchInterval: 5000,
  });

  const { data: recentFiles } = useQuery({
    queryKey: ['recent-queue-files'],
    queryFn: async () => {
      const { data } = await supabase
        .from('file_download_queue')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      return data || [];
    },
    refetchInterval: 5000,
  });

  const processQueue = async () => {
    setIsProcessing(true);
    try {
      const { data, error } = await supabase.functions.invoke('process-file-queue');

      if (error) throw error;

      const result = data as { processed?: number; failed?: number };

      toast({
        title: "Filprocessing slutförd",
        description: `${result.processed || 0} filer processade, ${result.failed || 0} misslyckades`,
      });

      refetch();
    } catch (error: any) {
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
        .from('file_download_queue')
        .update({ status: 'pending', attempts: 0, error_message: null })
        .eq('status', 'failed');

      if (error) throw error;

      toast({
        title: "Misslyckade filer återställda",
        description: "Alla misslyckade filer har satts till 'väntande'",
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
        .from('file_download_queue')
        .delete()
        .eq('status', 'completed');

      if (error) throw error;

      toast({
        title: "Klara filer rensade",
        description: `${queueStats?.completed || 0} klara filer har raderats från kön`,
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

  const totalProgress = queueStats
    ? ((queueStats.completed / queueStats.total) * 100) || 0
    : 0;

  // Compact mode for embedding in other views
  if (mode === "compact") {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-base">
            <span>Filkö</span>
            <Badge variant={queueStats?.processing ? "default" : "secondary"}>
              {queueStats?.pending || 0} väntande
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Progress value={totalProgress} className="h-2" />
          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={processQueue}
              disabled={isProcessing || !queueStats?.pending}
              className="flex-1"
            >
              {isProcessing ? (
                <><Loader2 className="h-3 w-3 mr-2 animate-spin" />Bearbetar...</>
              ) : (
                <><Play className="h-3 w-3 mr-2" />Kör nu</>
              )}
            </Button>
            {queueStats && queueStats.failed > 0 && (
              <Button size="sm" variant="outline" onClick={resetFailed}>
                <RotateCcw className="h-3 w-3 mr-1" />
                {queueStats.failed}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Full mode with all features
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Filnedladdningskö
          </div>
          <div className="flex items-center gap-2">
            <Switch
              id="auto-process"
              checked={autoProcess}
              onCheckedChange={setAutoProcess}
            />
            <Label htmlFor="auto-process" className="text-sm cursor-pointer">
              Auto (var 5:e min)
            </Label>
          </div>
        </CardTitle>
        <CardDescription>
          Hantera bakgrundsnedladdningar av filer från Supabase Storage
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Overall Progress */}
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="font-medium">
                Total progress: {queueStats?.completed || 0} / {queueStats?.total || 0}
              </span>
              <span className="text-muted-foreground">{totalProgress.toFixed(1)}%</span>
            </div>
            <Progress value={totalProgress} className="h-2" />
          </div>

          {/* Status Cards Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center justify-between p-3 border rounded bg-card">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-yellow-500" />
                <span className="text-sm font-medium">Väntande</span>
              </div>
              <Badge variant="outline">{queueStats?.pending || 0}</Badge>
            </div>

            <div className="flex items-center justify-between p-3 border rounded bg-card">
              <div className="flex items-center gap-2">
                <Loader2 className={`h-4 w-4 text-blue-500 ${queueStats?.processing ? 'animate-spin' : ''}`} />
                <span className="text-sm font-medium">Bearbetar</span>
              </div>
              <Badge variant="default">{queueStats?.processing || 0}</Badge>
            </div>

            <div className="flex items-center justify-between p-3 border rounded bg-card">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <span className="text-sm font-medium">Klara</span>
              </div>
              <Badge variant="secondary">{queueStats?.completed || 0}</Badge>
            </div>

            <div className="flex items-center justify-between p-3 border rounded bg-card">
              <div className="flex items-center gap-2">
                <XCircle className="h-4 w-4 text-red-500" />
                <span className="text-sm font-medium">Misslyckade</span>
              </div>
              <Badge variant="destructive">{queueStats?.failed || 0}</Badge>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={processQueue}
              disabled={isProcessing || !queueStats?.pending}
              className="flex-1 min-w-[150px]"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Bearbetar...
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  Kör nu ({queueStats?.pending || 0} väntande)
                </>
              )}
            </Button>

            {queueStats && queueStats.failed > 0 && (
              <Button
                variant="outline"
                onClick={resetFailed}
                className="flex-1 min-w-[150px]"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Återställ misslyckade ({queueStats.failed})
              </Button>
            )}

            {queueStats && queueStats.completed > 0 && (
              <Button
                variant="outline"
                onClick={clearCompleted}
                className="flex-1 min-w-[150px]"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Rensa klara ({queueStats.completed})
              </Button>
            )}
          </div>

          {/* Info Alert */}
          {queueStats && queueStats.pending === 0 && queueStats.processing === 0 && (
            <Alert>
              <AlertDescription className="text-sm">
                ✅ Inga filer väntar. Gå till Riksdagen/Regeringskansliet för att lägga till filer i kön.
              </AlertDescription>
            </Alert>
          )}

          {/* Recent Files (Collapsible) */}
          <Collapsible>
            <CollapsibleTrigger className="flex items-center gap-2 text-sm font-medium hover:underline">
              <ChevronDown className="h-4 w-4" />
              Visa senaste 10 filer i kö →
            </CollapsibleTrigger>
            <CollapsibleContent>
              <ScrollArea className="h-[200px] mt-2 border rounded-lg">
                <div className="p-2 space-y-2">
                  {recentFiles && recentFiles.length > 0 ? (
                    recentFiles.map((file: any) => (
                      <div key={file.id} className="flex justify-between items-center py-2 px-2 border-b last:border-b-0 text-xs">
                        <span className="truncate flex-1 font-mono">{file.storage_path}</span>
                        <Badge variant={
                          file.status === 'completed' ? 'secondary' :
                          file.status === 'failed' ? 'destructive' :
                          file.status === 'processing' ? 'default' : 'outline'
                        } className="ml-2">
                          {file.status}
                        </Badge>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-4 text-muted-foreground">
                      Inga filer i kö
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CollapsibleContent>
          </Collapsible>
        </div>
      </CardContent>
    </Card>
  );
};

export default FileQueueManager;
