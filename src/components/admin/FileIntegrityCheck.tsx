import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, AlertCircle, XCircle, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";

const FileIntegrityCheck = () => {
  const [isChecking, setIsChecking] = useState(false);
  const { toast } = useToast();

  const { data: lastCheck, refetch } = useQuery({
    queryKey: ['file-integrity-last-check'],
    queryFn: async () => {
      const { data } = await supabase
        .from('admin_activity_log' as any)
        .select('created_at, metadata')
        .eq('action_type', 'file_integrity_check')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      return data as any;
    },
  });

  const runIntegrityCheck = async () => {
    setIsChecking(true);
    try {
      const tables = [
        'regeringskansliet_sakrad',
        'regeringskansliet_propositioner',
        'regeringskansliet_pressmeddelanden'
      ];

      let totalValid = 0;
      let totalBroken = 0;
      let totalChecked = 0;

      for (const tableName of tables) {
        const { data: docs } = await supabase
          .from(tableName as any)
          .select('id, local_files')
          .not('local_files', 'is', null)
          .limit(50); // Limit for performance

        if (!docs) continue;

        for (const doc of docs) {
          const files = Array.isArray((doc as any).local_files) ? (doc as any).local_files : [(doc as any).local_files];

          for (const file of files) {
            totalChecked++;
            try {
              const url = typeof file === 'string' ? file : file.url;
              const response = await fetch(url, { method: 'HEAD' });
              
              if (response.ok) {
                totalValid++;
              } else {
                totalBroken++;
              }
            } catch (e) {
              totalBroken++;
            }
          }
        }
      }

      // Log the result
      await supabase.rpc('log_admin_activity' as any, {
        p_action_type: 'file_integrity_check',
        p_description: `Integritetskontroll klar: ${totalValid}/${totalChecked} filer OK`,
        p_metadata: { totalChecked, totalValid, totalBroken }
      });

      toast({
        title: "Integritetskontroll klar",
        description: `${totalValid} av ${totalChecked} filer är OK`,
      });

      refetch();
    } catch (error: any) {
      toast({
        title: "Fel vid kontroll",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsChecking(false);
    }
  };

  const results = lastCheck?.metadata as any;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Fil-integritetskontroll</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {lastCheck && results && (
            <Alert>
              <AlertDescription>
                <div className="mb-2">
                  <strong>Senaste check:</strong>{' '}
                  {new Date(lastCheck.created_at).toLocaleString('sv-SE')}
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-success" />
                    <span>
                      {results.totalValid || 0} filer OK 
                      ({((results.totalValid / results.totalChecked) * 100).toFixed(1)}%)
                    </span>
                  </div>
                  {results.totalBroken > 0 && (
                    <div className="flex items-center gap-2">
                      <XCircle className="h-4 w-4 text-destructive" />
                      <span>
                        {results.totalBroken} brutna länkar 
                        ({((results.totalBroken / results.totalChecked) * 100).toFixed(1)}%)
                      </span>
                    </div>
                  )}
                </div>
              </AlertDescription>
            </Alert>
          )}

          <div className="flex gap-2">
            <Button
              onClick={runIntegrityCheck}
              disabled={isChecking}
            >
              {isChecking ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Kontrollerar...
                </>
              ) : (
                '▶ Kör ny kontroll'
              )}
            </Button>
          </div>

          <Alert>
            <AlertDescription className="text-xs">
              Kontrollerar ett urval av filer för att verifiera att URL:er fungerar. 
              Tar cirka 30 sekunder.
            </AlertDescription>
          </Alert>
        </div>
      </CardContent>
    </Card>
  );
};

export default FileIntegrityCheck;
