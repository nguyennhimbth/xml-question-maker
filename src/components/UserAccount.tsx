
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { User, LogOut } from 'lucide-react';
import AuthModal from './auth/AuthModal';
import { toast } from 'sonner';

const UserAccount: React.FC = () => {
  const [session, setSession] = useState<any>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error('Error signing out');
    } else {
      toast.success('Signed out successfully');
    }
  };

  return (
    <div className="flex items-center space-x-2">
      {session?.user ? (
        <div className="flex items-center space-x-2">
          <div className="flex items-center">
            <User className="mr-1 h-4 w-4" />
            <span className="text-sm font-medium">{session.user.email}</span>
          </div>
          <Button variant="ghost" size="icon" onClick={handleLogout} title="Log out">
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <Button variant="ghost" size="sm" onClick={() => setIsAuthModalOpen(true)}>
          Sign In
        </Button>
      )}

      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
      />
    </div>
  );
};

export default UserAccount;
