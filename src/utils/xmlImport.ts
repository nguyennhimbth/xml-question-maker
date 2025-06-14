
import { FastestFingerQuestion, RegularQuestion } from '@/types/question';
import { v4 as uuidv4 } from 'uuid';

const sanitizeText = (text: string): string => {
  // Remove any potentially harmful content and trim whitespace
  return text.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .trim();
};

const parseXML = (xmlString: string): { 
  fastestFingerQuestion: FastestFingerQuestion | null;
  regularQuestions: RegularQuestion[];
} => {
  // Validate XML size
  if (xmlString.length > 10 * 1024 * 1024) { // 10MB limit
    throw new Error('XML file is too large');
  }

  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlString, 'text/xml');
  
  // Check for XML parsing errors
  const parserError = xmlDoc.querySelector('parsererror');
  if (parserError) {
    throw new Error('Invalid XML format');
  }

  // Parse Fastest Finger Question
  const fastestNode = xmlDoc.querySelector('fastest');
  let fastestFingerQuestion: FastestFingerQuestion | null = null;
  
  if (fastestNode) {
    const text = sanitizeText(fastestNode.querySelector('text')?.textContent || '');
    const a = sanitizeText(fastestNode.querySelector('a')?.textContent || '');
    const b = sanitizeText(fastestNode.querySelector('b')?.textContent || '');
    const c = sanitizeText(fastestNode.querySelector('c')?.textContent || '');
    const d = sanitizeText(fastestNode.querySelector('d')?.textContent || '');
    const one = fastestNode.querySelector('correctOrder one')?.textContent?.toLowerCase().trim() as 'a' | 'b' | 'c' | 'd' || 'a';
    const two = fastestNode.querySelector('correctOrder two')?.textContent?.toLowerCase().trim() as 'a' | 'b' | 'c' | 'd' || 'b';
    const three = fastestNode.querySelector('correctOrder three')?.textContent?.toLowerCase().trim() as 'a' | 'b' | 'c' | 'd' || 'c';
    const four = fastestNode.querySelector('correctOrder four')?.textContent?.toLowerCase().trim() as 'a' | 'b' | 'c' | 'd' || 'd';
    const difficultyStr = fastestNode.getAttribute('difficulty');
    const difficulty = difficultyStr ? Math.max(0, Math.min(10, Number(difficultyStr))) : 0; // Clamp between 0-10

    // Validate required fields
    if (text && a && b && c && d && ['a', 'b', 'c', 'd'].includes(one) && 
        ['a', 'b', 'c', 'd'].includes(two) && ['a', 'b', 'c', 'd'].includes(three) && 
        ['a', 'b', 'c', 'd'].includes(four)) {
      fastestFingerQuestion = {
        id: uuidv4(),
        text,
        answers: { a, b, c, d },
        correctOrder: { one, two, three, four },
        selected: false,
        difficulty
      };
    }
  }

  // Parse Regular Questions
  const regularQuestions: RegularQuestion[] = [];
  const questionNodes = xmlDoc.querySelectorAll('question');
  
  // Limit number of questions for security
  const maxQuestions = 1000;
  const limitedNodes = Array.from(questionNodes).slice(0, maxQuestions);
  
  limitedNodes.forEach((node) => {
    const text = sanitizeText(node.querySelector('text')?.textContent?.trim() || '');
    const category = sanitizeText(node.querySelector('category')?.textContent?.trim() || 'Imported');
    
    if (text) {
      const a = node.querySelector('a');
      const b = node.querySelector('b');
      const c = node.querySelector('c');
      const d = node.querySelector('d');

      // Validate that all options exist
      if (a && b && c && d) {
        regularQuestions.push({
          id: uuidv4(),
          category,
          text,
          answers: {
            a: { 
              text: sanitizeText(a.textContent || ''), 
              correct: a.getAttribute('correct')?.toLowerCase() === 'yes' 
            },
            b: { 
              text: sanitizeText(b.textContent || ''), 
              correct: b.getAttribute('correct')?.toLowerCase() === 'yes' 
            },
            c: { 
              text: sanitizeText(c.textContent || ''), 
              correct: c.getAttribute('correct')?.toLowerCase() === 'yes' 
            },
            d: { 
              text: sanitizeText(d.textContent || ''), 
              correct: d.getAttribute('correct')?.toLowerCase() === 'yes' 
            },
          },
          selected: false,
        });
      }
    }
  });

  return { fastestFingerQuestion, regularQuestions };
};

export const importXML = async (file: File, setQuestions: (questions: {
  fastestFingerQuestion: FastestFingerQuestion | null;
  regularQuestions: RegularQuestion[];
}) => void) => {
  try {
    // Validate file size
    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      throw new Error('File size too large');
    }

    // Validate file type
    if (!file.type.includes('xml') && !file.name.toLowerCase().endsWith('.xml')) {
      throw new Error('Invalid file type');
    }

    const text = await file.text();
    const questions = parseXML(text);
    setQuestions(questions);
  } catch (error) {
    console.error('Error importing XML:', error);
    throw error;
  }
};
