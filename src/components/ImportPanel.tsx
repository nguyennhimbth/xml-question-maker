
import React, { useState } from 'react';
import { useQuestions } from '@/context/QuestionsContext';
import { importXML } from '@/utils/xmlImport';
import { importXLSX } from '@/utils/xlsxImport';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { FileUp, File, FileX } from 'lucide-react';
import { toast } from 'sonner';

const ImportPanel = () => {
  const [importType, setImportType] = useState<'xml' | 'xlsx'>('xml');
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { setQuestions } = useQuestions();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setSelectedFile(file);
  };

  const handleImport = async () => {
    if (!selectedFile) {
      toast.error('Please select a file to import');
      return;
    }

    setLoading(true);
    try {
      if (importType === 'xml') {
        await importXML(selectedFile, setQuestions);
        toast.success('Questions imported successfully from XML');
      } else {
        await importXLSX(selectedFile, setQuestions);
        toast.success('Questions imported successfully from Excel');
      }
      setSelectedFile(null);
      // Reset file input
      const fileInput = document.getElementById('file-input') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
    } catch (error) {
      console.error('Import error:', error);
      toast.error('Failed to import questions. Please check your file format.');
    } finally {
      setLoading(false);
    }
  };

  const clearFile = () => {
    setSelectedFile(null);
    // Reset file input
    const fileInput = document.getElementById('file-input') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Import Questions</CardTitle>
        <CardDescription>
          Import questions from XML or Excel files
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="xml" onValueChange={(v) => setImportType(v as 'xml' | 'xlsx')}>
          <TabsList className="mb-4">
            <TabsTrigger value="xml">XML Format</TabsTrigger>
            <TabsTrigger value="xlsx">Excel Format</TabsTrigger>
          </TabsList>
          
          <TabsContent value="xml" className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Import questions from an XML file following the specified format.
            </p>
            <pre className="p-2 bg-muted rounded-md text-xs overflow-auto max-h-[200px]">
{`<questions>
  <fastest difficulty="0">
    <text>Your fastest finger question text</text>
    <a>Option A</a>
    <b>Option B</b>
    <c>Option C</c>
    <d>Option D</d>
    <correctOrder>
      <one>a</one>
      <two>b</two>
      <three>c</three>
      <four>d</four>
    </correctOrder>
  </fastest>
  <question>
    <category>Your Category</category>
    <text>Your question text</text>
    <a correct="yes/no">Option A</a>
    <b correct="yes/no">Option B</b>
    <c correct="yes/no">Option C</c>
    <d correct="yes/no">Option D</d>
  </question>
</questions>`}
            </pre>
          </TabsContent>
          
          <TabsContent value="xlsx" className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Import questions from an Excel file with two sheets:
            </p>
            <div className="space-y-2">
              <div className="text-sm font-medium">Sheet 1: "NORMAL"</div>
              <p className="text-xs text-muted-foreground">
                Columns: Id, Question, A, B, C, D, ANSWER (correct option as A, B, C, or D)
              </p>
              
              <div className="text-sm font-medium mt-3">Sheet 2: "FASTEST FINGER FIRST"</div>
              <p className="text-xs text-muted-foreground">
                Columns: Id, Question, A, B, C, D, CORRECT ORDER (can be formatted as ABCD, A-B-C-D, 1234, or 1-2-3-4)
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                First two rows will be ignored (headers).
              </p>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="mt-6">
          <div className="flex items-center gap-2">
            <input
              type="file"
              id="file-input"
              accept={importType === 'xml' ? '.xml' : '.xlsx, .xls'}
              onChange={handleFileChange}
              className="hidden"
            />
            <Button 
              variant="outline" 
              onClick={() => document.getElementById('file-input')?.click()}
              className="w-full"
            >
              <FileUp className="mr-2 h-4 w-4" />
              Select {importType.toUpperCase()} File
            </Button>
            {selectedFile && (
              <Button 
                variant="ghost" 
                size="icon"
                onClick={clearFile}
              >
                <FileX className="h-4 w-4" />
              </Button>
            )}
          </div>
          
          {selectedFile && (
            <div className="mt-4 p-3 bg-muted rounded-md flex items-center">
              <File className="h-4 w-4 mr-2" />
              <span className="text-sm truncate">{selectedFile.name}</span>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleImport} 
          disabled={!selectedFile || loading}
          className="w-full"
        >
          {loading ? 'Importing...' : 'Import Questions'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ImportPanel;
