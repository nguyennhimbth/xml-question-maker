
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileCode, HelpCircle } from 'lucide-react';
import UserAccount from './UserAccount';

interface HeaderProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  children: React.ReactNode;
}

const Header: React.FC<HeaderProps> = ({ activeTab, onTabChange, children }) => {
  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex items-center">
          <img 
            src="/lovable-uploads/7fc22ca2-27a5-451a-8f6c-30ff2232452a.png" 
            alt="Question Forge Studio" 
            className="mr-2 h-8 w-8"
          />
          <h1 className="font-bold">Question Forge Studio</h1>
        </div>
        
        <Tabs value={activeTab} onValueChange={onTabChange} className="ml-auto">
          <TabsList>
            <TabsTrigger value="fastest">Fastest Finger</TabsTrigger>
            <TabsTrigger value="regular">Regular Questions</TabsTrigger>
            <TabsTrigger value="import">Import</TabsTrigger>
            <TabsTrigger value="export">Export</TabsTrigger>
          </TabsList>
          {children}
        </Tabs>
        
        <div className="ml-4 flex items-center space-x-2">
          <UserAccount />
          
          <a 
            href="#" 
            className="inline-flex h-8 w-8 items-center justify-center rounded-full border"
            title="Help & About"
          >
            <HelpCircle className="h-4 w-4" />
            <span className="sr-only">Help</span>
          </a>
        </div>
      </div>
    </header>
  );
};

export default Header;
