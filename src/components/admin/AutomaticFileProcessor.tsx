import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAutomaticFileProcessor } from "@/hooks/useAutomaticFileProcessor";
import { Play, Pause, Zap, Clock, CheckCircle2, FileDown } from "lucide-react";

export const AutomaticFileProcessor = () => {
  const {
    isRunning,
    pendingCount,
    totalProcessed,
    currentBatch,
    filesPerMinute,
    activityLog,
    startAutoProcess,
    stopAutoProcess,
  } = useAutomaticFileProcessor();

  const totalFiles = totalProcessed + pendingCount;
  const progressPercent = totalFiles > 0 ? (totalProcessed / totalFiles) * 100 : 0;

  const estimatedMinutes = filesPerMinute > 0 && pendingCount > 0
    ? Math.ceil(pendingCount / filesPerMinute)
    : 0;

  return (
    <Card className="border-2 border-primary/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Zap className="h-6 w-6 text-primary" />
            <div>
              <CardTitle className="text-2xl">Automatisk Filnedladdning</CardTitle>
              <CardDescription>
                Helautomatisk hantering av alla filer i kön
              </CardDescription>
            </div>
          </div>
          {isRunning && (
            <Badge variant="default" className="gap-2 px-4 py-2 animate-pulse">
              <div className="h-2 w-2 rounded-full bg-white" />
              Aktiv
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Start/Stop Button */}
        <Button
          onClick={isRunning ? stopAutoProcess : startAutoProcess}
          size="lg"
          variant={isRunning ? "destructive" : "default"}
          className="w-full h-16 text-lg font-semibold"
        >
          {isRunning ? (
            <>
              <Pause className="h-6 w-6 mr-3" />
              Stoppa Auto-Process
            </>
          ) : (
            <>
              <Play className="h-6 w-6 mr-3" />
              Starta Auto-Process
            </>
          )}
        </Button>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-lg bg-muted/50 border">
            <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
              <CheckCircle2 className="h-4 w-4" />
              Processade
            </div>
            <div className="text-3xl font-bold text-primary">
              {totalProcessed.toLocaleString("sv-SE")}
            </div>
          </div>

          <div className="p-4 rounded-lg bg-muted/50 border">
            <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
              <FileDown className="h-4 w-4" />
              Kvar
            </div>
            <div className="text-3xl font-bold text-orange-500">
              {pendingCount.toLocaleString("sv-SE")}
            </div>
          </div>

          <div className="p-4 rounded-lg bg-muted/50 border">
            <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
              <Zap className="h-4 w-4" />
              Batch #
            </div>
            <div className="text-3xl font-bold">
              {currentBatch}
            </div>
          </div>

          <div className="p-4 rounded-lg bg-muted/50 border">
            <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
              <Clock className="h-4 w-4" />
              Filer/min
            </div>
            <div className="text-3xl font-bold text-green-500">
              {filesPerMinute}
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        {totalFiles > 0 && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Total progress</span>
              <span className="font-semibold">{progressPercent.toFixed(1)}%</span>
            </div>
            <Progress value={progressPercent} className="h-3" />
            {estimatedMinutes > 0 && (
              <p className="text-xs text-muted-foreground text-center">
                Uppskattad tid kvar: ~{estimatedMinutes} minuter
              </p>
            )}
          </div>
        )}

        {/* Activity Log */}
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-muted-foreground">Aktivitetslogg</h3>
          <ScrollArea className="h-[200px] rounded-md border bg-muted/30 p-4">
            {activityLog.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                {isRunning ? "Väntar på aktivitet..." : "Inaktiv - starta för att se aktivitet"}
              </p>
            ) : (
              <div className="space-y-2">
                {activityLog.map((log) => (
                  <div key={log.id} className="text-sm font-mono border-b border-border/50 pb-2">
                    <span className="text-muted-foreground">{log.timestamp}</span>
                    <span className="mx-2">-</span>
                    <span>{log.message}</span>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </div>

        {/* Info Alert */}
        {!isRunning && pendingCount > 0 && (
          <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
            <p className="text-sm text-blue-700 dark:text-blue-300">
              <strong>💡 Tips:</strong> Tryck "Starta Auto-Process" för att automatiskt ladda ner{" "}
              <strong>{pendingCount.toLocaleString("sv-SE")}</strong> väntande filer.
              Systemet hanterar allt automatiskt tills kön är tom!
            </p>
          </div>
        )}

        {isRunning && pendingCount === 0 && (
          <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
            <p className="text-sm text-green-700 dark:text-green-300">
              <strong>✓ Klar!</strong> Inga fler filer i kön. Auto-process väntar på nya filer...
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
