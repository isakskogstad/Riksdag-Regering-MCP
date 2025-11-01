import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Database, HardDrive, FileText, TrendingUp, Clock } from "lucide-react";
import { useDatabaseStats } from "@/hooks/useDatabaseStats";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDistanceToNow } from "date-fns";
import { sv } from "date-fns/locale";
import { Progress } from "@/components/ui/progress";
export const DatabaseStats = () => {
  const {
    data: stats,
    isLoading
  } = useDatabaseStats();
  if (isLoading) {
    return <Card>
        <CardHeader>
          <CardTitle>Databasöversikt</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-40 w-full" />
        </CardContent>
      </Card>;
  }

  // Hitta de 5 största tabellerna
  const topTables = stats?.tables.slice(0, 5) || [];

  // Beräkna färg baserat på senaste uppdatering
  const getUpdateStatus = (lastUpdated: string) => {
    const hoursSinceUpdate = (Date.now() - new Date(lastUpdated).getTime()) / (1000 * 60 * 60);
    if (hoursSinceUpdate < 1) return {
      variant: "default" as const,
      label: "Nyligen uppdaterad"
    };
    if (hoursSinceUpdate < 24) return {
      variant: "secondary" as const,
      label: "Uppdaterad idag"
    };
    if (hoursSinceUpdate < 168) return {
      variant: "outline" as const,
      label: "Uppdaterad denna vecka"
    };
    return {
      variant: "destructive" as const,
      label: "Gammal data"
    };
  };
  return <div className="space-y-4">
      {/* Snabbstatistik */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total databasstorlek</p>
                <p className="text-2xl font-bold">{stats?.totalDatabaseSize || '0 MB'}</p>
              </div>
              <Database className="h-8 w-8 text-primary opacity-75" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Totalt antal poster</p>
                <p className="text-2xl font-bold">{stats?.totalRows.toLocaleString('sv-SE') || '0'}</p>
              </div>
              <FileText className="h-8 w-8 text-primary opacity-75" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Antal tabeller</p>
                <p className="text-2xl font-bold">{stats?.tables.length || 0}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-primary opacity-75" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Storage buckets</p>
                <p className="text-2xl font-bold">{stats?.buckets.length || 0}</p>
              </div>
              <HardDrive className="h-8 w-8 text-primary opacity-75" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top 5 största tabeller */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Största tabellerna
          </CardTitle>
          <CardDescription>
            De 5 tabellerna som tar mest plats i databasen
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {topTables.map(table => {
          const updateStatus = getUpdateStatus(table.last_updated);
          const maxSize = stats?.tables[0]?.size_bytes || 1;
          const percentage = table.size_bytes / maxSize * 100;
          return <div key={table.table_name} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium">{table.table_name}</p>
                      <Badge variant={updateStatus.variant} className="text-xs">
                        {updateStatus.label}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 mt-1">
                      <p className="text-xs text-muted-foreground">
                        {table.row_count.toLocaleString('sv-SE')} poster
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {table.total_size}
                      </p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatDistanceToNow(new Date(table.last_updated), {
                      addSuffix: true,
                      locale: sv
                    })}
                      </p>
                    </div>
                  </div>
                </div>
                <Progress value={percentage} className="h-2" />
              </div>;
        })}
        </CardContent>
      </Card>

      {/* Storage buckets */}
      <Card>
        
        <CardContent>
          <div className="space-y-3">
            {stats?.buckets.map(bucket => <div key={bucket.name} className="flex items-center justify-between p-3 border rounded bg-card">
                <div className="flex items-center gap-3">
                  <HardDrive className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">{bucket.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {bucket.file_count.toLocaleString('sv-SE')} filer
                    </p>
                  </div>
                </div>
                <Badge variant="outline">
                  ~{bucket.total_size_mb.toFixed(1)} MB
                </Badge>
              </div>)}
          </div>
        </CardContent>
      </Card>
    </div>;
};