
import React, { useState } from 'react';
import { useQuestions } from '@/context/QuestionsContext';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, LogOut } from 'lucide-react';

const UserAccount: React.FC = () => {
  const { currentUser, login, logout } = useQuestions();
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [username, setUsername] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      login(username.trim());
      setIsLoginOpen(false);
      setUsername('');
    }
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="flex items-center">
      {currentUser && (
        <div className="flex items-center">
          <div className="mr-2 flex items-center">
            <User className="mr-1 h-4 w-4" />
            <span className="text-sm font-medium">{currentUser.name}</span>
          </div>
          {currentUser.name !== 'Anonymous' && (
            <Button variant="ghost" size="icon" onClick={handleLogout} title="Log out">
              <LogOut className="h-4 w-4" />
            </Button>
          )}
        </div>
      )}
      
      {currentUser?.name === 'Anonymous' && (
        <Button variant="ghost" size="sm" onClick={() => setIsLoginOpen(true)}>
          Sign In
        </Button>
      )}

      <Dialog open={isLoginOpen} onOpenChange={setIsLoginOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sign In</DialogTitle>
            <DialogDescription>
              Enter a username to save your questions.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleLogin}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsLoginOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Sign In</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserAccount;
