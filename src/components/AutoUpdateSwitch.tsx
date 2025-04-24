
import React from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useQuestions } from '@/context/QuestionsContext';

const AutoUpdateSwitch = () => {
  const { autoUpdate, toggleAutoUpdate } = useQuestions();

  return (
    <div className="flex items-center space-x-2">
      <Switch
        id="auto-update"
        checked={autoUpdate}
        onCheckedChange={toggleAutoUpdate}
      />
      <Label htmlFor="auto-update">Auto-update questions every 10 minutes</Label>
    </div>
  );
};

export default AutoUpdateSwitch;
