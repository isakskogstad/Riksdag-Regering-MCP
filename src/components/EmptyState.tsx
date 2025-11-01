import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

interface EmptyStateProps {
  message: string;
  suggestion?: string;
}

const EmptyState = ({ message, suggestion }: EmptyStateProps) => {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-12">
        <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">{message}</h3>
        {suggestion && (
          <p className="text-sm text-muted-foreground text-center max-w-md">
            {suggestion}
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default EmptyState;
