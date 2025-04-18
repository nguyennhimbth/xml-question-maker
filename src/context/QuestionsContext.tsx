
import React, { createContext, useState, useContext, useEffect } from 'react';
import { FastestFingerQuestion, RegularQuestion } from '@/types/question';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthContext';
import { v4 as uuidv4 } from 'uuid';
import { useToast } from '@/hooks/use-toast';

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
  const { user, userProfile } = useAuth();
  const { toast } = useToast();
  
  // Load questions from Supabase when the user changes
  useEffect(() => {
    const loadQuestions = async () => {
      if (!user) {
        setFastestFingerQuestions([]);
        setRegularQuestions([]);
        return;
      }

      try {
        const { data: questionsData, error } = await supabase
          .from('user_questions')
          .select('*')
          .eq('user_id', user.id);

        if (error) {
          console.error('Error loading questions:', error);
          return;
        }

        if (questionsData) {
          const fastest: FastestFingerQuestion[] = [];
          const regular: RegularQuestion[] = [];

          questionsData.forEach(item => {
            if (item.type === 'fastest') {
              fastest.push(item.question_data as FastestFingerQuestion);
            } else if (item.type === 'regular') {
              regular.push(item.question_data as RegularQuestion);
            }
          });

          setFastestFingerQuestions(fastest);
          setRegularQuestions(regular);
        }
      } catch (error) {
        console.error('Error loading questions:', error);
      }
    };

    loadQuestions();
  }, [user]);

  const addFastestFingerQuestion = async (question: FastestFingerQuestion) => {
    if (!user) return false;
    if (userProfile?.questionsCount >= 20) {
      toast({
        title: "Limit Reached",
        description: "You've reached the maximum of 20 questions. Delete some questions to add more.",
        variant: "destructive"
      });
      return false;
    }

    try {
      const newQuestion = {
        ...question,
        id: uuidv4(),
        selected: false
      };

      const { error } = await supabase
        .from('user_questions')
        .insert({
          user_id: user.id,
          type: 'fastest',
          question_data: newQuestion
        });

      if (error) {
        console.error('Error adding question:', error);
        toast({
          title: "Error",
          description: "Failed to add question: " + error.message,
          variant: "destructive"
        });
        return false;
      }

      setFastestFingerQuestions(prev => [...prev, newQuestion]);
      return true;
    } catch (error: any) {
      console.error('Error adding question:', error);
      toast({
        title: "Error",
        description: "Failed to add question: " + error.message,
        variant: "destructive"
      });
      return false;
    }
  };

  const addRegularQuestion = async (question: RegularQuestion) => {
    if (!user) return false;
    if (userProfile?.questionsCount >= 20) {
      toast({
        title: "Limit Reached",
        description: "You've reached the maximum of 20 questions. Delete some questions to add more.",
        variant: "destructive"
      });
      return false;
    }

    try {
      const newQuestion = {
        ...question,
        id: uuidv4(),
        selected: false
      };

      const { error } = await supabase
        .from('user_questions')
        .insert({
          user_id: user.id,
          type: 'regular',
          question_data: newQuestion
        });

      if (error) {
        console.error('Error adding question:', error);
        toast({
          title: "Error",
          description: "Failed to add question: " + error.message,
          variant: "destructive"
        });
        return false;
      }

      setRegularQuestions(prev => [...prev, newQuestion]);
      return true;
    } catch (error: any) {
      console.error('Error adding question:', error);
      toast({
        title: "Error",
        description: "Failed to add question: " + error.message,
        variant: "destructive"
      });
      return false;
    }
  };

  const updateFastestFingerQuestion = async (id: string, updatedQuestion: Partial<FastestFingerQuestion>) => {
    if (!user) return false;

    try {
      // Find the question to update
      const questionToUpdate = fastestFingerQuestions.find(q => q.id === id);
      if (!questionToUpdate) return false;

      // Create the updated question
      const updatedFullQuestion = {
        ...questionToUpdate,
        ...updatedQuestion
      };

      // Update in Supabase
      const { error } = await supabase
        .from('user_questions')
        .update({
          question_data: updatedFullQuestion
        })
        .eq('user_id', user.id)
        .eq('type', 'fastest')
        .filter('question_data->id', 'eq', id);

      if (error) {
        console.error('Error updating question:', error);
        toast({
          title: "Error",
          description: "Failed to update question: " + error.message,
          variant: "destructive"
        });
        return false;
      }

      // Update local state
      setFastestFingerQuestions(prev => 
        prev.map(q => q.id === id ? { ...q, ...updatedQuestion } : q)
      );
      return true;
    } catch (error: any) {
      console.error('Error updating question:', error);
      toast({
        title: "Error",
        description: "Failed to update question: " + error.message,
        variant: "destructive"
      });
      return false;
    }
  };

  const updateRegularQuestion = async (id: string, updatedQuestion: Partial<RegularQuestion>) => {
    if (!user) return false;

    try {
      // Find the question to update
      const questionToUpdate = regularQuestions.find(q => q.id === id);
      if (!questionToUpdate) return false;

      // Create the updated question
      const updatedFullQuestion = {
        ...questionToUpdate,
        ...updatedQuestion
      };

      // Update in Supabase
      const { error } = await supabase
        .from('user_questions')
        .update({
          question_data: updatedFullQuestion
        })
        .eq('user_id', user.id)
        .eq('type', 'regular')
        .filter('question_data->id', 'eq', id);

      if (error) {
        console.error('Error updating question:', error);
        toast({
          title: "Error",
          description: "Failed to update question: " + error.message,
          variant: "destructive"
        });
        return false;
      }

      // Update local state
      setRegularQuestions(prev => 
        prev.map(q => q.id === id ? { ...q, ...updatedQuestion } : q)
      );
      return true;
    } catch (error: any) {
      console.error('Error updating question:', error);
      toast({
        title: "Error",
        description: "Failed to update question: " + error.message,
        variant: "destructive"
      });
      return false;
    }
  };

  const deleteFastestFingerQuestion = async (id: string) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('user_questions')
        .delete()
        .eq('user_id', user.id)
        .eq('type', 'fastest')
        .filter('question_data->id', 'eq', id);

      if (error) {
        console.error('Error deleting question:', error);
        toast({
          title: "Error",
          description: "Failed to delete question: " + error.message,
          variant: "destructive"
        });
        return false;
      }

      setFastestFingerQuestions(prev => prev.filter(q => q.id !== id));
      return true;
    } catch (error: any) {
      console.error('Error deleting question:', error);
      toast({
        title: "Error",
        description: "Failed to delete question: " + error.message,
        variant: "destructive"
      });
      return false;
    }
  };

  const deleteRegularQuestion = async (id: string) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('user_questions')
        .delete()
        .eq('user_id', user.id)
        .eq('type', 'regular')
        .filter('question_data->id', 'eq', id);

      if (error) {
        console.error('Error deleting question:', error);
        toast({
          title: "Error",
          description: "Failed to delete question: " + error.message,
          variant: "destructive"
        });
        return false;
      }

      setRegularQuestions(prev => prev.filter(q => q.id !== id));
      return true;
    } catch (error: any) {
      console.error('Error deleting question:', error);
      toast({
        title: "Error",
        description: "Failed to delete question: " + error.message,
        variant: "destructive"
      });
      return false;
    }
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

  const setQuestions = (questions: {
    fastestFingerQuestion: FastestFingerQuestion | null;
    regularQuestions: RegularQuestion[];
  }) => {
    const { fastestFingerQuestion, regularQuestions: newRegularQuestions } = questions;
    
    // Only update if user is logged in
    if (user) {
      if (fastestFingerQuestion) {
        setFastestFingerQuestions([fastestFingerQuestion]);
      }
      setRegularQuestions(newRegularQuestions);
    }
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
