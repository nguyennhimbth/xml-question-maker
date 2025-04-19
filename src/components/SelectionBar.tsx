
import React from 'react';
import { Button } from '@/components/ui/button';
import { Check, X } from 'lucide-react';
import { useQuestions } from '@/context/QuestionsContext';

const SelectionBar = () => {
  const { 
    regularQuestions, 
    fastestFingerQuestions,
    toggleRegularQuestionSelection,
    toggleFastestFingerQuestionSelection
  } = useQuestions();

  const selectedRegularCount = regularQuestions.filter(q => q.selected).length;
  const selectedFastestCount = fastestFingerQuestions.filter(q => q.selected).length;
  const totalSelected = selectedRegularCount + selectedFastestCount;

  // Check if there are any questions in the database, regardless of selection status
  const hasQuestions = regularQuestions.length > 0 || fastestFingerQuestions.length > 0;

  const selectAll = () => {
    regularQuestions.forEach(q => {
      if (!q.selected) toggleRegularQuestionSelection(q.id);
    });
    fastestFingerQuestions.forEach(q => {
      if (!q.selected) toggleFastestFingerQuestionSelection(q.id);
    });
  };

  const unselectAll = () => {
    regularQuestions.forEach(q => {
      if (q.selected) toggleRegularQuestionSelection(q.id);
    });
    fastestFingerQuestions.forEach(q => {
      if (q.selected) toggleFastestFingerQuestionSelection(q.id);
    });
  };

  // Only display the bar if there are questions in the database
  if (!hasQuestions) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t shadow-lg animate-slide-up">
      <div className="container mx-auto py-4 px-6 flex items-center justify-between">
        <div className="text-sm">
          {totalSelected === 0 ? 
            "No questions selected" : 
            `${totalSelected} question${totalSelected !== 1 ? 's' : ''} selected`
          }
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={selectAll}
            className="flex items-center gap-2"
          >
            <Check className="h-4 w-4" />
            Select All
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={unselectAll}
            className="flex items-center gap-2"
          >
            <X className="h-4 w-4" />
            Unselect All
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SelectionBar;
