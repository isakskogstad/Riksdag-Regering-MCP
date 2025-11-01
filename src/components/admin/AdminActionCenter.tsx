import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Database, Download, CheckCircle, Settings, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const AdminActionCenter = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  const processFileQueue = async () => {
    setIsProcessing(true);
    try {
      const { error } = await supabase.functions.invoke('process-file-queue');
      if (error) throw error;
      toast({
        title: "Filnedladdning startad",
        description: "Köen bearbetas i bakgrunden",
      });
    } catch (error: any) {
      toast({
        title: "Fel",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const refreshStorageStats = async () => {
    try {
      await supabase.rpc('refresh_storage_statistics' as any);
      toast({
        title: "Statistik uppdaterad",
        description: "Storage-statistiken har uppdaterats",
      });
    } catch (error: any) {
      toast({
        title: "Fel",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">⚡ Snabbåtgärder</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          <Button 
            variant="default" 
            className="h-20 flex-col gap-2"
            onClick={() => navigate('/admin?tab=riksdagen')}
          >
            <Database className="h-5 w-5" />
            <span className="text-xs">Hämta Riksdagsdata</span>
          </Button>
          
          <Button 
            variant="secondary" 
            className="h-20 flex-col gap-2"
            onClick={processFileQueue}
            disabled={isProcessing}
          >
            <Download className="h-5 w-5" />
            <span className="text-xs">Kör filnedladdning</span>
          </Button>
          
          <Button 
            variant="outline" 
            className="h-20 flex-col gap-2"
            onClick={() => navigate('/admin?tab=files')}
          >
            <CheckCircle className="h-5 w-5" />
            <span className="text-xs">Kontrollera filer</span>
          </Button>
          
          <Button 
            variant="outline" 
            className="h-20 flex-col gap-2"
            onClick={refreshStorageStats}
          >
            <RefreshCw className="h-5 w-5" />
            <span className="text-xs">Uppdatera statistik</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
