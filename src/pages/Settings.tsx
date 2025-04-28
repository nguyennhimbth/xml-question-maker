
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

const Settings = () => {
  const [nickname, setNickname] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is authenticated
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate('/');
        return;
      }
    });

    // Load current theme
    const isDark = document.documentElement.classList.contains('dark');
    setIsDarkMode(isDark);

    // Load user nickname if available
    const loadUserProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.user_metadata?.nickname) {
        setNickname(user.user_metadata.nickname);
      }
    };
    
    loadUserProfile();
  }, [navigate]);

  const handleThemeToggle = (checked: boolean) => {
    setIsDarkMode(checked);
    if (checked) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const handleNicknameUpdate = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        data: { nickname }
      });

      if (error) throw error;
      toast.success('Nickname updated successfully');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container max-w-md mx-auto mt-10 p-6">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      
      <div className="space-y-6">
        {/* Nickname Section */}
        <div className="space-y-2">
          <Label htmlFor="nickname">Nickname</Label>
          <div className="flex gap-2">
            <Input
              id="nickname"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="Enter nickname"
            />
            <Button 
              onClick={handleNicknameUpdate}
              disabled={loading}
            >
              Save
            </Button>
          </div>
        </div>

        {/* Theme Toggle */}
        <div className="flex items-center justify-between">
          <Label htmlFor="theme-toggle">Dark Mode</Label>
          <Switch
            id="theme-toggle"
            checked={isDarkMode}
            onCheckedChange={handleThemeToggle}
          />
        </div>

        {/* Credits Section */}
        <div className="mt-8 pt-8 border-t">
          <h2 className="text-lg font-semibold mb-2">Credits</h2>
          <p className="text-sm text-muted-foreground">
            Version 1.0.0
            <br />
            Created with ❤️ using Lovable
          </p>
        </div>
      </div>
    </div>
  );
};

export default Settings;
