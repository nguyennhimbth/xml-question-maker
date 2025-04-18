
import React, { createContext, useState, useContext } from 'react';
import { FastestFingerQuestion, RegularQuestion } from '@/types/question';
import { v4 as uuidv4 } from 'uuid';

interface QuestionsContextType {
  fastestFingerQuestions: FastestFingerQuestion[];
  regularQuestions: RegularQuestion[];
  addFastestFingerQuestion: (question: FastestFingerQuestion) => Promise<boolean>;
  addRegularQuestion: (question: RegularQuestion) => Promise<boolean>;
  updateFastestFingerQuestion: (id: string, question: Partial<FastestFingerQuestion>) => Promise<boolean>;
  updateRegularQuestion: (id: string, question: Partial<RegularQuestion>) => Promise<boolean>;
  deleteFastestFingerQuestion: (id: string) => Promise<boolean>;
  deleteRegularQuestion: (id: string) => Promise<boolean>;
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
  const [fastestFingerQuestions, setFastestFingerQuestions] = useState<FastestFingerQuestion[]>([]);
  const [regularQuestions, setRegularQuestions] = useState<RegularQuestion[]>([]);

  const addFastestFingerQuestion = async (question: FastestFingerQuestion) => {
    try {
      const newQuestion = {
        ...question,
        id: uuidv4(),
        selected: false
      };
      setFastestFingerQuestions(prev => [...prev, newQuestion]);
      return true;
    } catch (error) {
      console.error('Error adding question:', error);
      return false;
    }
  };

  const addRegularQuestion = async (question: RegularQuestion) => {
    try {
      const newQuestion = {
        ...question,
        id: uuidv4(),
        selected: false
      };
      setRegularQuestions(prev => [...prev, newQuestion]);
      return true;
    } catch (error) {
      console.error('Error adding question:', error);
      return false;
    }
  };

  const updateFastestFingerQuestion = async (id: string, updatedQuestion: Partial<FastestFingerQuestion>) => {
    try {
      setFastestFingerQuestions(prev =>
        prev.map(q => q.id === id ? { ...q, ...updatedQuestion } : q)
      );
      return true;
    } catch (error) {
      console.error('Error updating question:', error);
      return false;
    }
  };

  const updateRegularQuestion = async (id: string, updatedQuestion: Partial<RegularQuestion>) => {
    try {
      setRegularQuestions(prev =>
        prev.map(q => q.id === id ? { ...q, ...updatedQuestion } : q)
      );
      return true;
    } catch (error) {
      console.error('Error updating question:', error);
      return false;
    }
  };

  const deleteFastestFingerQuestion = async (id: string) => {
    try {
      setFastestFingerQuestions(prev => prev.filter(q => q.id !== id));
      return true;
    } catch (error) {
      console.error('Error deleting question:', error);
      return false;
    }
  };

  const deleteRegularQuestion = async (id: string) => {
    try {
      setRegularQuestions(prev => prev.filter(q => q.id !== id));
      return true;
    } catch (error) {
      console.error('Error deleting question:', error);
      return false;
    }
  };

  const toggleFastestFingerQuestionSelection = (id: string) => {
    setFastestFingerQuestions(prev => {
      return prev.map(q => ({
        ...q,
        selected: q.id === id
      }));
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

  const setQuestions = (questions: {
    fastestFingerQuestion: FastestFingerQuestion | null;
    regularQuestions: RegularQuestion[];
  }) => {
    const { fastestFingerQuestion, regularQuestions: newRegularQuestions } = questions;
    
    if (fastestFingerQuestion) {
      setFastestFingerQuestions([fastestFingerQuestion]);
    }
    setRegularQuestions(newRegularQuestions);
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
