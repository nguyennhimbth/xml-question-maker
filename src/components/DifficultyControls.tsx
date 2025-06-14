
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ArrowUp, ArrowDown, CheckSquare, Square, Trash2 } from 'lucide-react';

interface DifficultyControlsProps {
  sortOrder: 'asc' | 'desc' | null;
  onSortChange: (order: 'asc' | 'desc' | null) => void;
  selectedCount: number;
  totalCount: number;
  onSelectAll: () => void;
  onUnselectAll: () => void;
  onDeleteSelected: () => void;
  allSelected: boolean;
  noneSelected: boolean;
}

const DifficultyControls: React.FC<DifficultyControlsProps> = ({
  sortOrder,
  onSortChange,
  selectedCount,
  totalCount,
  onSelectAll,
  onUnselectAll,
  onDeleteSelected,
  allSelected,
  noneSelected
}) => {
  const getDifficultyLabel = (difficulty: number) => {
    switch (difficulty) {
      case 1: return { label: 'Easy', color: 'bg-green-100 text-green-800' };
      case 2: return { label: 'Medium', color: 'bg-yellow-100 text-yellow-800' };
      case 3: return { label: 'Hard', color: 'bg-red-100 text-red-800' };
      default: return { label: 'Unknown', color: 'bg-gray-100 text-gray-800' };
    }
  };

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Question Controls</span>
          <div className="flex items-center space-x-2">
            <Badge variant="outline">{selectedCount} of {totalCount} selected</Badge>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-4 items-center">
          {/* Sort by Difficulty */}
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium">Sort by Difficulty:</span>
            <Select value={sortOrder || 'none'} onValueChange={(value) => onSortChange(value === 'none' ? null : value as 'asc' | 'desc')}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select sort order" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No sorting</SelectItem>
                <SelectItem value="asc">
                  <div className="flex items-center">
                    <ArrowUp className="h-4 w-4 mr-2" />
                    Easy to Hard
                  </div>
                </SelectItem>
                <SelectItem value="desc">
                  <div className="flex items-center">
                    <ArrowDown className="h-4 w-4 mr-2" />
                    Hard to Easy
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Difficulty Legend */}
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium">Difficulty:</span>
            <Badge className={getDifficultyLabel(1).color}>Easy</Badge>
            <Badge className={getDifficultyLabel(2).color}>Medium</Badge>
            <Badge className={getDifficultyLabel(3).color}>Hard</Badge>
          </div>

          {/* Selection Controls */}
          <div className="flex items-center space-x-2 ml-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={onSelectAll}
              disabled={allSelected}
            >
              <CheckSquare className="h-4 w-4 mr-1" />
              Select All
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onUnselectAll}
              disabled={noneSelected}
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
              Delete Selected ({selectedCount})
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DifficultyControls;
