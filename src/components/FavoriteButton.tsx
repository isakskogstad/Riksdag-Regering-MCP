import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFavorites } from "@/hooks/useFavorites";
import { cn } from "@/lib/utils";

interface FavoriteButtonProps {
  tableName: string;
  documentId: string;
  size?: "sm" | "default" | "lg" | "icon";
}

export const FavoriteButton = ({ tableName, documentId, size = "sm" }: FavoriteButtonProps) => {
  const { isFavorite, isLoading, toggleFavorite } = useFavorites(tableName, documentId);

  return (
    <Button
      variant="ghost"
      size={size}
      onClick={() => toggleFavorite()}
      disabled={isLoading}
      className="gap-2"
    >
      <Heart
        className={cn(
          "h-4 w-4 transition-all",
          isFavorite && "fill-destructive text-destructive"
        )}
      />
      {size !== "icon" && (isFavorite ? "I favoriter" : "Spara")}
    </Button>
  );
};
