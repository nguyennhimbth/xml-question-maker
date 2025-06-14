
import React from 'react';
import { useQuestions } from '@/context/QuestionsContext';
import { RegularQuestion } from '@/types/question';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash } from 'lucide-react';

interface RegularQuestionListProps {
  onEdit: (question: RegularQuestion) => void;
}

const RegularQuestionList: React.FC<RegularQuestionListProps> = ({ onEdit }) => {
  const { regularQuestions, deleteRegularQuestion, toggleRegularQuestionSelection } = useQuestions();

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
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {regularQuestions.map((question) => {
              const correctAnswer = Object.entries(question.answers)
                .find(([_, answer]) => answer.correct)?.[0]?.toUpperCase() || '';
              
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
  );
};

export default RegularQuestionList;
