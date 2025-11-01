import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { logActivity } from "@/hooks/useActivityStream";
import { batchOperationSchema, validateInput } from "@/lib/validationSchemas";

const BatchOperations = () => {
  const [selectedTable, setSelectedTable] = useState('regeringskansliet_sakrad');
  const [selectedOperation, setSelectedOperation] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [estimatedCount, setEstimatedCount] = useState<number | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const { toast } = useToast();

  const tables = [
    { value: 'regeringskansliet_sakrad', label: 'Sakråd' },
    { value: 'regeringskansliet_propositioner', label: 'Propositioner' },
    { value: 'regeringskansliet_pressmeddelanden', label: 'Pressmeddelanden' },
  ];

  const operations = [
    { 
      value: 'fetch_missing_attachments', 
      label: 'Hämta bilagor för alla dokument utan filer',
      description: 'Lägger till saknade bilagor i nedladdningskön'
    },
    { 
      value: 'cleanup_old_files', 
      label: 'Radera alla filer äldre än 2 år',
      description: 'Rensar storage från gamla filer'
    },
  ];

  const estimateImpact = async () => {
    if (!selectedOperation) return;

    try {
      if (selectedOperation === 'fetch_missing_attachments') {
        const { count } = await supabase
          .from(selectedTable as any)
          .select('*', { count: 'exact', head: true })
          .or('local_files.is.null,local_files.eq.[]');
        
        setEstimatedCount(count || 0);
      } else if (selectedOperation === 'cleanup_old_files') {
        const twoYearsAgo = new Date();
        twoYearsAgo.setFullYear(twoYearsAgo.getFullYear() - 2);
        
        // This is a simplified estimate
        setEstimatedCount(10); // Placeholder
      }
    } catch (error) {
      console.error('Estimation error:', error);
    }
  };

  const runBatchOperation = async () => {
    // Validera input
    const validation = validateInput(batchOperationSchema, {
      selectedTable,
      selectedOperation
    });
    
    if (!validation.success) {
      setValidationError(validation.error);
      toast({
        title: "Valideringsfel",
        description: validation.error,
        variant: "destructive",
      });
      return;
    }

    setValidationError(null);
    setIsProcessing(true);

    try {
      if (selectedOperation === 'fetch_missing_attachments') {
        // Fetch documents without files
        const { data: docs, error } = await supabase
          .from(selectedTable as any)
          .select('id, bilagor')
          .or('local_files.is.null,local_files.eq.[]')
          .not('bilagor', 'is', null)
          .limit(100);

        if (error) throw error;

        let queuedCount = 0;
        for (const doc of docs || []) {
          if (Array.isArray((doc as any).bilagor)) {
            for (const bilaga of (doc as any).bilagor) {
              const filename = bilaga.titel || bilaga.url?.split('/').pop() || 'file.pdf';
              const storagePath = `${selectedTable.replace('regeringskansliet_', '')}/${new Date().getFullYear()}/${(doc as any).id}/${filename}`;

              await supabase.from('file_download_queue' as any).insert({
                file_url: bilaga.url,
                storage_path: storagePath,
                bucket: 'regeringskansliet-files',
                table_name: selectedTable,
                record_id: (doc as any).id,
                column_name: 'local_files',
                status: 'pending'
              });

              queuedCount++;
            }
          }
        }

        await logActivity(
          'batch_operation',
          `Batch-operation: Lade till ${queuedCount} filer i nedladdningskö för ${selectedTable}`,
          { operation: selectedOperation, count: queuedCount, table: selectedTable }
        );

        toast({
          title: "Batch-operation klar",
          description: `${queuedCount} filer har lagts till i nedladdningskön`,
        });
      }
    } catch (error: any) {
      toast({
        title: "Fel vid batch-operation",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Batch-operationer</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {validationError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{validationError}</AlertDescription>
            </Alert>
          )}
          
          <div>
            <Label>Välj tabell</Label>
            <Select value={selectedTable} onValueChange={setSelectedTable}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {tables.map(t => (
                  <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Välj åtgärd</Label>
            <RadioGroup value={selectedOperation} onValueChange={(val) => {
              setSelectedOperation(val);
              setEstimatedCount(null);
            }}>
              {operations.map(op => (
                <div key={op.value} className="flex items-start space-x-2">
                  <RadioGroupItem value={op.value} id={op.value} />
                  <div>
                    <Label htmlFor={op.value} className="font-normal cursor-pointer">
                      {op.label}
                    </Label>
                    <p className="text-xs text-muted-foreground">{op.description}</p>
                  </div>
                </div>
              ))}
            </RadioGroup>
          </div>

          {selectedOperation && (
            <>
              <Button variant="outline" size="sm" onClick={estimateImpact}>
                Förhandsgranska påverkan
              </Button>

              {estimatedCount !== null && (
                <Alert>
                  <AlertDescription>
                    <strong>Förhandsvisning:</strong> {estimatedCount} poster kommer påverkas
                    <br />
                    <span className="text-xs">Estimerad tid: ~{Math.ceil(estimatedCount / 20)} minuter</span>
                  </AlertDescription>
                </Alert>
              )}
            </>
          )}

          <Button 
            onClick={runBatchOperation}
            disabled={isProcessing || !selectedOperation}
            className="w-full"
          >
            {isProcessing ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Kör batch-operation...
              </>
            ) : (
              '🚀 Kör batch-operation'
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default BatchOperations;
