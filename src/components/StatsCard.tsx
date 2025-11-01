import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  iconColor?: string;
  variant?: "info" | "success" | "warning" | "error";
}

const StatsCard = ({ title, value, icon: Icon, iconColor, variant = "info" }: StatsCardProps) => {
  const variantStyles = {
    info: "text-info",
    success: "text-success",
    warning: "text-warning",
    error: "text-error",
  };

  const colorClass = iconColor || variantStyles[variant];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          {title}
        </CardTitle>
        <Icon className={cn("h-4 w-4", colorClass)} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
};

export default StatsCard;
