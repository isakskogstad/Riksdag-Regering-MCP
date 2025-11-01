import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { BulkOperations } from "./BulkOperations";
import { ProgressCard } from "./ProgressCard";

interface DataProcessControlProps {
  source: "riksdagen" | "regeringskansliet";
}

export const DataProcessControl = ({ source }: DataProcessControlProps) => {
  const { toast } = useToast();
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});

  const { data: progressItems, refetch } = useQuery({
    queryKey: ["admin-progress", source],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("data_fetch_progress")
        .select("*")
        .eq("source", source)
        .order("data_type");

      if (error) throw error;
      return data || [];
    },
    refetchInterval: 3000,
  });

  const { data: controlData } = useQuery({
    queryKey: ["admin-control", source],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("data_fetch_control")
        .select("*")
        .eq("source", source);

      if (error) throw error;
      return data || [];
    },
    refetchInterval: 3000,
  });

  const getControlStatus = (dataType: string) => {
    return controlData?.find((c: any) => c.data_type === dataType);
  };

  const startFetch = async (dataType: string) => {
    setLoadingStates((prev) => ({ ...prev, [dataType]: true }));
    try {
      const functionName =
        source === "riksdagen"
          ? "fetch-riksdagen-data"
          : "fetch-regeringskansliet-data";

      const { error } = await supabase.functions.invoke(functionName, {
        body: { dataType, paginate: true },
      });

      if (error) throw error;

      toast({
        title: "Hämtning startad",
        description: `${dataType} hämtas i bakgrunden`,
      });

      refetch();
    } catch (error: any) {
      toast({
        title: "Fel vid start",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoadingStates((prev) => ({ ...prev, [dataType]: false }));
    }
  };

  const stopFetch = async (dataType: string) => {
    try {
      const { error } = await supabase
        .from("data_fetch_control")
        .upsert(
          {
            source,
            data_type: dataType,
            should_stop: true,
          },
          { onConflict: "source,data_type" }
        );

      if (error) throw error;

      toast({
        title: "Stoppsignal skickad",
        description: `${dataType} kommer att stoppas`,
      });

      refetch();
    } catch (error: any) {
      toast({
        title: "Fel vid stopp",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const resetProgress = async (dataType: string) => {
    try {
      const { error } = await supabase
        .from("data_fetch_progress")
        .update({
          status: "pending",
          items_fetched: 0,
          current_page: 1,
          error_message: null,
        })
        .eq("source", source)
        .eq("data_type", dataType);

      if (error) throw error;

      // Reset control
      await supabase
        .from("data_fetch_control")
        .upsert(
          {
            source,
            data_type: dataType,
            should_stop: false,
          },
          { onConflict: "source,data_type" }
        );

      toast({
        title: "Progress återställd",
        description: `${dataType} kan startas igen`,
      });

      refetch();
    } catch (error: any) {
      toast({
        title: "Fel vid återställning",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const deleteProgress = async (dataType: string) => {
    try {
      const { error } = await supabase
        .from("data_fetch_progress")
        .delete()
        .eq("source", source)
        .eq("data_type", dataType);

      if (error) throw error;

      toast({
        title: "Progress raderad",
        description: `${dataType} progress har tagits bort`,
      });

      refetch();
    } catch (error: any) {
      toast({
        title: "Fel vid radering",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (!progressItems) return null;

  return (
    <div className="space-y-4">
      <BulkOperations 
        source={source} 
        progressItems={progressItems} 
        onRefetch={refetch} 
      />
      {progressItems.map((item) => {
        const control = getControlStatus(item.data_type);
        const isLoading = loadingStates[item.data_type];

        return (
          <ProgressCard
            key={item.id}
            item={item}
            control={control}
            isLoading={isLoading}
            onStart={() => startFetch(item.data_type)}
            onStop={() => stopFetch(item.data_type)}
            onReset={() => resetProgress(item.data_type)}
            onDelete={() => deleteProgress(item.data_type)}
          />
        );
      })}
    </div>
  );
};