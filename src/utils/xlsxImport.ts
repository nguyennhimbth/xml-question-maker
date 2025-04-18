
import { FastestFingerQuestion, RegularQuestion } from '@/types/question';
import { utils, read } from 'xlsx';
import { v4 as uuidv4 } from 'uuid';

// Function to parse correct order from Excel format
const parseCorrectOrder = (orderString: string): { one: 'a' | 'b' | 'c' | 'd'; two: 'a' | 'b' | 'c' | 'd'; three: 'a' | 'b' | 'c' | 'd'; four: 'a' | 'b' | 'c' | 'd' } | null => {
  if (!orderString) return null;
  
  // Remove any spaces
  const cleaned = orderString.replace(/\s/g, '');
  
  // Handle different formats
  let orderArray: string[] = [];
  
  // Handle ABCD format
  if (/^[A-Da-d]{4}$/.test(cleaned)) {
    orderArray = cleaned.toLowerCase().split('');
  } 
  // Handle A-B-C-D format
  else if (/^[A-Da-d](-[A-Da-d]){3}$/.test(cleaned)) {
    orderArray = cleaned.toLowerCase().split('-');
  }
  // Handle 1234 format (convert to abcd)
  else if (/^[1-4]{4}$/.test(cleaned)) {
    orderArray = cleaned.split('').map(num => {
      switch (num) {
        case '1': return 'a';
        case '2': return 'b';
        case '3': return 'c';
        case '4': return 'd';
        default: return 'a'; // Should never happen
      }
    });
  }
  // Handle 1-2-3-4 format (convert to abcd)
  else if (/^[1-4](-[1-4]){3}$/.test(cleaned)) {
    orderArray = cleaned.split('-').map(num => {
      switch (num) {
        case '1': return 'a';
        case '2': return 'b';
        case '3': return 'c';
        case '4': return 'd';
        default: return 'a'; // Should never happen
      }
    });
  }
  
  // If we couldn't parse in any format, return null
  if (orderArray.length !== 4) return null;
  
  // Validate all elements are valid answers
  if (!orderArray.every(letter => ['a', 'b', 'c', 'd'].includes(letter))) return null;
  
  return {
    one: orderArray[0] as 'a' | 'b' | 'c' | 'd',
    two: orderArray[1] as 'a' | 'b' | 'c' | 'd',
    three: orderArray[2] as 'a' | 'b' | 'c' | 'd',
    four: orderArray[3] as 'a' | 'b' | 'c' | 'd'
  };
};

export const importXLSX = async (file: File, setQuestions: (questions: {
  fastestFingerQuestion: FastestFingerQuestion | null;
  regularQuestions: RegularQuestion[];
}) => void) => {
  try {
    // Read the Excel file
    const data = await file.arrayBuffer();
    const workbook = read(data);
    
    // Check if the required sheets exist
    const normalSheetName = workbook.SheetNames.find(name => 
      name.toUpperCase().includes('NORMAL') || name.includes('REGULAR') || name.includes('Question'));
    
    const fastestSheetName = workbook.SheetNames.find(name => 
      name.toUpperCase().includes('FASTEST') || name.includes('FINGER'));
    
    if (!normalSheetName && !fastestSheetName) {
      throw new Error('Could not find sheets with Normal Questions or Fastest Finger First questions');
    }
    
    const regularQuestions: RegularQuestion[] = [];
    let fastestFingerQuestion: FastestFingerQuestion | null = null;
    
    // Process Regular Questions
    if (normalSheetName) {
      const normalSheet = workbook.Sheets[normalSheetName];
      const normalData = utils.sheet_to_json<any>(normalSheet, { header: 1 });
      
      // Skip first THREE rows (header rows) - Updated from 2 to 3
      for (let i = 3; i < normalData.length; i++) {
        const row = normalData[i];
        if (!row || row.length < 6) continue; // Skip empty rows
        
        const questionText = row[1]?.toString().trim();
        if (!questionText) continue; // Skip rows without question text
        
        const optionA = row[2]?.toString().trim() || '';
        const optionB = row[3]?.toString().trim() || '';
        const optionC = row[4]?.toString().trim() || '';
        const optionD = row[5]?.toString().trim() || '';
        const correctAnswer = row[6]?.toString().trim().toUpperCase() || '';
        
        // Only add valid questions
        if (questionText && (optionA || optionB || optionC || optionD)) {
          regularQuestions.push({
            id: uuidv4(),
            category: 'Imported', // Default category
            text: questionText,
            answers: {
              a: { text: optionA, correct: correctAnswer === 'A' },
              b: { text: optionB, correct: correctAnswer === 'B' },
              c: { text: optionC, correct: correctAnswer === 'C' },
              d: { text: optionD, correct: correctAnswer === 'D' },
            },
            selected: false
          });
        }
      }
    }
    
    // Process Fastest Finger First Questions
    if (fastestSheetName) {
      const fastestSheet = workbook.Sheets[fastestSheetName];
      const fastestData = utils.sheet_to_json<any>(fastestSheet, { header: 1 });
      
      // Skip first THREE rows (header rows) - Updated from 2 to 3
      for (let i = 3; i < fastestData.length; i++) {
        const row = fastestData[i];
        if (!row || row.length < 6) continue; // Skip empty rows
        
        const questionText = row[1]?.toString().trim();
        if (!questionText) continue; // Skip rows without question text
        
        const optionA = row[2]?.toString().trim() || '';
        const optionB = row[3]?.toString().trim() || '';
        const optionC = row[4]?.toString().trim() || '';
        const optionD = row[5]?.toString().trim() || '';
        const correctOrderString = row[6]?.toString().trim() || '';
        
        const correctOrder = parseCorrectOrder(correctOrderString);
        
        // Only add valid fastest finger questions
        if (questionText && optionA && optionB && optionC && optionD && correctOrder) {
          fastestFingerQuestion = {
            id: uuidv4(),
            text: questionText,
            answers: { a: optionA, b: optionB, c: optionC, d: optionD },
            correctOrder,
            selected: true, // Auto-select the imported fastest finger question
            difficulty: 0
          };
          break; // Only take the first valid fastest finger question
        }
      }
    }
    
    // Update the questions in the app
    setQuestions({ fastestFingerQuestion, regularQuestions });
    
  } catch (error) {
    console.error('Error importing XLSX:', error);
    throw error;
  }
};
