
import React, { createContext, useState, useEffect, useContext } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase, ProfilesTable } from '@/integrations/supabase/client';

interface Profile {
  questionsCount: number;
}

interface AuthContextProps {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
  userProfile: Profile | null;
}

const AuthContext = createContext<AuthContextProps>({
  session: null,
  user: null,
  loading: true,
  signOut: async () => {},
  userProfile: null,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<Profile | null>(null);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, newSession) => {
        setSession(newSession);
        setUser(newSession?.user ?? null);
        setLoading(false);
      }
    );

    // Get initial session
    supabase.auth.getSession().then(({ data: { session: initialSession } }) => {
      setSession(initialSession);
      setUser(initialSession?.user ?? null);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Fetch user profile data when user changes
  useEffect(() => {
    const fetchProfile = async () => {
      if (user) {
        try {
          // Use type assertion to bypass TypeScript errors
          const { data, error } = await supabase
            .from('profiles')
            .select('questions_count')
            .eq('id', user.id)
            .single();

          if (data && !error) {
            // Type assert the data to match our expected profile structure
            const profileData = data as unknown as ProfilesTable;
            setUserProfile({ questionsCount: profileData.questions_count });
          } else {
            console.error('Error fetching profile:', error);
          }
        } catch (error) {
          console.error('Error fetching profile:', error);
        }
      } else {
        setUserProfile(null);
      }
    };

    fetchProfile();
  }, [user]);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ session, user, loading, signOut, userProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
