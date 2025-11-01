import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useStorageStats = () => {
  return useQuery({
    queryKey: ['storage-stats'],
    queryFn: async () => {
      // Refresh materialized view
      await supabase.rpc('refresh_storage_statistics' as any);

      // Fetch bucket stats
      const { data: buckets, error } = await supabase
        .from('storage_statistics' as any)
        .select('*');

      if (error) throw error;

      // Calculate totals
      const totalSize = buckets?.reduce((sum: number, b: any) => sum + (b.total_size_bytes || 0), 0) || 0;
      const totalFiles = buckets?.reduce((sum: number, b: any) => sum + (b.file_count || 0), 0) || 0;

      // Estimate growth (simplified - would need historical data for accurate calculation)
      const growthPerMonth = totalSize * 0.1; // 10% growth estimate
      const quotaBytes = 1024 * 1024 * 1024; // 1 GB
      const usagePercent = (totalSize / quotaBytes) * 100;
      const monthsTo80Percent = ((quotaBytes * 0.8) - totalSize) / growthPerMonth;

      return {
        buckets: buckets || [],
        totalSize,
        totalFiles,
        quotaBytes,
        usagePercent,
        growthPerMonth,
        monthsTo80Percent: Math.max(0, monthsTo80Percent),
        averageFileSize: totalFiles > 0 ? totalSize / totalFiles : 0
      };
    },
    refetchInterval: 60000, // Every minute
  });
};
