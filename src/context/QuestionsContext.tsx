import React, { createContext, useState, useContext, useEffect } from 'react';
import { FastestFingerQuestion, RegularQuestion } from '@/types/question';

interface QuestionsContextType {
  fastestFingerQuestions: FastestFingerQuestion[];
  regularQuestions: RegularQuestion[];
  addFastestFingerQuestion: (question: FastestFingerQuestion) => void;
  addRegularQuestion: (question: RegularQuestion) => void;
  updateFastestFingerQuestion: (id: string, question: Partial<FastestFingerQuestion>) => void;
  updateRegularQuestion: (id: string, question: Partial<RegularQuestion>) => void;
  deleteFastestFingerQuestion: (id: string) => void;
  deleteRegularQuestion: (id: string) => void;
  toggleFastestFingerQuestionSelection: (id: string) => void;
  toggleRegularQuestionSelection: (id: string) => void;
  getSelectedFastestFingerQuestion: () => FastestFingerQuestion | null;
  getSelectedRegularQuestions: () => RegularQuestion[];
  setQuestions: (questions: {
    fastestFingerQuestion: FastestFingerQuestion | null;
    regularQuestions: RegularQuestion[];
  }) => void;
}

const QuestionsContext = createContext<QuestionsContextType | undefined>(undefined);

export const QuestionsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [fastestFingerQuestions, setFastestFingerQuestions] = useState<FastestFingerQuestion[]>(() => {
    const saved = localStorage.getItem('fastestFingerQuestions');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [regularQuestions, setRegularQuestions] = useState<RegularQuestion[]>(() => {
    const saved = localStorage.getItem('regularQuestions');
    return saved ? JSON.parse(saved) : [];
  });

  // Save to localStorage whenever the questions change
  useEffect(() => {
    localStorage.setItem('fastestFingerQuestions', JSON.stringify(fastestFingerQuestions));
  }, [fastestFingerQuestions]);

  useEffect(() => {
    localStorage.setItem('regularQuestions', JSON.stringify(regularQuestions));
  }, [regularQuestions]);

  const addFastestFingerQuestion = (question: FastestFingerQuestion) => {
    setFastestFingerQuestions(prev => [...prev, question]);
  };

  const addRegularQuestion = (question: RegularQuestion) => {
    setRegularQuestions(prev => [...prev, question]);
  };

  const updateFastestFingerQuestion = (id: string, updatedQuestion: Partial<FastestFingerQuestion>) => {
    setFastestFingerQuestions(prev => 
      prev.map(q => q.id === id ? { ...q, ...updatedQuestion } : q)
    );
  };

  const updateRegularQuestion = (id: string, updatedQuestion: Partial<RegularQuestion>) => {
    setRegularQuestions(prev => 
      prev.map(q => q.id === id ? { ...q, ...updatedQuestion } : q)
    );
  };

  const deleteFastestFingerQuestion = (id: string) => {
    setFastestFingerQuestions(prev => prev.filter(q => q.id !== id));
  };

  const deleteRegularQuestion = (id: string) => {
    setRegularQuestions(prev => prev.filter(q => q.id !== id));
  };

  const toggleFastestFingerQuestionSelection = (id: string) => {
    setFastestFingerQuestions(prev => {
      // Only one fastest finger question can be selected
      const newQuestions = prev.map(q => ({
        ...q,
        selected: q.id === id // Only the clicked one is selected
      }));
      return newQuestions;
    });
  };

  const toggleRegularQuestionSelection = (id: string) => {
    setRegularQuestions(prev => 
      prev.map(q => q.id === id ? { ...q, selected: !q.selected } : q)
    );
  };

  const getSelectedFastestFingerQuestion = (): FastestFingerQuestion | null => {
    return fastestFingerQuestions.find(q => q.selected) || null;
  };

  const getSelectedRegularQuestions = (): RegularQuestion[] => {
    return regularQuestions.filter(q => q.selected);
  };

  const setQuestions = ({ fastestFingerQuestion, regularQuestions }: {
    fastestFingerQuestion: FastestFingerQuestion | null;
    regularQuestions: RegularQuestion[];
  }) => {
    setFastestFingerQuestions(fastestFingerQuestion ? [fastestFingerQuestion] : []);
    setRegularQuestions(regularQuestions);
  };

  return (
    <QuestionsContext.Provider value={{
      fastestFingerQuestions,
      regularQuestions,
      addFastestFingerQuestion,
      addRegularQuestion,
      updateFastestFingerQuestion,
      updateRegularQuestion,
      deleteFastestFingerQuestion,
      deleteRegularQuestion,
      toggleFastestFingerQuestionSelection,
      toggleRegularQuestionSelection,
      getSelectedFastestFingerQuestion,
      getSelectedRegularQuestions,
      setQuestions,
    }}>
      {children}
    </QuestionsContext.Provider>
  );
};

export const useQuestions = () => {
  const context = useContext(QuestionsContext);
  if (context === undefined) {
    throw new Error('useQuestions must be used within a QuestionsProvider');
  }
  return context;
};
