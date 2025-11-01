import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Calendar, Filter, X } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface AdvancedFiltersProps {
  dateFrom: string;
  dateTo: string;
  selectedCategories: string[];
  availableCategories: string[];
  onDateFromChange: (date: string) => void;
  onDateToChange: (date: string) => void;
  onCategoryToggle: (category: string) => void;
  onClearFilters: () => void;
}

export const AdvancedFilters = ({
  dateFrom,
  dateTo,
  selectedCategories,
  availableCategories,
  onDateFromChange,
  onDateToChange,
  onCategoryToggle,
  onClearFilters,
}: AdvancedFiltersProps) => {
  const hasActiveFilters = dateFrom || dateTo || selectedCategories.length > 0;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Filter className="h-4 w-4" />
          Filter
          {hasActiveFilters && (
            <Badge variant="secondary" className="ml-2">
              {(dateFrom ? 1 : 0) + (dateTo ? 1 : 0) + selectedCategories.length}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold">Avancerade filter</h4>
            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={onClearFilters}>
                <X className="h-4 w-4 mr-1" />
                Rensa
              </Button>
            )}
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Från datum
            </Label>
            <Input
              type="date"
              value={dateFrom}
              onChange={(e) => onDateFromChange(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Till datum
            </Label>
            <Input
              type="date"
              value={dateTo}
              onChange={(e) => onDateToChange(e.target.value)}
            />
          </div>

          {availableCategories.length > 0 && (
            <div className="space-y-2">
              <Label>Kategorier</Label>
              <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                {availableCategories.map((category) => (
                  <Badge
                    key={category}
                    variant={selectedCategories.includes(category) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => onCategoryToggle(category)}
                  >
                    {category}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};
