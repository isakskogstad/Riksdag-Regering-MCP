import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle2, Clock, Database, HardDrive, Zap, FileText, Activity } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { sv } from "date-fns/locale";
import { Skeleton } from "@/components/ui/skeleton";

export const SystemHealth = () => {
  const { data: healthData, isLoading } = useQuery({
    queryKey: ["system-health"],
    queryFn: async () => {
      // Check database connectivity
      const dbCheck = await supabase
        .from("data_fetch_progress")
        .select("count", { count: "exact", head: true });

      // Check storage
      const storageCheck = await supabase.storage.listBuckets();

      // Check latest activity
      const latestActivity = await supabase
        .from("data_fetch_progress")
        .select("updated_at")
        .order("updated_at", { ascending: false })
        .limit(1)
        .single();

      // Count active fetches
      const { count: activeFetches } = await supabase
        .from("data_fetch_progress")
        .select("*", { count: "exact", head: true })
        .in("status", ["in_progress", "partial"]);

      // Count pending files in queue
      const { count: pendingFiles } = await supabase
        .from("file_download_queue")
        .select("*", { count: "exact", head: true })
        .eq("status", "pending");

      return {
        database: !dbCheck.error,
        storage: !storageCheck.error,
        lastActivity: latestActivity.data?.updated_at || null,
        activeFetches: activeFetches || 0,
        pendingFiles: pendingFiles || 0,
      };
    },
    refetchInterval: 10000, // Check every 10 seconds for better real-time feel
  });

  const getLastActivityStatus = () => {
    if (!healthData?.lastActivity) return "unknown";
    const timeSinceActivity = Date.now() - new Date(healthData.lastActivity).getTime();
    const minutesSinceActivity = timeSinceActivity / 1000 / 60;

    if (minutesSinceActivity < 5) return "active";
    if (minutesSinceActivity < 30) return "recent";
    return "idle";
  };

  const activityStatus = getLastActivityStatus();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Systemhälsa</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5" />
          Systemhälsa
          {healthData && (healthData.activeFetches > 0 || healthData.pendingFiles > 0) && (
            <Badge variant="default" className="gap-1 animate-pulse">
              <Activity className="h-3 w-3" />
              Live
            </Badge>
          )}
        </CardTitle>
        <CardDescription>
          Realtidsstatus för backend-tjänster
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between p-3 border rounded bg-card">
          <div className="flex items-center gap-2">
            <Database className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Databas</span>
          </div>
          {healthData?.database ? (
            <Badge variant="default" className="gap-1">
              <CheckCircle2 className="h-3 w-3" />
              Aktiv
            </Badge>
          ) : (
            <Badge variant="destructive" className="gap-1">
              <AlertCircle className="h-3 w-3" />
              Otillgänglig
            </Badge>
          )}
        </div>

        <div className="flex items-center justify-between p-3 border rounded bg-card">
          <div className="flex items-center gap-2">
            <HardDrive className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Storage</span>
          </div>
          {healthData?.storage ? (
            <Badge variant="default" className="gap-1">
              <CheckCircle2 className="h-3 w-3" />
              Aktiv
            </Badge>
          ) : (
            <Badge variant="destructive" className="gap-1">
              <AlertCircle className="h-3 w-3" />
              Otillgänglig
            </Badge>
          )}
        </div>

        <div className="flex items-center justify-between p-3 border rounded bg-card">
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Pågående datahämtningar</span>
          </div>
          <Badge 
            variant={healthData?.activeFetches && healthData.activeFetches > 0 ? "default" : "outline"}
            className="gap-1"
          >
            {healthData?.activeFetches || 0} aktiva
          </Badge>
        </div>

        <div className="flex items-center justify-between p-3 border rounded bg-card">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Filnedladdningskö</span>
          </div>
          <Badge 
            variant={healthData?.pendingFiles && healthData.pendingFiles > 0 ? "secondary" : "outline"}
            className="gap-1"
          >
            {healthData?.pendingFiles || 0} väntande
          </Badge>
        </div>

        <div className="flex items-center justify-between p-3 border rounded bg-card">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Senaste aktivitet</span>
          </div>
          {healthData?.lastActivity ? (
            <Badge 
              variant={
                activityStatus === "active" ? "default" :
                activityStatus === "recent" ? "secondary" : "outline"
              } 
              className="gap-1"
            >
              {formatDistanceToNow(new Date(healthData.lastActivity), {
                addSuffix: true,
                locale: sv,
              })}
            </Badge>
          ) : (
            <Badge variant="outline">Ingen data</Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
