import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useIsAdmin = () => {
  const { data: isAdmin, isLoading } = useQuery({
    queryKey: ["is-admin"],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("is_admin");
      
      if (error) {
        console.error("Error checking admin status:", error);
        return false;
      }
      
      return data === true;
    },
  });

  return { isAdmin: isAdmin ?? false, isLoading };
};