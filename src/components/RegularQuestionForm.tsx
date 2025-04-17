
import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useQuestions } from '@/context/QuestionsContext';
import { RegularQuestion } from '@/types/question';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';

interface RegularQuestionFormProps {
  editQuestion?: RegularQuestion;
  onComplete?: () => void;
}

const RegularQuestionForm: React.FC<RegularQuestionFormProps> = ({ editQuestion, onComplete }) => {
  const { addRegularQuestion, updateRegularQuestion } = useQuestions();
  
  const [question, setQuestion] = useState<RegularQuestion>(editQuestion || {
    id: uuidv4(),
    category: '',
    text: '',
    answers: {
      a: { text: '', correct: false },
      b: { text: '', correct: false },
      c: { text: '', correct: false },
      d: { text: '', correct: false }
    },
    selected: false
  });

  const [correctAnswer, setCorrectAnswer] = useState<'a' | 'b' | 'c' | 'd'>(
    editQuestion
      ? (Object.entries(editQuestion.answers).find(([_, a]) => a.correct)?.[0] as 'a' | 'b' | 'c' | 'd') || 'a'
      : 'a'
  );

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setQuestion(prev => ({ ...prev, text: e.target.value }));
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuestion(prev => ({ ...prev, category: e.target.value }));
  };

  const handleAnswerTextChange = (key: 'a' | 'b' | 'c' | 'd', value: string) => {
    setQuestion(prev => ({
      ...prev,
      answers: {
        ...prev.answers,
        [key]: { ...prev.answers[key], text: value }
      }
    }));
  };

  const handleCorrectAnswerChange = (value: 'a' | 'b' | 'c' | 'd') => {
    setCorrectAnswer(value);
    
    // Update all answers' correct status
    const updatedAnswers = {
      a: { ...question.answers.a, correct: value === 'a' },
      b: { ...question.answers.b, correct: value === 'b' },
      c: { ...question.answers.c, correct: value === 'c' },
      d: { ...question.answers.d, correct: value === 'd' }
    };
    
    setQuestion(prev => ({
      ...prev,
      answers: updatedAnswers
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editQuestion) {
      updateRegularQuestion(question.id, question);
    } else {
      addRegularQuestion(question);
    }
    
    if (onComplete) {
      onComplete();
    }
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>
          {editQuestion ? 'Edit Regular Question' : 'Create Regular Question'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Input 
              id="category"
              placeholder="e.g., History, Science, Pop Culture..."
              value={question.category}
              onChange={handleCategoryChange}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="question-text">Question Text</Label>
            <Textarea 
              id="question-text"
              placeholder="Enter your question here..."
              value={question.text}
              onChange={handleTextChange}
              required
              className="min-h-24"
            />
          </div>
          
          <div className="space-y-4">
            <Label>Answer Options</Label>
            
            <div className="grid grid-cols-1 gap-4">
              <div className="flex flex-col space-y-2">
                <div className="flex items-center space-x-2">
                  <RadioGroup value={correctAnswer} onValueChange={(v) => handleCorrectAnswerChange(v as 'a' | 'b' | 'c' | 'd')}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="a" id="a" />
                      <Label htmlFor="a" className="font-bold">A</Label>
                    </div>
                  </RadioGroup>
                  <Input 
                    placeholder="Answer option A"
                    value={question.answers.a.text}
                    onChange={(e) => handleAnswerTextChange('a', e.target.value)}
                    required
                    className={correctAnswer === 'a' ? 'border-primary' : ''}
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <RadioGroup value={correctAnswer} onValueChange={(v) => handleCorrectAnswerChange(v as 'a' | 'b' | 'c' | 'd')}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="b" id="b" />
                      <Label htmlFor="b" className="font-bold">B</Label>
                    </div>
                  </RadioGroup>
                  <Input 
                    placeholder="Answer option B"
                    value={question.answers.b.text}
                    onChange={(e) => handleAnswerTextChange('b', e.target.value)}
                    required
                    className={correctAnswer === 'b' ? 'border-primary' : ''}
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <RadioGroup value={correctAnswer} onValueChange={(v) => handleCorrectAnswerChange(v as 'a' | 'b' | 'c' | 'd')}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="c" id="c" />
                      <Label htmlFor="c" className="font-bold">C</Label>
                    </div>
                  </RadioGroup>
                  <Input 
                    placeholder="Answer option C"
                    value={question.answers.c.text}
                    onChange={(e) => handleAnswerTextChange('c', e.target.value)}
                    required
                    className={correctAnswer === 'c' ? 'border-primary' : ''}
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <RadioGroup value={correctAnswer} onValueChange={(v) => handleCorrectAnswerChange(v as 'a' | 'b' | 'c' | 'd')}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="d" id="d" />
                      <Label htmlFor="d" className="font-bold">D</Label>
                    </div>
                  </RadioGroup>
                  <Input 
                    placeholder="Answer option D"
                    value={question.answers.d.text}
                    onChange={(e) => handleAnswerTextChange('d', e.target.value)}
                    required
                    className={correctAnswer === 'd' ? 'border-primary' : ''}
                  />
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end space-x-2">
            {onComplete && (
              <Button 
                type="button" 
                variant="outline" 
                onClick={onComplete}
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

export default RegularQuestionForm;
