import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface TableStat {
  table_name: string;
  row_count: number;
  total_size: string;
  size_bytes: number;
  last_updated: string;
}

export interface BucketStat {
  name: string;
  file_count: number;
  total_size_mb: number;
}

export interface DatabaseStats {
  tables: TableStat[];
  buckets: BucketStat[];
  totalDatabaseSize: string;
  totalRows: number;
}

export const useDatabaseStats = () => {
  return useQuery<DatabaseStats>({
    queryKey: ['database-stats'],
    queryFn: async () => {
      // Hämta tabellstorlekar via SQL-funktion
      const { data: tablesData, error: tablesError } = await supabase
        .rpc('get_table_sizes');

      if (tablesError) {
        console.error('Error fetching table sizes:', tablesError);
        throw tablesError;
      }

      // Hämta bucket-information
      const { data: bucketsData } = await supabase.storage.listBuckets();
      
      const bucketStats: BucketStat[] = await Promise.all(
        (bucketsData || []).map(async (bucket) => {
          try {
            const { data: files } = await supabase.storage
              .from(bucket.name)
              .list('', { limit: 1000 });
            
            // Uppskatta total storlek (eftersom list() inte ger file sizes)
            const fileCount = files?.length || 0;
            const estimatedSizeMb = fileCount * 0.5; // Rough estimate: 500KB per fil
            
            return {
              name: bucket.name,
              file_count: fileCount,
              total_size_mb: estimatedSizeMb,
            };
          } catch (error) {
            console.error(`Error fetching files for bucket ${bucket.name}:`, error);
            return {
              name: bucket.name,
              file_count: 0,
              total_size_mb: 0,
            };
          }
        })
      );

      // Beräkna totaler
      const totalRows = (tablesData as TableStat[])?.reduce((sum, table) => sum + Number(table.row_count), 0) || 0;
      const totalSizeBytes = (tablesData as TableStat[])?.reduce((sum, table) => sum + Number(table.size_bytes), 0) || 0;
      const totalDatabaseSize = formatBytes(totalSizeBytes);

      return {
        tables: (tablesData as TableStat[]) || [],
        buckets: bucketStats,
        totalDatabaseSize,
        totalRows,
      };
    },
    refetchInterval: 30000, // Uppdatera varje 30 sekunder
  });
};

// Helper function to format bytes
function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}
