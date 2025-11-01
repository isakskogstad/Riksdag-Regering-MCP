import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertCircle, AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface CriticalNotification {
  level: 'critical' | 'warning';
  title: string;
  message: string;
  action?: { label: string; path: string };
}

export const AdminNotificationsCritical = () => {
  const navigate = useNavigate();

  const { data: notifications } = useQuery({
    queryKey: ['admin-notifications-critical'],
    queryFn: async () => {
      const notifs: CriticalNotification[] = [];

      // Check failed downloads
      const { count: failedCount } = await supabase
        .from('file_download_queue')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'failed');

      if (failedCount && failedCount > 20) {
        notifs.push({
          level: 'critical',
          title: `${failedCount} filer misslyckades`,
          message: 'Kritiskt många filer i nedladdningskön har misslyckats',
          action: { label: 'Åtgärda nu', path: '/admin?tab=files' }
        });
      }

      // Check storage usage
      const { data: storageStats } = await supabase
        .from('storage_statistics' as any)
        .select('total_size_bytes');

      const totalSize = storageStats?.reduce((sum: number, s: any) => sum + (s.total_size_bytes || 0), 0) || 0;
      const quotaBytes = 1024 * 1024 * 1024; // 1 GB
      const usagePercent = (totalSize / quotaBytes) * 100;

      if (usagePercent > 95) {
        notifs.push({
          level: 'critical',
          title: 'Storage nästan fullt',
          message: `${usagePercent.toFixed(1)}% använt - systemet kan snart sluta fungera`,
          action: { label: 'Rensa storage', path: '/admin?tab=files' }
        });
      } else if (usagePercent > 85) {
        notifs.push({
          level: 'warning',
          title: 'Högt storage-utnyttjande',
          message: `${usagePercent.toFixed(1)}% använt av din quota`,
        });
      }

      return notifs.filter(n => n.level === 'critical' || (n.level === 'warning' && notifs.length < 2));
    },
    refetchInterval: 30000,
  });

  if (!notifications || notifications.length === 0) {
    return null;
  }

  return (
    <div className="space-y-2">
      {notifications.map((notif, idx) => (
        <Alert 
          key={idx} 
          variant={notif.level === 'critical' ? 'destructive' : 'default'}
          className="border-2"
        >
          <div className="flex items-start gap-3">
            {notif.level === 'critical' ? (
              <AlertCircle className="h-5 w-5 mt-0.5" />
            ) : (
              <AlertTriangle className="h-5 w-5 mt-0.5" />
            )}
            <div className="flex-1">
              <h4 className="font-bold text-sm mb-1">{notif.title}</h4>
              <AlertDescription className="text-xs">{notif.message}</AlertDescription>
              {notif.action && (
                <Button
                  size="sm"
                  variant={notif.level === 'critical' ? 'default' : 'outline'}
                  className="mt-2 h-7 text-xs"
                  onClick={() => navigate(notif.action!.path)}
                >
                  {notif.action.label} →
                </Button>
              )}
            </div>
          </div>
        </Alert>
      ))}
    </div>
  );
};
