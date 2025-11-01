import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import StatsCard from "@/components/StatsCard";
import { HardDrive, FileText, Database, Activity } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export const DashboardQuickStats = () => {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['dashboard-quick-stats'],
    queryFn: async () => {
      const [storageData, fileQueueData, dbTables, healthCheck] = await Promise.all([
        supabase.from('storage_statistics' as any).select('total_size_bytes, file_count'),
        supabase.from('file_download_queue').select('status'),
        supabase.rpc('get_table_sizes' as any),
        supabase.from('data_fetch_progress').select('status').in('status', ['in_progress', 'partial'])
      ]);

      const totalSize = storageData.data?.reduce((sum: number, s: any) => sum + (s.total_size_bytes || 0), 0) || 0;
      const totalFiles = storageData.data?.reduce((sum: number, s: any) => sum + (s.file_count || 0), 0) || 0;
      const todayFiles = fileQueueData.data?.filter((f: any) => f.status === 'completed').length || 0;
      const dbSize = dbTables.data?.reduce((sum: number, t: any) => sum + (t.size_bytes || 0), 0) || 0;
      const tableCount = dbTables.data?.length || 0;
      const isHealthy = !storageData.error && !dbTables.error;

      return {
        storage: {
          value: `${(totalSize / 1024 / 1024).toFixed(1)} MB`,
          subtitle: `${((totalSize / (1024 * 1024 * 1024)) * 100).toFixed(1)}% av 1GB`,
        },
        files: {
          value: totalFiles.toLocaleString('sv-SE'),
          subtitle: `+${todayFiles} idag`,
        },
        database: {
          value: `${(dbSize / 1024 / 1024 / 1024).toFixed(1)} GB`,
          subtitle: `${tableCount} tabeller`,
        },
        status: {
          value: isHealthy ? '✅ Healthy' : '⚠️ Issue',
          subtitle: healthCheck.data && healthCheck.data.length > 0 ? `${healthCheck.data.length} aktiva` : '100% uptime',
        }
      };
    },
    refetchInterval: 60000,
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map(i => (
          <Skeleton key={i} className="h-24" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-card border rounded-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-muted-foreground">Storage</span>
          <HardDrive className="h-4 w-4 text-info" />
        </div>
        <div className="text-2xl font-bold">{stats?.storage.value}</div>
        <div className="text-xs text-muted-foreground mt-1">{stats?.storage.subtitle}</div>
      </div>

      <div className="bg-card border rounded-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-muted-foreground">Filer</span>
          <FileText className="h-4 w-4 text-success" />
        </div>
        <div className="text-2xl font-bold">{stats?.files.value}</div>
        <div className="text-xs text-muted-foreground mt-1">{stats?.files.subtitle}</div>
      </div>

      <div className="bg-card border rounded-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-muted-foreground">DB Size</span>
          <Database className="h-4 w-4 text-warning" />
        </div>
        <div className="text-2xl font-bold">{stats?.database.value}</div>
        <div className="text-xs text-muted-foreground mt-1">{stats?.database.subtitle}</div>
      </div>

      <div className="bg-card border rounded-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-muted-foreground">Status</span>
          <Activity className="h-4 w-4 text-primary" />
        </div>
        <div className="text-2xl font-bold">{stats?.status.value}</div>
        <div className="text-xs text-muted-foreground mt-1">{stats?.status.subtitle}</div>
      </div>
    </div>
  );
};
