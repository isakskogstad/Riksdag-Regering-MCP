import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";

const DataFetchTimeline = () => {
  const { data: timeline, isLoading } = useQuery({
    queryKey: ['data-fetch-timeline'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('admin_activity_log' as any)
        .select('created_at, action_type, metadata')
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;

      // Group by date
      const grouped: { [key: string]: { date: string; dokument: number; filer: number; fel: number } } = {};

      data?.forEach((item: any) => {
        const date = new Date(item.created_at).toLocaleDateString('sv-SE', { 
          month: 'short', 
          day: 'numeric' 
        });

        if (!grouped[date]) {
          grouped[date] = { date, dokument: 0, filer: 0, fel: 0 };
        }

        if (item.action_type.includes('complete') || item.action_type.includes('success')) {
          grouped[date].dokument += item.metadata?.items_count || 1;
        } else if (item.action_type.includes('file')) {
          grouped[date].filer += 1;
        } else if (item.action_type.includes('fail') || item.action_type.includes('error')) {
          grouped[date].fel += 1;
        }
      });

      return Object.values(grouped).reverse().slice(0, 7); // Last 7 days
    },
    refetchInterval: 60000,
  });

  if (isLoading || !timeline || timeline.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Hämtningshistorik (Senaste 7 dagarna)</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={timeline}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="dokument" fill="hsl(var(--success))" name="Dokument hämtade" />
            <Bar dataKey="filer" fill="hsl(var(--info))" name="Filer laddade" />
            <Bar dataKey="fel" fill="hsl(var(--destructive))" name="Fel" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default DataFetchTimeline;
