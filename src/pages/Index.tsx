import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { toast } from 'sonner';
import { useQuestions } from '@/context/QuestionsContext';
import { importXML } from '@/utils/xmlImport';
import { importXLSX } from '@/utils/xlsxImport';
import FastestFingerList from '@/components/FastestFingerList';
import RegularQuestionList from '@/components/RegularQuestionList';
import ExportPanel from '@/components/ExportPanel';
import FastestFingerForm from '@/components/FastestFingerForm';
import RegularQuestionForm from '@/components/RegularQuestionForm';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

const IndexPage: React.FC = () => {
  const { setQuestions } = useQuestions();
  const [isFastestFingerFormOpen, setIsFastestFingerFormOpen] = useState(false);
  const [isRegularQuestionFormOpen, setIsRegularQuestionFormOpen] = useState(false);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];

    try {
      if (file.type === 'text/xml' || file.name.endsWith('.xml')) {
        await importXML(file, setQuestions);
        toast.success('XML file imported successfully!');
      } else if (file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
                 file.type === 'application/vnd.ms-excel' ||
                 file.name.endsWith('.xlsx') ||
                 file.name.endsWith('.xls')) {
        await importXLSX(file, setQuestions);
        toast.success('Excel file imported successfully!');
      } else {
        toast.error('Unsupported file type. Please import an XML or Excel file.');
      }
    } catch (error: any) {
      console.error('Error importing file:', error);
      toast.error(error.message || 'Failed to import file.');
    }
  }, [setQuestions]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div className="container mx-auto py-10">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Question Lists */}
        <div className="col-span-2 space-y-6">
          <FastestFingerList onEdit={() => {}} />
          <RegularQuestionList onEdit={() => {}} />
        </div>

        {/* Forms and Export Panel */}
        <div className="col-span-1 space-y-6">
          {/* Add Question Buttons */}
          <div className="space-y-3">
            <Button className="w-full justify-start" onClick={() => setIsFastestFingerFormOpen(true)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Fastest Finger Question
            </Button>
            <Button className="w-full justify-start" onClick={() => setIsRegularQuestionFormOpen(true)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Regular Question
            </Button>
          </div>

          {/* Import Section */}
          <div {...getRootProps()} className="relative border-2 border-dashed rounded-lg p-6 cursor-pointer bg-white">
            <input {...getInputProps()} />
            <div className="text-center">
              {isDragActive ? (
                <p className="text-blue-500">Drop the files here ...</p>
              ) : (
                <>
                  <p className="text-gray-700">Drag 'n' drop some files here, or click to select files</p>
                  <p className="text-gray-500 text-sm mt-2">Supported files: XML, XLSX, XLS</p>
                </>
              )}
            </div>
          </div>
          
          {/* Import Instructions and Export Panel */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-lg font-semibold mb-4">📁 Import Instructions</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">📄 XML Import</h3>
                  <div className="bg-gray-50 p-4 rounded-md">
                    <p className="text-sm text-gray-700 mb-2">
                      Your XML file should follow this structure:
                    </p>
                    <pre className="text-xs bg-gray-800 text-green-400 p-3 rounded overflow-x-auto">
{`<questions>
  <fastest difficulty="1">
    <text>Put these events in chronological order:</text>
    <a>Event A</a>
    <b>Event B</b>
    <c>Event C</c>
    <d>Event D</d>
    <correctOrder>
      <one>b</one>
      <two>a</two>
      <three>d</three>
      <four>c</four>
    </correctOrder>
  </fastest>
  <question difficulty="2">
    <category>History</category>
    <text>What is the capital of France?</text>
    <a correct="no">London</a>
    <b correct="yes">Paris</b>
    <c correct="no">Berlin</c>
    <d correct="no">Madrid</d>
  </question>
</questions>`}
                    </pre>
                    <p className="text-xs text-gray-600 mt-2">
                      Note: The difficulty attribute is optional (1=Easy, 2=Medium, 3=Hard). If not specified, questions default to Easy.
                    </p>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">📊 Excel Import</h3>
                  <div className="bg-gray-50 p-4 rounded-md">
                    <p className="text-sm text-gray-700 mb-2">
                      Your Excel file should contain these sheets:
                    </p>
                    <ul className="text-sm text-gray-700 space-y-1 mb-3">
                      <li><strong>"NORMAL"</strong> sheet for regular questions</li>
                      <li><strong>"FASTEST FINGER FIRST"</strong> sheet for fastest finger questions</li>
                    </ul>
                    <p className="text-sm text-gray-700 mb-2">
                      Column structure for <strong>NORMAL</strong> sheet:
                    </p>
                    <div className="bg-white border rounded p-2 text-xs font-mono mb-2">
                      Category | Question | A | B | C | D | ANSWER | DIFFICULTY
                    </div>
                    <p className="text-sm text-gray-700 mb-2">
                      Column structure for <strong>FASTEST FINGER FIRST</strong> sheet:
                    </p>
                    <div className="bg-white border rounded p-2 text-xs font-mono mb-2">
                      Category | Question | A | B | C | D | CORRECT ORDER | DIFFICULTY
                    </div>
                    <p className="text-xs text-gray-600">
                      Data starts from the second row (first row is treated as headers). 
                      DIFFICULTY column should contain 1 (Easy), 2 (Medium), or 3 (Hard). If empty, defaults to Easy.
                      For CORRECT ORDER, use format like "ABCD" or "1234".
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <ExportPanel />
          </div>
        </div>
      </div>

      {/* Modals */}
      {isFastestFingerFormOpen && (
        <FastestFingerForm onClose={() => setIsFastestFingerFormOpen(false)} />
      )}
      {isRegularQuestionFormOpen && (
        <RegularQuestionForm onClose={() => setIsRegularQuestionFormOpen(false)} />
      )}
    </div>
  );
};

export default IndexPage;
