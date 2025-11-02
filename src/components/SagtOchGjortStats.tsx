import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  MessageSquare,
  FileEdit,
  HelpCircle,
  MessageCircle,
  Clock,
  Type,
  Calendar,
  TrendingUp
} from "lucide-react";

interface SagtOchGjortStatsProps {
  intressentId: string;
}

interface LedamotStatistik {
  intressent_id: string;
  fornamn: string;
  efternamn: string;
  parti: string;
  valkrets: string;
  totalt_antal_aktiviteter: number;
  antal_anforanden: number;
  antal_motioner: number;
  antal_fragor: number;
  antal_interpellationer: number;
  total_talartid_sekunder: number;
  totalt_antal_tecken: number;
  forsta_aktivitet: string;
  senaste_aktivitet: string;
}

export const SagtOchGjortStats = ({ intressentId }: SagtOchGjortStatsProps) => {
  const { data: stats, isLoading, error } = useQuery({
    queryKey: ['sagt-och-gjort-stats', intressentId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('v_ledamot_statistik')
        .select('*')
        .eq('intressent_id', intressentId)
        .single();

      if (error) throw error;
      return data as LedamotStatistik;
    },
    enabled: !!intressentId,
  });

  // Helper function to format time
  const formatTime = (seconds: number): string => {
    if (!seconds) return '0 min';
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (hours > 0) {
      return `${hours}h ${minutes}min`;
    }
    return `${minutes} min`;
  };

  // Helper function to format date
  const formatDate = (dateString: string): string => {
    if (!dateString) return 'Ingen data';
    return new Date(dateString).toLocaleDateString('sv-SE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48 mb-2" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !stats) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Sagt och gjort</CardTitle>
          <CardDescription>Ingen statistik tillgänglig</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Statistik för denna ledamot kunde inte hämtas.
          </p>
        </CardContent>
      </Card>
    );
  }

  const activities = [
    {
      label: 'Anföranden',
      count: stats.antal_anforanden,
      icon: MessageSquare,
      color: 'text-blue-500'
    },
    {
      label: 'Motioner',
      count: stats.antal_motioner,
      icon: FileEdit,
      color: 'text-green-500'
    },
    {
      label: 'Skriftliga frågor',
      count: stats.antal_fragor,
      icon: HelpCircle,
      color: 'text-orange-500'
    },
    {
      label: 'Interpellationer',
      count: stats.antal_interpellationer,
      icon: MessageCircle,
      color: 'text-purple-500'
    }
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Sagt och gjort
            </CardTitle>
            <CardDescription>
              Aktivitetsstatistik från riksdagen (2010/11 - )
            </CardDescription>
          </div>
          <Badge variant="outline" className="text-lg px-4 py-2">
            {stats.totalt_antal_aktiviteter.toLocaleString('sv-SE')} aktiviteter
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Activity breakdown */}
        <div className="grid grid-cols-2 gap-4">
          {activities.map((activity) => (
            <div
              key={activity.label}
              className="flex items-center gap-3 p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
            >
              <activity.icon className={`h-6 w-6 ${activity.color}`} />
              <div>
                <div className="text-2xl font-bold">
                  {activity.count.toLocaleString('sv-SE')}
                </div>
                <div className="text-xs text-muted-foreground">
                  {activity.label}
                </div>
              </div>
            </div>
          ))}
        </div>

        <Separator />

        {/* Speaking time and text statistics */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
            <Clock className="h-6 w-6 text-blue-500" />
            <div>
              <div className="text-xl font-bold">
                {formatTime(stats.total_talartid_sekunder)}
              </div>
              <div className="text-xs text-muted-foreground">
                Total talartid
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
            <Type className="h-6 w-6 text-green-500" />
            <div>
              <div className="text-xl font-bold">
                {(stats.totalt_antal_tecken / 1000).toFixed(0)}k
              </div>
              <div className="text-xs text-muted-foreground">
                Antal tecken
              </div>
            </div>
          </div>
        </div>

        <Separator />

        {/* Time period */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Aktivitetsperiod:</span>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-muted-foreground mb-1">Första aktivitet</div>
              <div className="font-medium">
                {formatDate(stats.forsta_aktivitet)}
              </div>
            </div>
            <div>
              <div className="text-muted-foreground mb-1">Senaste aktivitet</div>
              <div className="font-medium">
                {formatDate(stats.senaste_aktivitet)}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
