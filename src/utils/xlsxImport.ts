
import { utils, read } from 'xlsx';
import { FastestFingerQuestion, RegularQuestion } from '@/types/question';
import { v4 as uuidv4 } from 'uuid';

const sanitizeText = (text: any): string => {
  if (!text) return '';
  const str = String(text).trim();
  // Remove potentially harmful content
  return str.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '');
};

const processNormalSheet = (worksheet: any): RegularQuestion[] => {
  const jsonData = utils.sheet_to_json(worksheet, { header: 1 });
  
  // Start from the second row (index 1) - skip header row
  const dataRows = jsonData.slice(1);
  
  // Limit number of rows for security
  const maxRows = 1000;
  const limitedRows = dataRows.slice(0, maxRows);
  
  const questions = limitedRows.map((row: any) => {
    if (!row || row.length < 7) return null; // Need at least 7 columns
    
    const [_, question, optionA, optionB, optionC, optionD, answer] = row;
    
    // Skip if essential data is missing
    if (!question || !optionA || !optionB || !optionC || !optionD || !answer) return null;
    
    // Sanitize all text inputs
    const sanitizedQuestion = sanitizeText(question);
    const sanitizedA = sanitizeText(optionA);
    const sanitizedB = sanitizeText(optionB);
    const sanitizedC = sanitizeText(optionC);
    const sanitizedD = sanitizeText(optionD);
    
    if (!sanitizedQuestion || !sanitizedA || !sanitizedB || !sanitizedC || !sanitizedD) return null;
    
    const normalizedAnswer = sanitizeText(answer).toLowerCase();
    
    // Validate answer is one of the valid options
    if (!['a', 'b', 'c', 'd'].includes(normalizedAnswer)) return null;
    
    return {
      id: uuidv4(),
      category: 'Imported',
      text: sanitizedQuestion,
      answers: {
        a: { text: sanitizedA, correct: normalizedAnswer === 'a' },
        b: { text: sanitizedB, correct: normalizedAnswer === 'b' },
        c: { text: sanitizedC, correct: normalizedAnswer === 'c' },
        d: { text: sanitizedD, correct: normalizedAnswer === 'd' }
      },
      selected: false
    };
  });
  
  return questions.filter((q): q is RegularQuestion => q !== null);
};

type FFQuestionWithRequiredDifficulty = Omit<FastestFingerQuestion, 'difficulty'> & { difficulty: number };

const processFFSheet = (worksheet: any): FastestFingerQuestion[] => {
  const jsonData = utils.sheet_to_json(worksheet, { header: 1 });
  
  // Start from the second row (index 1) - skip header row
  const dataRows = jsonData.slice(1);
  
  // Limit number of rows for security
  const maxRows = 100; // Fewer fastest finger questions needed
  const limitedRows = dataRows.slice(0, maxRows);
  
  const questions = limitedRows.map((row: any) => {
    if (!row || row.length < 7) return null; // Need at least 7 columns
    
    const [_, question, optionA, optionB, optionC, optionD, correctOrder] = row;
    
    // Skip if essential data is missing
    if (!question || !optionA || !optionB || !optionC || !optionD || !correctOrder) return null;
    
    // Sanitize all text inputs
    const sanitizedQuestion = sanitizeText(question);
    const sanitizedA = sanitizeText(optionA);
    const sanitizedB = sanitizeText(optionB);
    const sanitizedC = sanitizeText(optionC);
    const sanitizedD = sanitizeText(optionD);
    
    if (!sanitizedQuestion || !sanitizedA || !sanitizedB || !sanitizedC || !sanitizedD) return null;
    
    // Process the correct order string with better validation
    const orderString = sanitizeText(correctOrder).toLowerCase();
    let orderArray = orderString
      .split(/[-\s,]/)
      .map((c: string) => c.trim())
      .map((c: string) => {
        if (c === '1' || c === 'a') return 'a';
        if (c === '2' || c === 'b') return 'b';
        if (c === '3' || c === 'c') return 'c';
        if (c === '4' || c === 'd') return 'd';
        return c;
      })
      .filter((c: string) => ['a', 'b', 'c', 'd'].includes(c));
    
    // If no separators found, try to parse as continuous string (e.g., "abcd" or "1234")
    if (orderArray.length === 0 && orderString.length >= 4) {
      orderArray = orderString.split('').slice(0, 4).map((c: string) => {
        if (c === '1' || c === 'a') return 'a';
        if (c === '2' || c === 'b') return 'b';
        if (c === '3' || c === 'c') return 'c';
        if (c === '4' || c === 'd') return 'd';
        return c;
      }).filter((c: string) => ['a', 'b', 'c', 'd'].includes(c));
    }
    
    // Ensure we have exactly 4 valid options and no duplicates
    if (orderArray.length !== 4 || new Set(orderArray).size !== 4) return null;
    
    return {
      id: uuidv4(),
      text: sanitizedQuestion,
      answers: {
        a: sanitizedA,
        b: sanitizedB,
        c: sanitizedC,
        d: sanitizedD
      },
      correctOrder: {
        one: orderArray[0] as 'a' | 'b' | 'c' | 'd',
        two: orderArray[1] as 'a' | 'b' | 'c' | 'd',
        three: orderArray[2] as 'a' | 'b' | 'c' | 'd',
        four: orderArray[3] as 'a' | 'b' | 'c' | 'd'
      },
      selected: false,
      difficulty: 0
    };
  });
  
  return questions.filter((q): q is FFQuestionWithRequiredDifficulty => q !== null) as FastestFingerQuestion[];
};

export const importXLSX = async (file: File, setQuestions: (questions: {
  fastestFingerQuestion: FastestFingerQuestion | null;
  regularQuestions: RegularQuestion[];
}) => void): Promise<void> => {
  try {
    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      throw new Error('File size too large');
    }

    // Validate file type
    const validTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel'
    ];
    if (!validTypes.includes(file.type) && !file.name.toLowerCase().endsWith('.xlsx') && !file.name.toLowerCase().endsWith('.xls')) {
      throw new Error('Invalid file type');
    }

    const result = await importFromExcel(file);
    setQuestions({
      fastestFingerQuestion: result.fastest.length > 0 ? result.fastest[0] : null,
      regularQuestions: result.regular
    });
  } catch (error) {
    console.error('Error importing XLSX:', error);
    throw error;
  }
};

export const importFromExcel = async (file: File): Promise<{ regular: RegularQuestion[], fastest: FastestFingerQuestion[] }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = read(data, { type: 'binary' });
        
        // Validate sheet names exist
        const regularSheet = workbook.Sheets['NORMAL'];
        const fastestSheet = workbook.Sheets['FASTEST FINGER FIRST'];
        
        if (!regularSheet && !fastestSheet) {
          throw new Error('No valid sheets found. Expected "NORMAL" and/or "FASTEST FINGER FIRST" sheets.');
        }
        
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
