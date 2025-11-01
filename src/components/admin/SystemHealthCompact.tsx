import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, AlertCircle, Activity, Loader2 } from "lucide-react";

export const SystemHealthCompact = () => {
  const { data: healthData, isLoading } = useQuery({
    queryKey: ["system-health-compact"],
    queryFn: async () => {
      const [dbCheck, storageCheck, activeChecks, fileQueue] = await Promise.all([
        supabase.from("data_fetch_progress").select("count", { count: "exact", head: true }),
        supabase.storage.listBuckets(),
        supabase.from("data_fetch_progress").select("*", { count: "exact", head: true }).in("status", ["in_progress", "partial"]),
        supabase.from("file_download_queue").select("*", { count: "exact", head: true }).eq("status", "pending")
      ]);

      return {
        database: !dbCheck.error,
        storage: !storageCheck.error,
        activeFetches: activeChecks.count || 0,
        pendingFiles: fileQueue.count || 0,
        hasActivity: (activeChecks.count || 0) > 0 || (fileQueue.count || 0) > 0
      };
    },
    refetchInterval: 10000,
  });

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 p-4 border rounded-lg bg-card">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span className="text-sm">Kontrollerar systemstatus...</span>
      </div>
    );
  }

  const allHealthy = healthData?.database && healthData?.storage;

  return (
    <div className="flex items-center justify-between p-4 border rounded-lg bg-card">
      <div className="flex items-center gap-3">
        {allHealthy ? (
          <CheckCircle2 className="h-5 w-5 text-success" />
        ) : (
          <AlertCircle className="h-5 w-5 text-destructive" />
        )}
        <div>
          <div className="font-semibold text-sm">
            {allHealthy ? "Alla system operativa" : "Systemproblem detekterat"}
          </div>
          <div className="text-xs text-muted-foreground">
            Database: {healthData?.database ? "✓" : "✗"} | Storage: {healthData?.storage ? "✓" : "✗"}
          </div>
        </div>
      </div>
      <div className="flex gap-2">
        {healthData?.hasActivity && (
          <Badge variant="default" className="gap-1">
            <Activity className="h-3 w-3 animate-pulse" />
            Live
          </Badge>
        )}
        {(healthData?.activeFetches || 0) > 0 && (
          <Badge variant="secondary">
            {healthData?.activeFetches} hämtningar
          </Badge>
        )}
        {(healthData?.pendingFiles || 0) > 0 && (
          <Badge variant="outline">
            {healthData?.pendingFiles} filer i kö
          </Badge>
        )}
      </div>
    </div>
  );
};
