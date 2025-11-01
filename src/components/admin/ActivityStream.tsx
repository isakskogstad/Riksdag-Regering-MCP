import { useActivityStream } from "@/hooks/useActivityStream";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, AlertCircle, Info, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { sv } from "date-fns/locale";
import { ScrollArea } from "@/components/ui/scroll-area";

const ActivityStream = () => {
  const { data: activities, isLoading } = useActivityStream();

  const getIcon = (actionType: string) => {
    switch (actionType) {
      case 'success':
      case 'data_fetch_complete':
        return <CheckCircle2 className="h-4 w-4 text-success" />;
      case 'warning':
      case 'api_slow_response':
        return <AlertCircle className="h-4 w-4 text-warning" />;
      case 'error':
      case 'data_fetch_failed':
        return <AlertCircle className="h-4 w-4 text-destructive" />;
      default:
        return <Info className="h-4 w-4 text-info" />;
    }
  };

  const getVariant = (actionType: string): "default" | "destructive" | "outline" | "secondary" => {
    if (actionType.includes('success') || actionType.includes('complete')) return 'secondary';
    if (actionType.includes('error') || actionType.includes('failed')) return 'destructive';
    if (actionType.includes('warning')) return 'outline';
    return 'default';
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Badge variant="secondary" className="animate-pulse">
              Live
            </Badge>
            Aktivitetsström
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">Laddar...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Badge variant="secondary" className="animate-pulse">
            Live
          </Badge>
          Aktivitetsström
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px]">
          {!activities || activities.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Ingen aktivitet ännu
            </div>
          ) : (
            <div className="space-y-3">
              {activities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start gap-3 p-3 border rounded-lg hover:bg-accent/50 transition-colors"
                >
                  {getIcon(activity.action_type)}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant={getVariant(activity.action_type)} className="text-xs">
                        {activity.action_type}
                      </Badge>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {formatDistanceToNow(new Date(activity.created_at), {
                          addSuffix: true,
                          locale: sv
                        })}
                      </div>
                    </div>
                    <p className="text-sm">{activity.description}</p>
                    {activity.metadata && (
                      <pre className="text-xs text-muted-foreground mt-1 overflow-x-auto">
                        {JSON.stringify(activity.metadata, null, 2)}
                      </pre>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default ActivityStream;
