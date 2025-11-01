import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Play, StopCircle, RotateCcw, Trash2, CheckCircle2, AlertCircle, Loader2, Clock, TrendingUp } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { sv } from "date-fns/locale";

interface ProgressCardProps {
  item: any;
  control: any;
  isLoading: boolean;
  onStart: () => void;
  onStop: () => void;
  onReset: () => void;
  onDelete: () => void;
}

export const ProgressCard = ({
  item,
  control,
  isLoading,
  onStart,
  onStop,
  onReset,
  onDelete,
}: ProgressCardProps) => {
  const progress = item.total_items
    ? Math.round((item.items_fetched / item.total_items) * 100)
    : 0;
  const isStopped = item.status === "stopped" || control?.should_stop === true;

  // Calculate ETA based on progress
  const getETA = () => {
    if (!item.total_items || !item.items_fetched || item.items_fetched === 0) return null;
    if (item.status !== "in_progress") return null;

    const timeSinceStart = item.last_fetched_at 
      ? Date.now() - new Date(item.last_fetched_at).getTime()
      : 0;
    
    if (timeSinceStart === 0) return null;

    const itemsPerMs = item.items_fetched / timeSinceStart;
    const itemsRemaining = item.total_items - item.items_fetched;
    const msRemaining = itemsRemaining / itemsPerMs;
    const minutesRemaining = Math.round(msRemaining / 1000 / 60);

    if (minutesRemaining < 1) return "< 1 minut";
    if (minutesRemaining < 60) return `~${minutesRemaining} minuter`;
    return `~${Math.round(minutesRemaining / 60)} timmar`;
  };

  const eta = getETA();

  // Status color mapping
  const getStatusColor = () => {
    switch (item.status) {
      case "completed":
        return "bg-success/10 border-success/30";
      case "failed":
        return "bg-destructive/10 border-destructive/30";
      case "in_progress":
        return isStopped ? "bg-warning/10 border-warning/30" : "bg-primary/10 border-primary/30";
      default:
        return "bg-muted/10 border-muted/30";
    }
  };

  return (
    <Card className={`${getStatusColor()} border`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg flex items-center gap-2">
              {item.data_type}
              {item.status === "completed" && (
                <CheckCircle2 className="h-4 w-4 text-success" />
              )}
              {item.status === "failed" && (
                <AlertCircle className="h-4 w-4 text-destructive" />
              )}
              {item.status === "in_progress" && !isStopped && (
                <Loader2 className="h-4 w-4 text-primary animate-spin" />
              )}
            </CardTitle>
            <CardDescription className="flex items-center gap-4 mt-1">
              <Badge
                variant={
                  item.status === "completed"
                    ? "default"
                    : item.status === "failed"
                    ? "destructive"
                    : isStopped
                    ? "outline"
                    : "secondary"
                }
              >
                {isStopped ? "STOPPAD" : item.status}
              </Badge>
              {item.last_fetched_at && (
                <span className="text-xs flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {formatDistanceToNow(new Date(item.last_fetched_at), {
                    addSuffix: true,
                    locale: sv,
                  })}
                </span>
              )}
              {eta && (
                <span className="text-xs flex items-center gap-1 text-primary">
                  <TrendingUp className="h-3 w-3" />
                  ETA: {eta}
                </span>
              )}
            </CardDescription>
          </div>
          <div className="flex gap-2">
            {item.status !== "in_progress" && (
              <Button
                size="sm"
                onClick={onStart}
                disabled={isLoading}
              >
                <Play className="h-4 w-4 mr-1" />
                Starta
              </Button>
            )}
            {item.status === "in_progress" && !isStopped && (
              <Button
                size="sm"
                variant="destructive"
                onClick={onStop}
              >
                <StopCircle className="h-4 w-4 mr-1" />
                Stoppa
              </Button>
            )}
            {(item.status === "stopped" ||
              item.status === "failed" ||
              item.status === "completed") && (
              <Button
                size="sm"
                variant="outline"
                onClick={onReset}
              >
                <RotateCcw className="h-4 w-4 mr-1" />
                Återställ
              </Button>
            )}
            <Button
              size="sm"
              variant="ghost"
              onClick={onDelete}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>
              {item.items_fetched.toLocaleString()} / {item.total_items?.toLocaleString() || "?"} poster
            </span>
            <span className="font-semibold">{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
          {item.total_pages && (
            <p className="text-xs text-muted-foreground">
              Sida {item.current_page} / {item.total_pages}
            </p>
          )}
          {item.error_message && (
            <div className="p-2 bg-destructive/10 border border-destructive/30 rounded text-xs text-destructive mt-2">
              <strong>Fel:</strong> {item.error_message}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
