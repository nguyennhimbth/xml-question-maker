
import React from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CheckSquare, Square, Trash2, Download } from 'lucide-react';

interface DifficultyControlsProps {
  sortBy: string;
  onSortChange: (value: string) => void;
  selectedCount: number;
  totalCount: number;
  onSelectAll: () => void;
  onUnselectAll: () => void;
  onDeleteSelected: () => void;
  onExportSelected: () => void;
}

const DifficultyControls: React.FC<DifficultyControlsProps> = ({
  sortBy,
  onSortChange,
  selectedCount,
  totalCount,
  onSelectAll,
  onUnselectAll,
  onDeleteSelected,
  onExportSelected
}) => {
  const getDifficultyLabel = (value: string) => {
    switch (value) {
      case 'difficulty-asc': return 'Difficulty: Easy → Hard';
      case 'difficulty-desc': return 'Difficulty: Hard → Easy';
      case 'default': return 'Default Order';
      default: return 'Sort by...';
    }
  };

  return (
    <div className="flex flex-wrap gap-2 items-center justify-between p-4 bg-muted/50 rounded-lg">
      <div className="flex items-center gap-2">
        <Select value={sortBy} onValueChange={onSortChange}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Sort by...">
              {getDifficultyLabel(sortBy)}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="default">Default Order</SelectItem>
            <SelectItem value="difficulty-asc">Difficulty: Easy → Hard</SelectItem>
            <SelectItem value="difficulty-desc">Difficulty: Hard → Easy</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">
          {selectedCount} of {totalCount} selected
        </span>
        
        <Button
          variant="outline"
          size="sm"
          onClick={onSelectAll}
          disabled={selectedCount === totalCount}
        >
          <CheckSquare className="h-4 w-4 mr-1" />
          Select All
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={onUnselectAll}
          disabled={selectedCount === 0}
        >
          <Square className="h-4 w-4 mr-1" />
          Unselect All
        </Button>
        
        <Button
          variant="destructive"
          size="sm"
          onClick={onDeleteSelected}
          disabled={selectedCount === 0}
        >
          <Trash2 className="h-4 w-4 mr-1" />
          Delete Selected
        </Button>
        
        <Button
          variant="default"
          size="sm"
          onClick={onExportSelected}
          disabled={selectedCount === 0}
        >
          <Download className="h-4 w-4 mr-1" />
          Export Selected
        </Button>
      </div>
    </div>
  );
};

export default DifficultyControls;
