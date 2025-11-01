import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Clock, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { sv } from "date-fns/locale";

interface ProgressTrackerProps {
  source: 'riksdagen' | 'regeringskansliet';
}

const ProgressTracker = ({ source }: ProgressTrackerProps) => {
  const { data: progressItems, isLoading } = useQuery({
    queryKey: ['progress', source],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('data_fetch_progress')
        .select('*')
        .eq('source', source)
        .order('last_fetched_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    refetchInterval: 5000,
  });

  const { data: controlData } = useQuery({
    queryKey: ['fetch-control', source],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('data_fetch_control')
        .select('*')
        .eq('source', source);
      
      if (error) throw error;
      return data || [];
    },
    refetchInterval: 5000,
  });

  const getControlStatus = (dataType: string) => {
    return controlData?.find((c: any) => c.data_type === dataType);
  };

  if (isLoading || !progressItems || progressItems.length === 0) {
    return null;
  }

  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4">Hämtningsframsteg</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {progressItems.map((item) => {
          const progress = item.total_items ? (item.items_fetched / item.total_items) * 100 : 0;
          const control = getControlStatus(item.data_type);
          const isStopped = item.status === 'stopped' || control?.should_stop === true;
          
          const statusIcon = item.status === 'completed' ? CheckCircle2 : 
                            item.status === 'failed' ? AlertCircle :
                            isStopped ? AlertCircle :
                            Loader2;
          const statusColor = item.status === 'completed' ? 'text-success' :
                             item.status === 'failed' ? 'text-error' :
                             isStopped ? 'text-warning' :
                             'text-info';
          
          return (
            <Card key={item.id}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">{item.data_type}</CardTitle>
                  <div className="flex items-center gap-2">
                    {isStopped && (
                      <Badge variant="outline" className="text-warning border-warning">
                        STOPPAD
                      </Badge>
                    )}
                    {item.status === 'completed' && <CheckCircle2 className={`h-4 w-4 ${statusColor}`} />}
                    {item.status === 'failed' && <AlertCircle className={`h-4 w-4 ${statusColor}`} />}
                    {item.status === 'in_progress' && !isStopped && <Loader2 className={`h-4 w-4 ${statusColor} animate-spin`} />}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>{item.items_fetched} / {item.total_items || '?'}</span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <Progress value={progress} />
                  {item.total_pages && (
                    <p className="text-xs text-muted-foreground">
                      Sida {item.current_page} / {item.total_pages}
                    </p>
                  )}
                  {item.last_fetched_at && (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {formatDistanceToNow(new Date(item.last_fetched_at), { 
                        addSuffix: true, 
                        locale: sv 
                      })}
                    </div>
                  )}
                  {item.error_message && (
                    <p className="text-xs text-error">{item.error_message}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default ProgressTracker;
