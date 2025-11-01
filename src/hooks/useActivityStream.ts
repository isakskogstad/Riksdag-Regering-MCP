import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface ActivityItem {
  id: string;
  action_type: string;
  description: string;
  metadata?: any;
  created_at: string;
}

export const useActivityStream = () => {
  return useQuery({
    queryKey: ['activity-stream'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('admin_activity_log' as any)
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;

      return (data || []) as any as ActivityItem[];
    },
    refetchInterval: 5000, // Every 5 seconds
  });
};

export const logActivity = async (
  actionType: string,
  description: string,
  metadata?: any
) => {
  try {
    await supabase.rpc('log_admin_activity' as any, {
      p_action_type: actionType,
      p_description: description,
      p_metadata: metadata || null
    });
  } catch (error) {
    console.error('Failed to log activity:', error);
  }
};
