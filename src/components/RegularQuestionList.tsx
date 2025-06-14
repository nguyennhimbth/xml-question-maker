
import React, { useState, useMemo } from 'react';
import { useQuestions } from '@/context/QuestionsContext';
import { RegularQuestion } from '@/types/question';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash } from 'lucide-react';
import DifficultyControls from '@/components/DifficultyControls';

interface RegularQuestionListProps {
  onEdit: (question: RegularQuestion) => void;
}

const RegularQuestionList: React.FC<RegularQuestionListProps> = ({ onEdit }) => {
  const { 
    regularQuestions, 
    deleteRegularQuestion, 
    toggleRegularQuestionSelection,
    updateRegularQuestion
  } = useQuestions();

  const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | null>(null);

  const getDifficultyLabel = (difficulty: number) => {
    switch (difficulty) {
      case 1: return { label: 'Easy', color: 'bg-green-100 text-green-800' };
      case 2: return { label: 'Medium', color: 'bg-yellow-100 text-yellow-800' };
      case 3: return { label: 'Hard', color: 'bg-red-100 text-red-800' };
      default: return { label: 'Unknown', color: 'bg-gray-100 text-gray-800' };
    }
  };

  const sortedQuestions = useMemo(() => {
    if (!sortOrder) return regularQuestions;
    
    return [...regularQuestions].sort((a, b) => {
      if (sortOrder === 'asc') {
        return a.difficulty - b.difficulty;
      } else {
        return b.difficulty - a.difficulty;
      }
    });
  }, [regularQuestions, sortOrder]);

  const selectedCount = regularQuestions.filter(q => q.selected).length;
  const allSelected = regularQuestions.length > 0 && selectedCount === regularQuestions.length;
  const noneSelected = selectedCount === 0;

  const handleSelectAll = () => {
    regularQuestions.forEach(question => {
      if (!question.selected) {
        toggleRegularQuestionSelection(question.id);
      }
    });
  };

  const handleUnselectAll = () => {
    regularQuestions.forEach(question => {
      if (question.selected) {
        toggleRegularQuestionSelection(question.id);
      }
    });
  };

  const handleDeleteSelected = () => {
    const selectedQuestions = regularQuestions.filter(q => q.selected);
    if (selectedQuestions.length > 0 && confirm(`Are you sure you want to delete ${selectedQuestions.length} question(s)?`)) {
      selectedQuestions.forEach(question => {
        deleteRegularQuestion(question.id);
      });
    }
  };

  const handleDifficultyChange = (questionId: string, difficulty: string) => {
    updateRegularQuestion(questionId, { difficulty: parseInt(difficulty) as 1 | 2 | 3 });
  };

  if (regularQuestions.length === 0) {
    return (
      <Card>
        <CardContent className="py-4">
          <p className="text-center text-muted-foreground">No regular questions added yet.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <DifficultyControls
        sortOrder={sortOrder}
        onSortChange={setSortOrder}
        selectedCount={selectedCount}
        totalCount={regularQuestions.length}
        onSelectAll={handleSelectAll}
        onUnselectAll={handleUnselectAll}
        onDeleteSelected={handleDeleteSelected}
        allSelected={allSelected}
        noneSelected={noneSelected}
      />

      <Card>
        <CardHeader>
          <CardTitle>Regular Questions</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-10">Select</TableHead>
                <TableHead>Question</TableHead>
                <TableHead>Answers</TableHead>
                <TableHead className="w-24">Difficulty</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedQuestions.map((question) => {
                const difficultyInfo = getDifficultyLabel(question.difficulty);
                return (
                  <TableRow key={question.id}>
                    <TableCell>
                      <Checkbox 
                        checked={question.selected} 
                        onCheckedChange={() => toggleRegularQuestionSelection(question.id)}
                        id={`select-${question.id}`}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{question.text}</div>
                      <div className="mt-1">
                        <Badge variant="outline">{question.category}</Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-xs">
                        {Object.entries(question.answers).map(([key, answer]) => (
                          <div key={key} className={answer.correct ? "font-bold text-primary" : ""}>
                            {key.toUpperCase()}: {answer.text} {answer.correct && "✓"}
                          </div>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Select 
                        value={question.difficulty.toString()} 
                        onValueChange={(value) => handleDifficultyChange(question.id, value)}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue>
                            <Badge className={difficultyInfo.color}>
                              {difficultyInfo.label}
                            </Badge>
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">
                            <Badge className="bg-green-100 text-green-800">Easy</Badge>
                          </SelectItem>
                          <SelectItem value="2">
                            <Badge className="bg-yellow-100 text-yellow-800">Medium</Badge>
                          </SelectItem>
                          <SelectItem value="3">
                            <Badge className="bg-red-100 text-red-800">Hard</Badge>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="icon" onClick={() => onEdit(question)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => deleteRegularQuestion(question.id)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default RegularQuestionList;
