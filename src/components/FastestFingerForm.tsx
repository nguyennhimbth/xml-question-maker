
import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useQuestions } from '@/context/QuestionsContext';
import { FastestFingerQuestion } from '@/types/question';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

interface FastestFingerFormProps {
  editQuestion?: FastestFingerQuestion;
  onComplete?: () => void;
  onClose?: () => void;
}

const FastestFingerForm: React.FC<FastestFingerFormProps> = ({ editQuestion, onComplete, onClose }) => {
  const { addFastestFingerQuestion, updateFastestFingerQuestion } = useQuestions();
  
  const [question, setQuestion] = useState<FastestFingerQuestion>(editQuestion || {
    id: uuidv4(),
    text: '',
    answers: { a: '', b: '', c: '', d: '' },
    correctOrder: { one: 'a', two: 'b', three: 'c', four: 'd' },
    selected: false,
    difficulty: 1
  });

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setQuestion(prev => ({ ...prev, text: e.target.value }));
  };

  const handleAnswerChange = (key: 'a' | 'b' | 'c' | 'd', value: string) => {
    setQuestion(prev => ({
      ...prev,
      answers: { ...prev.answers, [key]: value }
    }));
  };

  const handleOrderChange = (position: 'one' | 'two' | 'three' | 'four', value: 'a' | 'b' | 'c' | 'd') => {
    setQuestion(prev => ({
      ...prev,
      correctOrder: { ...prev.correctOrder, [position]: value }
    }));
  };

  const handleDifficultyChange = (value: string) => {
    const difficulty = parseInt(value) as 1 | 2 | 3;
    setQuestion(prev => ({
      ...prev,
      difficulty: difficulty
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editQuestion) {
      updateFastestFingerQuestion(question.id, question);
    } else {
      addFastestFingerQuestion(question);
    }
    
    if (onComplete) {
      onComplete();
    }
    if (onClose) {
      onClose();
    }
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>
          {editQuestion ? 'Edit Fastest Finger Question' : 'Create Fastest Finger Question'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="question-text">Question Text</Label>
            <Textarea 
              id="question-text"
              placeholder="e.g., Put these items in chronological order..."
              value={question.text}
              onChange={handleTextChange}
              required
              className="min-h-24"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="answer-a">Option A</Label>
              <Input 
                id="answer-a"
                placeholder="First item"
                value={question.answers.a}
                onChange={(e) => handleAnswerChange('a', e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="answer-b">Option B</Label>
              <Input 
                id="answer-b"
                placeholder="Second item"
                value={question.answers.b}
                onChange={(e) => handleAnswerChange('b', e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="answer-c">Option C</Label>
              <Input 
                id="answer-c"
                placeholder="Third item"
                value={question.answers.c}
                onChange={(e) => handleAnswerChange('c', e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="answer-d">Option D</Label>
              <Input 
                id="answer-d"
                placeholder="Fourth item"
                value={question.answers.d}
                onChange={(e) => handleAnswerChange('d', e.target.value)}
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Correct Order</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <div>
                <Label htmlFor="order-1">First</Label>
                <Select 
                  value={question.correctOrder.one} 
                  onValueChange={(value) => handleOrderChange('one', value as 'a' | 'b' | 'c' | 'd')}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="First" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="a">A</SelectItem>
                    <SelectItem value="b">B</SelectItem>
                    <SelectItem value="c">C</SelectItem>
                    <SelectItem value="d">D</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="order-2">Second</Label>
                <Select 
                  value={question.correctOrder.two} 
                  onValueChange={(value) => handleOrderChange('two', value as 'a' | 'b' | 'c' | 'd')}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Second" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="a">A</SelectItem>
                    <SelectItem value="b">B</SelectItem>
                    <SelectItem value="c">C</SelectItem>
                    <SelectItem value="d">D</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="order-3">Third</Label>
                <Select 
                  value={question.correctOrder.three} 
                  onValueChange={(value) => handleOrderChange('three', value as 'a' | 'b' | 'c' | 'd')}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Third" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="a">A</SelectItem>
                    <SelectItem value="b">B</SelectItem>
                    <SelectItem value="c">C</SelectItem>
                    <SelectItem value="d">D</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="order-4">Fourth</Label>
                <Select 
                  value={question.correctOrder.four} 
                  onValueChange={(value) => handleOrderChange('four', value as 'a' | 'b' | 'c' | 'd')}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Fourth" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="a">A</SelectItem>
                    <SelectItem value="b">B</SelectItem>
                    <SelectItem value="c">C</SelectItem>
                    <SelectItem value="d">D</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          <div className="space-y-2 max-w-xs">
            <Label htmlFor="difficulty">Difficulty Level</Label>
            <Select 
              value={question.difficulty?.toString() || "1"} 
              onValueChange={handleDifficultyChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Easy</SelectItem>
                <SelectItem value="2">Medium</SelectItem>
                <SelectItem value="3">Hard</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex justify-end space-x-2">
            {(onComplete || onClose) && (
              <Button 
                type="button" 
                variant="outline" 
                onClick={onComplete || onClose}
              >
                Cancel
              </Button>
            )}
            <Button type="submit">
              {editQuestion ? 'Update Question' : 'Add Question'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default FastestFingerForm;
