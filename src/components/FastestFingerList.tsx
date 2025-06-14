
import React, { useState, useMemo } from 'react';
import { useQuestions } from '@/context/QuestionsContext';
import { FastestFingerQuestion } from '@/types/question';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash } from 'lucide-react';
import DifficultyControls from '@/components/DifficultyControls';

interface FastestFingerListProps {
  onEdit: (question: FastestFingerQuestion) => void;
}

const FastestFingerList: React.FC<FastestFingerListProps> = ({ onEdit }) => {
  const { 
    fastestFingerQuestions, 
    deleteFastestFingerQuestion, 
    toggleFastestFingerQuestionSelection,
    updateFastestFingerQuestion
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
    if (!sortOrder) return fastestFingerQuestions;
    
    return [...fastestFingerQuestions].sort((a, b) => {
      if (sortOrder === 'asc') {
        return a.difficulty - b.difficulty;
      } else {
        return b.difficulty - a.difficulty;
      }
    });
  }, [fastestFingerQuestions, sortOrder]);

  const selectedCount = fastestFingerQuestions.filter(q => q.selected).length;
  const allSelected = fastestFingerQuestions.length > 0 && selectedCount === fastestFingerQuestions.length;
  const noneSelected = selectedCount === 0;

  const handleSelectAll = () => {
    fastestFingerQuestions.forEach(question => {
      if (!question.selected) {
        toggleFastestFingerQuestionSelection(question.id);
      }
    });
  };

  const handleUnselectAll = () => {
    fastestFingerQuestions.forEach(question => {
      if (question.selected) {
        toggleFastestFingerQuestionSelection(question.id);
      }
    });
  };

  const handleDeleteSelected = () => {
    const selectedQuestions = fastestFingerQuestions.filter(q => q.selected);
    if (selectedQuestions.length > 0 && confirm(`Are you sure you want to delete ${selectedQuestions.length} question(s)?`)) {
      selectedQuestions.forEach(question => {
        deleteFastestFingerQuestion(question.id);
      });
    }
  };

  const handleDifficultyChange = (questionId: string, difficulty: string) => {
    updateFastestFingerQuestion(questionId, { difficulty: parseInt(difficulty) as 1 | 2 | 3 });
  };

  if (fastestFingerQuestions.length === 0) {
    return (
      <Card>
        <CardContent className="py-4">
          <p className="text-center text-muted-foreground">No fastest finger questions added yet.</p>
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
        totalCount={fastestFingerQuestions.length}
        onSelectAll={handleSelectAll}
        onUnselectAll={handleUnselectAll}
        onDeleteSelected={handleDeleteSelected}
        allSelected={allSelected}
        noneSelected={noneSelected}
      />

      <Card>
        <CardHeader>
          <CardTitle>Fastest Finger Questions</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-10">Select</TableHead>
                <TableHead>Question</TableHead>
                <TableHead className="w-20">Options</TableHead>
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
                        onCheckedChange={() => toggleFastestFingerQuestionSelection(question.id)}
                        id={`select-${question.id}`}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{question.text}</div>
                      <div className="text-sm text-muted-foreground mt-1">
                        Correct Order: {question.correctOrder.one.toUpperCase()} → {question.correctOrder.two.toUpperCase()} → {question.correctOrder.three.toUpperCase()} → {question.correctOrder.four.toUpperCase()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-xs">
                        A: {question.answers.a}<br />
                        B: {question.answers.b}<br />
                        C: {question.answers.c}<br />
                        D: {question.answers.d}
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
                          onClick={() => deleteFastestFingerQuestion(question.id)}
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

export default FastestFingerList;
