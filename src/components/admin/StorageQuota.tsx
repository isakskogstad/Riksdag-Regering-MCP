import { useStorageStats } from "@/hooks/useStorageStats";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

const StorageQuota = () => {
  const { data: stats, isLoading } = useStorageStats();

  if (isLoading || !stats) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Storage Quota</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4 text-muted-foreground">Laddar...</div>
        </CardContent>
      </Card>
    );
  }

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Storage Quota</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span>Använt: {formatBytes(stats.totalSize)} / {formatBytes(stats.quotaBytes)}</span>
            <span className="font-semibold">{stats.usagePercent.toFixed(1)}%</span>
          </div>
          <Progress value={stats.usagePercent} className="h-2" />
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Filer</p>
            <p className="font-semibold">{stats.totalFiles.toLocaleString('sv-SE')} st</p>
          </div>
          <div>
            <p className="text-muted-foreground">Genomsnittlig filstorlek</p>
            <p className="font-semibold">{formatBytes(stats.averageFileSize)}</p>
          </div>
        </div>

        <div className="pt-2 border-t">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-muted-foreground">Tillväxthastighet</span>
            <span>~{formatBytes(stats.growthPerMonth)}/månad</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Estimerad tid till 80%</span>
            <span>
              {stats.monthsTo80Percent < 1 
                ? 'Mindre än 1 månad' 
                : `${Math.round(stats.monthsTo80Percent)} månader`}
            </span>
          </div>
        </div>

        {stats.usagePercent > 80 && (
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Överväg att komprimera PDF-filer större än 5 MB eller rensa gamla filer
            </AlertDescription>
          </Alert>
        )}

        <div className="pt-2 border-t">
          <p className="text-sm font-semibold mb-2">Per bucket:</p>
          <div className="space-y-2">
            {stats.buckets.map((bucket: any) => (
              <div key={bucket.bucket_name} className="flex justify-between text-sm">
                <span className="text-muted-foreground">{bucket.bucket_name}</span>
                <span>{formatBytes(bucket.total_size_bytes || 0)}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StorageQuota;
