
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import UserDropdown from './UserDropdown';

interface HeaderProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  children: React.ReactNode;
}

const HeaderContent = ({ activeTab, onTabChange, children }: HeaderProps) => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="container flex h-14 items-center justify-between">
        <h1 className="text-xl font-semibold">Quiz Question Editor</h1>
        
        <div className="flex items-center gap-4">
          <Tabs defaultValue={activeTab} value={activeTab} onValueChange={onTabChange}>
            <TabsList>
              <TabsTrigger value="fastest">Fastest Finger</TabsTrigger>
              <TabsTrigger value="regular">Regular</TabsTrigger>
              <TabsTrigger value="import">Import</TabsTrigger>
              <TabsTrigger value="export">Export</TabsTrigger>
            </TabsList>
            {children}
          </Tabs>
          
          <UserDropdown />
        </div>
      </div>
    </header>
  );
};

export default HeaderContent;
