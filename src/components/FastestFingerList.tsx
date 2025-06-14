
import React from 'react';
import { useQuestions } from '@/context/QuestionsContext';
import { FastestFingerQuestion } from '@/types/question';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Edit, Trash } from 'lucide-react';

interface FastestFingerListProps {
  onEdit: (question: FastestFingerQuestion) => void;
}

const FastestFingerList: React.FC<FastestFingerListProps> = ({ onEdit }) => {
  const { 
    fastestFingerQuestions, 
    deleteFastestFingerQuestion, 
    toggleFastestFingerQuestionSelection 
  } = useQuestions();

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
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {fastestFingerQuestions.map((question) => (
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
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default FastestFingerList;
