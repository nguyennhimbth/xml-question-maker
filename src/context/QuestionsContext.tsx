
import React, { createContext, useState, useContext, useEffect } from 'react';
import { FastestFingerQuestion, RegularQuestion } from '@/types/question';
import { v4 as uuidv4 } from 'uuid';

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

  // Save to database (localStorage) whenever the user or questions change
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('qfs_current_user', JSON.stringify(currentUser));
    }
  }, [currentUser]);
  
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(`qfs_fastest_finger_${currentUser.id}`, JSON.stringify(fastestFingerQuestions));
    }
  }, [fastestFingerQuestions, currentUser]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(`qfs_regular_questions_${currentUser.id}`, JSON.stringify(regularQuestions));
    }
  }, [regularQuestions, currentUser]);

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

  // Question management functions
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
    if (fastestFingerQuestion) {
      setFastestFingerQuestions([fastestFingerQuestion]);
    } else {
      setFastestFingerQuestions([]);
    }
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
