
import { utils, read } from 'xlsx';
import { FastestFingerQuestion, RegularQuestion } from '@/types/question';
import { v4 as uuidv4 } from 'uuid';

const processNormalSheet = (worksheet: any): RegularQuestion[] => {
  const jsonData = utils.sheet_to_json(worksheet, { header: 1 });
  // Skip first row (header)
  const questions = jsonData.slice(1).map((row: any) => {
    if (!row || row.length < 6) return null; // Skip empty or invalid rows
    
    const [_, question, optionA, optionB, optionC, optionD, answer] = row;
    
    // Skip if essential data is missing
    if (!question || !optionA || !optionB || !optionC || !optionD || !answer) return null;
    
    const normalizedAnswer = answer.toString().trim().toLowerCase();
    
    return {
      id: uuidv4(),
      category: 'Imported',
      text: question,
      answers: {
        a: { text: optionA, correct: normalizedAnswer === 'a' },
        b: { text: optionB, correct: normalizedAnswer === 'b' },
        c: { text: optionC, correct: normalizedAnswer === 'c' },
        d: { text: optionD, correct: normalizedAnswer === 'd' }
      },
      selected: false
    };
  });
  
  return questions.filter((q): q is RegularQuestion => q !== null);
};

// Define a type that matches what we're actually creating in processFFSheet
type FFQuestionWithRequiredDifficulty = Omit<FastestFingerQuestion, 'difficulty'> & { difficulty: number };

const processFFSheet = (worksheet: any): FastestFingerQuestion[] => {
  const jsonData = utils.sheet_to_json(worksheet, { header: 1 });
  // Skip first row (header)
  const questions = jsonData.slice(1).map((row: any) => {
    if (!row || row.length < 7) return null; // Skip empty or invalid rows
    
    const [_, question, optionA, optionB, optionC, optionD, correctOrder] = row;
    
    // Skip if essential data is missing
    if (!question || !optionA || !optionB || !optionC || !optionD || !correctOrder) return null;
    
    // Process the correct order string
    let orderArray = correctOrder.toString()
      .toLowerCase()
      .split(/[-\s]/)
      .map((c: string) => {
        if (c === '1' || c === 'a') return 'a';
        if (c === '2' || c === 'b') return 'b';
        if (c === '3' || c === 'c') return 'c';
        if (c === '4' || c === 'd') return 'd';
        return c;
      })
      .filter((c: string) => ['a', 'b', 'c', 'd'].includes(c));
    
    // Ensure we have exactly 4 valid options
    if (orderArray.length !== 4) return null;
    
    return {
      id: uuidv4(),
      text: question,
      answers: {
        a: optionA,
        b: optionB,
        c: optionC,
        d: optionD
      },
      correctOrder: {
        one: orderArray[0] as 'a' | 'b' | 'c' | 'd',
        two: orderArray[1] as 'a' | 'b' | 'c' | 'd',
        three: orderArray[2] as 'a' | 'b' | 'c' | 'd',
        four: orderArray[3] as 'a' | 'b' | 'c' | 'd'
      },
      selected: false,
      difficulty: 0 // We always set a default value
    };
  });
  
  // Use our intermediate type for the type predicate, then cast the result
  return questions.filter((q): q is FFQuestionWithRequiredDifficulty => q !== null) as FastestFingerQuestion[];
};

// Export function to match what ImportPanel.tsx is trying to import
export const importXLSX = async (file: File, setQuestions: (questions: {
  fastestFingerQuestion: FastestFingerQuestion | null;
  regularQuestions: RegularQuestion[];
}) => void): Promise<void> => {
  try {
    const result = await importFromExcel(file);
    // Transform the result into the format expected by setQuestions
    setQuestions({
      fastestFingerQuestion: result.fastest.length > 0 ? result.fastest[0] : null,
      regularQuestions: result.regular
    });
  } catch (error) {
    console.error('Error importing XLSX:', error);
    throw error;
  }
};

// Keep the original function for backwards compatibility
export const importFromExcel = async (file: File): Promise<{ regular: RegularQuestion[], fastest: FastestFingerQuestion[] }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = read(data, { type: 'binary' });
        
        const regularSheet = workbook.Sheets['NORMAL'];
        const fastestSheet = workbook.Sheets['FASTEST FINGER FIRST'];
        
        const regular = regularSheet ? processNormalSheet(regularSheet) : [];
        const fastest = fastestSheet ? processFFSheet(fastestSheet) : [];
        
        resolve({ regular, fastest });
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = (error) => reject(error);
    reader.readAsBinaryString(file);
  });
};
