
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ArrowUp, ArrowDown, Check, Square, Trash } from 'lucide-react';

interface DifficultyControlsProps {
  sortOrder: 'asc' | 'desc' | 'none';
  onSortChange: (order: 'asc' | 'desc' | 'none') => void;
  onSelectAll: () => void;
  onUnselectAll: () => void;
  onDeleteSelected: () => void;
  selectedCount: number;
  totalCount: number;
}

const DifficultyControls: React.FC<DifficultyControlsProps> = ({
  sortOrder,
  onSortChange,
  onSelectAll,
  onUnselectAll,
  onDeleteSelected,
  selectedCount,
  totalCount
}) => {
  const getDifficultyLabel = (level: 1 | 2 | 3) => {
    switch (level) {
      case 1: return 'Easy';
      case 2: return 'Medium';
      case 3: return 'Hard';
      default: return 'Easy';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Question Controls</span>
          <div className="flex items-center gap-2">
            <Badge variant="outline">{selectedCount} of {totalCount} selected</Badge>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2 mb-4">
          <Select value={sortOrder} onValueChange={(value: 'asc' | 'desc' | 'none') => onSortChange(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by difficulty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">No sorting</SelectItem>
              <SelectItem value="asc">
                <div className="flex items-center gap-2">
                  <ArrowUp className="h-4 w-4" />
                  Easy to Hard
                </div>
              </SelectItem>
              <SelectItem value="desc">
                <div className="flex items-center gap-2">
                  <ArrowDown className="h-4 w-4" />
                  Hard to Easy
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" size="sm" onClick={onSelectAll}>
            <Check className="h-4 w-4 mr-1" />
            Select All
          </Button>
          
          <Button variant="outline" size="sm" onClick={onUnselectAll}>
            <Square className="h-4 w-4 mr-1" />
            Unselect All
          </Button>
          
          <Button 
            variant="destructive" 
            size="sm" 
            onClick={onDeleteSelected}
            disabled={selectedCount === 0}
          >
            <Trash className="h-4 w-4 mr-1" />
            Delete Selected ({selectedCount})
          </Button>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>Difficulty Levels:</span>
          <Badge variant="secondary">1 = Easy</Badge>
          <Badge variant="secondary">2 = Medium</Badge>
          <Badge variant="secondary">3 = Hard</Badge>
        </div>
      </CardContent>
    </Card>
  );
};

export default DifficultyControls;
