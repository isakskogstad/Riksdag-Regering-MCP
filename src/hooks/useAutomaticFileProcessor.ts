import { useState, useEffect, useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const SINGLETON_ID = "00000000-0000-0000-0000-000000000001";
const BATCH_DELAY = 2000; // 2 seconds between batches
const CHECK_DELAY = 30000; // 30 seconds when no files
const HEARTBEAT_INTERVAL = 10000; // 10 seconds

interface QueueControl {
  is_running: boolean;
  total_processed: number;
  current_batch: number;
  last_run_at: string | null;
  started_at: string | null;
  stopped_at: string | null;
}

export const useAutomaticFileProcessor = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);
  const [totalProcessed, setTotalProcessed] = useState(0);
  const [currentBatch, setCurrentBatch] = useState(0);
  const [filesPerMinute, setFilesPerMinute] = useState(0);
  const [activityLog, setActivityLog] = useState<Array<{ id: string; timestamp: string; message: string }>>([]);
  const { toast } = useToast();
  
  const isRunningRef = useRef(false);
  const startTimeRef = useRef<Date | null>(null);

  // Fetch queue status
  const fetchQueueStatus = useCallback(async () => {
    try {
      const { data: control } = await supabase
        .from("file_queue_control")
        .select("*")
        .eq("id", SINGLETON_ID)
        .single();

      if (control) {
        setIsRunning(control.is_running);
        setTotalProcessed(control.total_processed);
        setCurrentBatch(control.current_batch);
        isRunningRef.current = control.is_running;
      }

      const { count } = await supabase
        .from("file_download_queue")
        .select("*", { count: "exact", head: true })
        .eq("status", "pending");

      setPendingCount(count || 0);
    } catch (error) {
      console.error("Error fetching queue status:", error);
    }
  }, []);

  // Add to activity log
  const addLog = useCallback((message: string) => {
    const timestamp = new Date().toLocaleTimeString("sv-SE");
    setActivityLog(prev => [
      { id: Date.now().toString(), timestamp, message },
      ...prev.slice(0, 49) // Keep last 50 logs
    ]);
  }, []);

  // Process next batch
  const processNextBatch = useCallback(async (): Promise<void> => {
    if (!isRunningRef.current) {
      return;
    }

    try {
      // Check pending count
      const { count } = await supabase
        .from("file_download_queue")
        .select("*", { count: "exact", head: true })
        .eq("status", "pending");

      if (!count || count === 0) {
        addLog("Inga filer i kön, väntar 30 sekunder...");
        await new Promise(resolve => setTimeout(resolve, CHECK_DELAY));
        
        if (isRunningRef.current) {
          return processNextBatch();
        }
        return;
      }

      addLog(`Startar batch med ${Math.min(count, 100)} filer...`);

      // Invoke edge function
      const { data, error } = await supabase.functions.invoke("process-file-queue");

      if (error) {
        throw error;
      }

      const result = data as { processed?: number; failed?: number };
      const processed = result.processed || 0;

      // Update control table
      const { error: updateError } = await supabase
        .from("file_queue_control")
        .update({
          total_processed: totalProcessed + processed,
          current_batch: currentBatch + 1,
          last_run_at: new Date().toISOString(),
        })
        .eq("id", SINGLETON_ID);

      if (updateError) throw updateError;

      addLog(`✓ Batch klar: ${processed} filer processade`);

      // Calculate files per minute
      if (startTimeRef.current) {
        const elapsed = (Date.now() - startTimeRef.current.getTime()) / 60000;
        const rate = Math.round((totalProcessed + processed) / elapsed);
        setFilesPerMinute(rate);
      }

      // Fetch updated status
      await fetchQueueStatus();

      // Wait before next batch
      await new Promise(resolve => setTimeout(resolve, BATCH_DELAY));

      // Continue if still running
      if (isRunningRef.current) {
        return processNextBatch();
      }
    } catch (error: any) {
      console.error("Batch processing error:", error);
      addLog(`❌ Fel vid batch: ${error.message}`);
      
      toast({
        title: "Fel vid filprocessing",
        description: error.message || "Okänt fel",
        variant: "destructive",
      });

      // Wait before retry
      await new Promise(resolve => setTimeout(resolve, CHECK_DELAY));
      
      if (isRunningRef.current) {
        return processNextBatch();
      }
    }
  }, [totalProcessed, currentBatch, fetchQueueStatus, addLog, toast]);

  // Start auto-process
  const startAutoProcess = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Ej inloggad");

      // Update control table
      const { error } = await supabase
        .from("file_queue_control")
        .update({
          is_running: true,
          started_by: user.id,
          started_at: new Date().toISOString(),
          stopped_at: null,
        })
        .eq("id", SINGLETON_ID);

      if (error) throw error;

      setIsRunning(true);
      isRunningRef.current = true;
      startTimeRef.current = new Date();
      
      addLog("🚀 Auto-process startad!");
      
      toast({
        title: "Auto-process startad",
        description: "Filnedladdning pågår automatiskt",
      });

      // Log admin activity
      await supabase.rpc("log_admin_activity", {
        p_action_type: "auto_process_start",
        p_description: "Startade automatisk filnedladdning",
      });

      // Start processing
      processNextBatch();
    } catch (error: any) {
      console.error("Error starting auto-process:", error);
      toast({
        title: "Kunde inte starta",
        description: error.message,
        variant: "destructive",
      });
    }
  }, [processNextBatch, addLog, toast]);

  // Stop auto-process
  const stopAutoProcess = useCallback(async () => {
    try {
      isRunningRef.current = false;
      
      const { error } = await supabase
        .from("file_queue_control")
        .update({
          is_running: false,
          stopped_at: new Date().toISOString(),
        })
        .eq("id", SINGLETON_ID);

      if (error) throw error;

      setIsRunning(false);
      startTimeRef.current = null;
      
      addLog("⏸️ Auto-process stoppad");
      
      toast({
        title: "Auto-process stoppad",
        description: "Filnedladdning pausad",
      });

      // Log admin activity
      await supabase.rpc("log_admin_activity", {
        p_action_type: "auto_process_stop",
        p_description: "Stoppade automatisk filnedladdning",
      });
    } catch (error: any) {
      console.error("Error stopping auto-process:", error);
      toast({
        title: "Kunde inte stoppa",
        description: error.message,
        variant: "destructive",
      });
    }
  }, [addLog, toast]);

  // Heartbeat check
  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(fetchQueueStatus, HEARTBEAT_INTERVAL);
    return () => clearInterval(interval);
  }, [isRunning, fetchQueueStatus]);

  // Cleanup on unmount
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (isRunningRef.current) {
        supabase
          .from("file_queue_control")
          .update({ is_running: false, stopped_at: new Date().toISOString() })
          .eq("id", SINGLETON_ID);
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchQueueStatus();
  }, [fetchQueueStatus]);

  return {
    isRunning,
    pendingCount,
    totalProcessed,
    currentBatch,
    filesPerMinute,
    activityLog,
    startAutoProcess,
    stopAutoProcess,
  };
};
