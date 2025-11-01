import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertCircle, AlertTriangle, Info } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Notification {
  level: 'critical' | 'warning' | 'info';
  title: string;
  message: string;
  action?: { label: string; path: string };
}

const AdminNotifications = () => {
  const navigate = useNavigate();

  const { data: notifications } = useQuery({
    queryKey: ['admin-notifications'],
    queryFn: async () => {
      const notifs: Notification[] = [];

      // Check failed downloads
      const { data: failedDownloads } = await supabase
        .from('file_download_queue')
        .select('id')
        .eq('status', 'failed');

      if (failedDownloads && failedDownloads.length > 15) {
        notifs.push({
          level: 'warning',
          title: `${failedDownloads.length} filer misslyckades`,
          message: 'Filnedladdningskön har flera misslyckade items',
          action: { label: 'Visa detaljer', path: '/admin?tab=files' }
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
          message: `Du har använt ${usagePercent.toFixed(1)}% av din storage quota`,
          action: { label: 'Rensa gamla filer', path: '/admin?tab=files' }
        });
      } else if (usagePercent > 80) {
        notifs.push({
          level: 'warning',
          title: 'Högt storage-utnyttjande',
          message: `Du har använt ${usagePercent.toFixed(1)}% av din storage quota`,
        });
      }

      // Check outdated tables
      const { data: progress } = await supabase
        .from('data_fetch_progress')
        .select('data_type, updated_at')
        .order('updated_at', { ascending: true })
        .limit(3);

      const threeDaysAgo = new Date();
      threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

      progress?.forEach(p => {
        if (new Date(p.updated_at) < threeDaysAgo) {
          notifs.push({
            level: 'info',
            title: `${p.data_type} ej uppdaterad`,
            message: `Data har inte uppdaterats sedan ${new Date(p.updated_at).toLocaleDateString('sv-SE')}`,
            action: { label: 'Hämta nu', path: '/admin?tab=riksdagen' }
          });
        }
      });

      return notifs;
    },
    refetchInterval: 60000, // Every minute
  });

  if (!notifications || notifications.length === 0) {
    return null;
  }

  const getIcon = (level: string) => {
    switch (level) {
      case 'critical':
        return <AlertCircle className="h-5 w-5" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5" />;
      default:
        return <Info className="h-5 w-5" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Varningar & Alerts</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {notifications.map((notif, idx) => (
            <Alert key={idx} variant={notif.level === 'critical' ? 'destructive' : 'default'}>
              <div className="flex items-start gap-3">
                {getIcon(notif.level)}
                <div className="flex-1">
                  <h4 className="font-semibold mb-1">{notif.title}</h4>
                  <AlertDescription>{notif.message}</AlertDescription>
                  {notif.action && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="mt-2"
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
      </CardContent>
    </Card>
  );
};

export default AdminNotifications;
