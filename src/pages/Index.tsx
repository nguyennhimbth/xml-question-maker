
import React, { useState } from 'react';
import { QuestionsProvider } from '@/context/QuestionsContext';
import Header from '@/components/Header';
import FastestFingerForm from '@/components/FastestFingerForm';
import FastestFingerList from '@/components/FastestFingerList';
import RegularQuestionForm from '@/components/RegularQuestionForm';
import RegularQuestionList from '@/components/RegularQuestionList';
import ExportPanel from '@/components/ExportPanel';
import { FastestFingerQuestion, RegularQuestion } from '@/types/question';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { TabsContent } from '@/components/ui/tabs';

const Index = () => {
  const [activeTab, setActiveTab] = useState<string>('fastest');
  const [showFastestFingerForm, setShowFastestFingerForm] = useState(false);
  const [showRegularQuestionForm, setShowRegularQuestionForm] = useState(false);
  const [editingFastestFinger, setEditingFastestFinger] = useState<FastestFingerQuestion | undefined>(undefined);
  const [editingRegularQuestion, setEditingRegularQuestion] = useState<RegularQuestion | undefined>(undefined);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setShowFastestFingerForm(false);
    setShowRegularQuestionForm(false);
    setEditingFastestFinger(undefined);
    setEditingRegularQuestion(undefined);
  };

  const handleEditFastestFinger = (question: FastestFingerQuestion) => {
    setEditingFastestFinger(question);
    setShowFastestFingerForm(true);
  };

  const handleEditRegularQuestion = (question: RegularQuestion) => {
    setEditingRegularQuestion(question);
    setShowRegularQuestionForm(true);
  };

  const handleFastestFingerFormComplete = () => {
    setShowFastestFingerForm(false);
    setEditingFastestFinger(undefined);
  };

  const handleRegularQuestionFormComplete = () => {
    setShowRegularQuestionForm(false);
    setEditingRegularQuestion(undefined);
  };

  return (
    <QuestionsProvider>
      <div className="min-h-screen flex flex-col">
        <Header activeTab={activeTab} onTabChange={handleTabChange} />
        
        <main className="flex-1 container py-6">
          <TabsContent value="fastest" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Fastest Finger First Questions</h2>
              <Button 
                onClick={() => setShowFastestFingerForm(true)}
                disabled={showFastestFingerForm}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Question
              </Button>
            </div>
            
            {showFastestFingerForm ? (
              <FastestFingerForm 
                editQuestion={editingFastestFinger}
                onComplete={handleFastestFingerFormComplete}
              />
            ) : (
              <FastestFingerList onEdit={handleEditFastestFinger} />
            )}
            
            <div className="mt-4 p-4 bg-muted rounded-md">
              <h3 className="font-medium">About Fastest Finger First Questions</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Fastest Finger First questions ask contestants to arrange four items in a specific order.
                Only one Fastest Finger First question can be used in the exported quiz.
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="regular" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Regular Questions</h2>
              <Button 
                onClick={() => setShowRegularQuestionForm(true)}
                disabled={showRegularQuestionForm}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Question
              </Button>
            </div>
            
            {showRegularQuestionForm ? (
              <RegularQuestionForm 
                editQuestion={editingRegularQuestion}
                onComplete={handleRegularQuestionFormComplete}
              />
            ) : (
              <RegularQuestionList onEdit={handleEditRegularQuestion} />
            )}
            
            <div className="mt-4 p-4 bg-muted rounded-md">
              <h3 className="font-medium">About Regular Questions</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Regular questions have one correct answer out of four options.
                You can select multiple regular questions for the exported quiz.
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="export" className="space-y-4">
            <h2 className="text-2xl font-bold">Export Questions</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <div className="p-4 bg-muted rounded-md">
                  <h3 className="font-medium">Export Instructions</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Select questions to include in your XML export by checking the boxes next to each question.
                    For Fastest Finger First questions, you can only select one.
                    For Regular Questions, you can select as many as you need.
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    The exported XML will follow the structure shown in the example, with 
                    the Fastest Finger First question appearing first (if selected), followed by 
                    all selected Regular Questions.
                  </p>
                </div>
                
                <div className="mt-4 p-4 border rounded-md">
                  <h3 className="font-medium">XML Format Preview</h3>
                  <pre className="mt-2 p-2 bg-muted rounded-md text-xs overflow-auto">
{`<questions>
  <fastest difficulty="0">
    <text>Your fastest finger question text</text>
    <a>Option A</a>
    <b>Option B</b>
    <c>Option C</c>
    <d>Option D</d>
    <correctOrder>
      <one>a</one>
      <two>b</two>
      <three>c</three>
      <four>d</four>
    </correctOrder>
  </fastest>
  <question>
    <category>Your Category</category>
    <text>Your question text</text>
    <a correct="yes/no">Option A</a>
    <b correct="yes/no">Option B</b>
    <c correct="yes/no">Option C</c>
    <d correct="yes/no">Option D</d>
  </question>
  <!-- Additional questions follow the same format -->
</questions>`}
                  </pre>
                </div>
              </div>
              
              <div>
                <ExportPanel />
              </div>
            </div>
          </TabsContent>
        </main>
      </div>
    </QuestionsProvider>
  );
};

export default Index;
