
import { FastestFingerQuestion, RegularQuestion } from '@/types/question';
import { v4 as uuidv4 } from 'uuid';

const parseXML = (xmlString: string): { 
  fastestFingerQuestion: FastestFingerQuestion | null;
  regularQuestions: RegularQuestion[];
} => {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlString, 'text/xml');
  
  // Parse Fastest Finger Question
  const fastestNode = xmlDoc.querySelector('fastest');
  let fastestFingerQuestion: FastestFingerQuestion | null = null;
  
  if (fastestNode) {
    const text = fastestNode.querySelector('text')?.textContent || '';
    const a = fastestNode.querySelector('a')?.textContent || '';
    const b = fastestNode.querySelector('b')?.textContent || '';
    const c = fastestNode.querySelector('c')?.textContent || '';
    const d = fastestNode.querySelector('d')?.textContent || '';
    const one = fastestNode.querySelector('correctOrder one')?.textContent as 'a' | 'b' | 'c' | 'd' || 'a';
    const two = fastestNode.querySelector('correctOrder two')?.textContent as 'a' | 'b' | 'c' | 'd' || 'b';
    const three = fastestNode.querySelector('correctOrder three')?.textContent as 'a' | 'b' | 'c' | 'd' || 'c';
    const four = fastestNode.querySelector('correctOrder four')?.textContent as 'a' | 'b' | 'c' | 'd' || 'd';
    const difficulty = Number(fastestNode.getAttribute('difficulty')) || 0;

    if (text && a && b && c && d) {
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
  
  questionNodes.forEach((node) => {
    const text = node.querySelector('text')?.textContent?.trim();
    const category = node.querySelector('category')?.textContent?.trim() || '';
    
    if (text) {
      const a = node.querySelector('a');
      const b = node.querySelector('b');
      const c = node.querySelector('c');
      const d = node.querySelector('d');

      regularQuestions.push({
        id: uuidv4(),
        category,
        text,
        answers: {
          a: { 
            text: a?.textContent || '', 
            correct: a?.getAttribute('correct') === 'yes' 
          },
          b: { 
            text: b?.textContent || '', 
            correct: b?.getAttribute('correct') === 'yes' 
          },
          c: { 
            text: c?.textContent || '', 
            correct: c?.getAttribute('correct') === 'yes' 
          },
          d: { 
            text: d?.textContent || '', 
            correct: d?.getAttribute('correct') === 'yes' 
          },
        },
        selected: false,
      });
    }
  });

  return { fastestFingerQuestion, regularQuestions };
};

export const importXML = async (file: File, setQuestions: (questions: {
  fastestFingerQuestion: FastestFingerQuestion | null;
  regularQuestions: RegularQuestion[];
}) => void) => {
  try {
    const text = await file.text();
    const questions = parseXML(text);
    setQuestions(questions);
  } catch (error) {
    console.error('Error importing XML:', error);
    throw error;
  }
};
