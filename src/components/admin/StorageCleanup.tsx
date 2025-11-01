import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Trash2, AlertTriangle, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CleanupCandidate {
  path: string;
  bucket: string;
  size: number;
  reason: string;
  severity: 'high' | 'medium' | 'low';
}

export const StorageCleanup = () => {
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set());
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();

  const { data: candidates, isLoading, refetch } = useQuery({
    queryKey: ['storage-cleanup'],
    queryFn: async () => {
      const cleanupList: CleanupCandidate[] = [];

      // Check both buckets
      const buckets = ['regeringskansliet-files', 'riksdagen-images'];
      
      for (const bucket of buckets) {
        const { data: files } = await supabase.storage.from(bucket).list('', {
          limit: 1000,
          sortBy: { column: 'created_at', order: 'asc' }
        });

        if (!files) continue;

        for (const file of files) {
          const filePath = file.name;
          const fileSize = file.metadata?.size || 0;
          const createdAt = file.created_at ? new Date(file.created_at) : new Date();
          const ageInDays = (Date.now() - createdAt.getTime()) / (1000 * 60 * 60 * 24);

          // Large files (> 10 MB)
          if (fileSize > 10 * 1024 * 1024) {
            cleanupList.push({
              path: filePath,
              bucket,
              size: fileSize,
              reason: `Stor fil (${(fileSize / 1024 / 1024).toFixed(1)} MB) - överväg komprimering`,
              severity: 'medium'
            });
          }

          // Old files (> 365 days)
          if (ageInDays > 365) {
            cleanupList.push({
              path: filePath,
              bucket,
              size: fileSize,
              reason: `Gammal fil (${Math.floor(ageInDays)} dagar) - ej använd länge`,
              severity: 'low'
            });
          }
        }
      }

      return cleanupList.sort((a, b) => b.size - a.size).slice(0, 50);
    },
  });

  const toggleFile = (path: string) => {
    setSelectedFiles(prev => {
      const next = new Set(prev);
      if (next.has(path)) {
        next.delete(path);
      } else {
        next.add(path);
      }
      return next;
    });
  };

  const deleteSelected = async () => {
    if (selectedFiles.size === 0) return;

    setIsDeleting(true);
    try {
      const filesByBucket: Record<string, string[]> = {};
      candidates?.forEach(c => {
        if (selectedFiles.has(c.path)) {
          if (!filesByBucket[c.bucket]) filesByBucket[c.bucket] = [];
          filesByBucket[c.bucket].push(c.path);
        }
      });

      for (const [bucket, paths] of Object.entries(filesByBucket)) {
        const { error } = await supabase.storage.from(bucket).remove(paths);
        if (error) throw error;
      }

      const savedSpace = candidates
        ?.filter(c => selectedFiles.has(c.path))
        .reduce((sum, c) => sum + c.size, 0) || 0;

      toast({
        title: "Filer raderade",
        description: `${selectedFiles.size} filer raderade. Sparade ${(savedSpace / 1024 / 1024).toFixed(1)} MB`,
      });

      setSelectedFiles(new Set());
      refetch();
    } catch (error: any) {
      toast({
        title: "Fel",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const calculateSavings = () => {
    const total = candidates
      ?.filter(c => selectedFiles.has(c.path))
      .reduce((sum, c) => sum + c.size, 0) || 0;
    return (total / 1024 / 1024).toFixed(1);
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Storage-rensning</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin mr-2" />
            <span>Analyserar filer...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>🧹 Storage-rensning</span>
          {selectedFiles.size > 0 && (
            <Button 
              variant="destructive" 
              size="sm"
              onClick={deleteSelected}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4 mr-2" />
              )}
              Radera valda ({selectedFiles.size}) - Spara {calculateSavings()} MB
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Alert className="mb-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Kontrollera noga innan du raderar filer. Raderade filer kan inte återställas.
          </AlertDescription>
        </Alert>

        {!candidates || candidates.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            ✅ Inga rensningskandidater hittades. Din storage ser bra ut!
          </div>
        ) : (
          <div className="border rounded-lg max-h-[400px] overflow-y-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12"></TableHead>
                  <TableHead>Filväg</TableHead>
                  <TableHead>Storlek</TableHead>
                  <TableHead>Anledning</TableHead>
                  <TableHead>Åtgärd</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {candidates.map((candidate) => (
                  <TableRow key={candidate.path}>
                    <TableCell>
                      <Checkbox
                        checked={selectedFiles.has(candidate.path)}
                        onCheckedChange={() => toggleFile(candidate.path)}
                      />
                    </TableCell>
                    <TableCell className="font-mono text-xs truncate max-w-xs">
                      {candidate.path}
                    </TableCell>
                    <TableCell className="text-sm">
                      {(candidate.size / 1024 / 1024).toFixed(2)} MB
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {candidate.reason}
                    </TableCell>
                    <TableCell>
                      <Badge variant={
                        candidate.severity === 'high' ? 'destructive' :
                        candidate.severity === 'medium' ? 'default' : 'outline'
                      }>
                        {candidate.severity === 'high' ? 'Rekommenderas' : 
                         candidate.severity === 'medium' ? 'Överväg' : 'Valfri'}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
