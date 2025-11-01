import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PlayCircle, StopCircle, RotateCcw, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface BulkOperationsProps {
  source: "riksdagen" | "regeringskansliet";
  progressItems: any[];
  onRefetch: () => void;
}

export const BulkOperations = ({ source, progressItems, onRefetch }: BulkOperationsProps) => {
  const { toast } = useToast();
  const [isStartingAll, setIsStartingAll] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const startAll = async () => {
    setIsStartingAll(true);
    try {
      const functionName =
        source === "riksdagen"
          ? "fetch-riksdagen-data"
          : "fetch-regeringskansliet-data";

      // Start fetches for items that are not in_progress
      const itemsToStart = progressItems.filter(
        (item) => item.status !== "in_progress" && item.status !== "completed"
      );

      let successCount = 0;
      let errorCount = 0;

      for (const item of itemsToStart) {
        try {
          const { error } = await supabase.functions.invoke(functionName, {
            body: { dataType: item.data_type, paginate: true },
          });

          if (error) throw error;
          successCount++;
          
          // Small delay to avoid overwhelming the system
          await new Promise(resolve => setTimeout(resolve, 500));
        } catch (error) {
          console.error(`Failed to start ${item.data_type}:`, error);
          errorCount++;
        }
      }

      toast({
        title: "Bulk-start slutförd",
        description: `${successCount} datahämtningar startade, ${errorCount} misslyckades`,
      });

      onRefetch();
    } catch (error: any) {
      toast({
        title: "Fel vid bulk-start",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsStartingAll(false);
    }
  };

  const resetAllHanging = async () => {
    setIsResetting(true);
    try {
      // Reset all "in_progress" items that haven't been updated in 30 minutes
      const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000).toISOString();
      
      const { error } = await supabase
        .from("data_fetch_progress")
        .update({
          status: "failed",
          error_message: "Timeout - ingen aktivitet på 30 minuter",
        })
        .eq("source", source)
        .eq("status", "in_progress")
        .lt("updated_at", thirtyMinutesAgo);

      if (error) throw error;

      // Also reset control flags
      await supabase
        .from("data_fetch_control")
        .update({ should_stop: false })
        .eq("source", source);

      toast({
        title: "Hängande processer återställda",
        description: "Alla inaktiva datahämtningar har markerats som misslyckade",
      });

      onRefetch();
    } catch (error: any) {
      toast({
        title: "Fel vid återställning",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsResetting(false);
    }
  };

  const stopAll = async () => {
    try {
      // Set should_stop for all in_progress items
      const inProgressItems = progressItems.filter(
        (item) => item.status === "in_progress"
      );

      for (const item of inProgressItems) {
        await supabase
          .from("data_fetch_control")
          .upsert(
            {
              source,
              data_type: item.data_type,
              should_stop: true,
            },
            { onConflict: "source,data_type" }
          );
      }

      toast({
        title: "Stoppsignaler skickade",
        description: `${inProgressItems.length} datahämtningar kommer att stoppas`,
      });

      onRefetch();
    } catch (error: any) {
      toast({
        title: "Fel vid stopp",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const inProgressCount = progressItems.filter((item) => item.status === "in_progress").length;
  const pendingCount = progressItems.filter(
    (item) => item.status === "pending" || item.status === "failed" || item.status === "stopped"
  ).length;

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>Bulk-operationer</CardTitle>
        <CardDescription>
          Hantera flera datahämtningar samtidigt
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-2">
        <Button
          onClick={startAll}
          disabled={isStartingAll || pendingCount === 0}
          size="sm"
        >
          <PlayCircle className="h-4 w-4 mr-2" />
          {isStartingAll ? "Startar..." : `Starta alla (${pendingCount})`}
        </Button>

        <Button
          onClick={stopAll}
          disabled={inProgressCount === 0}
          variant="destructive"
          size="sm"
        >
          <StopCircle className="h-4 w-4 mr-2" />
          Stoppa alla ({inProgressCount})
        </Button>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              disabled={isResetting}
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              {isResetting ? "Återställer..." : "Återställ hängande"}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-warning" />
                Återställ hängande processer?
              </AlertDialogTitle>
              <AlertDialogDescription>
                Detta kommer att markera alla datahämtningar som är "in_progress" men inte har uppdaterats på 30 minuter som misslyckade. Du kan sedan starta om dem manuellt.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Avbryt</AlertDialogCancel>
              <AlertDialogAction onClick={resetAllHanging}>
                Återställ
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  );
};
