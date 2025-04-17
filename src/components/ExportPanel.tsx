
import React from 'react';
import { useQuestions } from '@/context/QuestionsContext';
import { downloadXML } from '@/utils/xmlExport';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Download } from 'lucide-react';

const ExportPanel: React.FC = () => {
  const { getSelectedFastestFingerQuestion, getSelectedRegularQuestions } = useQuestions();

  const handleExport = () => {
    const fastestFingerQuestion = getSelectedFastestFingerQuestion();
    const regularQuestions = getSelectedRegularQuestions();
    
    if (!fastestFingerQuestion && regularQuestions.length === 0) {
      alert('Please select at least one question to export.');
      return;
    }
    
    downloadXML(fastestFingerQuestion, regularQuestions);
  };
  
  const fastestFingerQuestion = getSelectedFastestFingerQuestion();
  const regularQuestions = getSelectedRegularQuestions();
  const totalSelected = (fastestFingerQuestion ? 1 : 0) + regularQuestions.length;
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <FileText className="mr-2 h-5 w-5" />
          Export Questions
        </CardTitle>
        <CardDescription>
          Select questions to include in your XML export.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span>Fastest Finger Questions:</span>
            <span className="font-medium">{fastestFingerQuestion ? '1 selected' : 'None selected'}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Regular Questions:</span>
            <span className="font-medium">{regularQuestions.length} selected</span>
          </div>
          <div className="flex justify-between font-medium pt-2 border-t">
            <span>Total Questions:</span>
            <span>{totalSelected}</span>
          </div>
        </div>
        
        <Button 
          onClick={handleExport} 
          className="w-full"
          disabled={totalSelected === 0}
        >
          <Download className="mr-2 h-4 w-4" />
          Export to XML
        </Button>
      </CardContent>
    </Card>
  );
};

export default ExportPanel;
