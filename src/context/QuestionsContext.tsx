import React, { createContext, useState, useContext, useEffect } from 'react';
import { FastestFingerQuestion, RegularQuestion } from '@/types/question';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface User {
  id: string;
  name: string;
}

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
  currentUser: User | null;
  login: (name: string) => void;
  logout: () => void;
}

// Generate a unique session ID for anonymous users
const getSessionId = () => {
  let sessionId = localStorage.getItem('qfs_session_id');
  if (!sessionId) {
    sessionId = uuidv4();
    localStorage.setItem('qfs_session_id', sessionId);
  }
  return sessionId;
};

const QuestionsContext = createContext<QuestionsContextType | undefined>(undefined);

export const QuestionsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // User state
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('qfs_current_user');
    if (saved) {
      return JSON.parse(saved);
    }
    
    // Create anonymous user with session ID
    return {
      id: getSessionId(),
      name: 'Anonymous'
    };
  });
  
  // Questions state
  const [fastestFingerQuestions, setFastestFingerQuestions] = useState<FastestFingerQuestion[]>(() => {
    // Try to load from database (localStorage in this case)
    const userId = currentUser?.id || getSessionId();
    const saved = localStorage.getItem(`qfs_fastest_finger_${userId}`);
    return saved ? JSON.parse(saved) : [];
  });
  
  const [regularQuestions, setRegularQuestions] = useState<RegularQuestion[]>(() => {
    // Try to load from database (localStorage in this case)
    const userId = currentUser?.id || getSessionId();
    const saved = localStorage.getItem(`qfs_regular_questions_${userId}`);
    return saved ? JSON.parse(saved) : [];
  });

  // Function to sync questions with Supabase
  const syncQuestions = async () => {
    if (!currentUser) return;
    
    try {
      // Sync fastest finger questions
      fastestFingerQuestions.forEach(async (question) => {
        try {
          await supabase
            .from('fastest_finger_questions')
            .upsert({
              id: question.id,
              user_id: currentUser.id,
              question: question.text,
              option_a: question.answers.a,
              option_b: question.answers.b,
              option_c: question.answers.c,
              option_d: question.answers.d,
              correct_order: `${question.correctOrder.one}${question.correctOrder.two}${question.correctOrder.three}${question.correctOrder.four}`,
              category: 'Default'
            });
        } catch (error) {
          console.error('Error syncing fastest finger question:', error);
          toast.error('Failed to sync a fastest finger question');
        }
      });

      // Sync regular questions
      regularQuestions.forEach(async (question) => {
        try {
          const correctLetter = Object.entries(question.answers)
            .find(([_, answer]) => answer.correct)?.[0];
            
          await supabase
            .from('regular_questions')
            .upsert({
              id: question.id,
              user_id: currentUser.id,
              category: question.category,
              question: question.text,
              option_a: question.answers.a.text,
              option_b: question.answers.b.text,
              option_c: question.answers.c.text,
              option_d: question.answers.d.text,
              correct_answer: correctLetter
            });
        } catch (error) {
          console.error('Error syncing regular question:', error);
          toast.error('Failed to sync a regular question');
        }
      });
    } catch (error) {
      console.error('Error in sync operation:', error);
      toast.error('Failed to sync questions');
    }
  };

  // Question management functions with immediate sync
  const addFastestFingerQuestion = (question: FastestFingerQuestion) => {
    setFastestFingerQuestions(prev => {
      const updated = [...prev, question];
      syncQuestions(); // Sync after update
      return updated;
    });
  };

  const addRegularQuestion = (question: RegularQuestion) => {
    setRegularQuestions(prev => {
      const updated = [...prev, question];
      syncQuestions(); // Sync after update
      return updated;
    });
  };

  const deleteFastestFingerQuestion = async (id: string) => {
    if (currentUser) {
      try {
        await supabase
          .from('fastest_finger_questions')
          .delete()
          .eq('id', id);
      } catch (error) {
        console.error('Error deleting fastest finger question:', error);
        toast.error('Failed to delete question');
        return;
      }
    }
    
    setFastestFingerQuestions(prev => prev.filter(q => q.id !== id));
  };

  const deleteRegularQuestion = async (id: string) => {
    if (currentUser) {
      try {
        await supabase
          .from('regular_questions')
          .delete()
          .eq('id', id);
      } catch (error) {
        console.error('Error deleting regular question:', error);
        toast.error('Failed to delete question');
        return;
      }
    }
    
    setRegularQuestions(prev => prev.filter(q => q.id !== id));
  };

  const updateFastestFingerQuestion = (id: string, updatedQuestion: Partial<FastestFingerQuestion>) => {
    setFastestFingerQuestions(prev => {
      const updated = prev.map(q => q.id === id ? { ...q, ...updatedQuestion } : q);
      syncQuestions(); // Sync after update
      return updated;
    });
  };

  const updateRegularQuestion = (id: string, updatedQuestion: Partial<RegularQuestion>) => {
    setRegularQuestions(prev => {
      const updated = prev.map(q => q.id === id ? { ...q, ...updatedQuestion } : q);
      syncQuestions(); // Sync after update
      return updated;
    });
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
    if (fastestFingerQuestion) {
      setFastestFingerQuestions([fastestFingerQuestion]);
    } else {
      setFastestFingerQuestions([]);
    }
    setRegularQuestions(regularQuestions);
  };

  // User management functions
  const login = (name: string) => {
    const userId = uuidv4();
    const user = { id: userId, name };
    setCurrentUser(user);
    
    // Load any previously saved questions for this user
    const savedFastest = localStorage.getItem(`qfs_fastest_finger_${userId}`);
    if (savedFastest) {
      setFastestFingerQuestions(JSON.parse(savedFastest));
    }
    
    const savedRegular = localStorage.getItem(`qfs_regular_questions_${userId}`);
    if (savedRegular) {
      setRegularQuestions(JSON.parse(savedRegular));
    }
  };
  
  const logout = () => {
    // Switch to anonymous user
    const sessionId = getSessionId();
    setCurrentUser({
      id: sessionId,
      name: 'Anonymous'
    });
    
    // Load any previously saved questions for anonymous user
    const savedFastest = localStorage.getItem(`qfs_fastest_finger_${sessionId}`);
    if (savedFastest) {
      setFastestFingerQuestions(JSON.parse(savedFastest));
    } else {
      setFastestFingerQuestions([]);
    }
    
    const savedRegular = localStorage.getItem(`qfs_regular_questions_${sessionId}`);
    if (savedRegular) {
      setRegularQuestions(JSON.parse(savedRegular));
    } else {
      setRegularQuestions([]);
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
      currentUser,
      login,
      logout,
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
