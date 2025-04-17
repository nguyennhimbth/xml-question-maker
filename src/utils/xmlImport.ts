
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
    fastestFingerQuestion = {
      id: uuidv4(),
      text: fastestNode.querySelector('text')?.textContent || '',
      answers: {
        a: fastestNode.querySelector('a')?.textContent || '',
        b: fastestNode.querySelector('b')?.textContent || '',
        c: fastestNode.querySelector('c')?.textContent || '',
        d: fastestNode.querySelector('d')?.textContent || '',
      },
      correctOrder: {
        one: (fastestNode.querySelector('correctOrder one')?.textContent || 'a') as 'a' | 'b' | 'c' | 'd',
        two: (fastestNode.querySelector('correctOrder two')?.textContent || 'b') as 'a' | 'b' | 'c' | 'd',
        three: (fastestNode.querySelector('correctOrder three')?.textContent || 'c') as 'a' | 'b' | 'c' | 'd',
        four: (fastestNode.querySelector('correctOrder four')?.textContent || 'd') as 'a' | 'b' | 'c' | 'd',
      },
      selected: false,
      difficulty: Number(fastestNode.getAttribute('difficulty')) || 0,
    };
  }

  // Parse Regular Questions
  const regularQuestions: RegularQuestion[] = [];
  const questionNodes = xmlDoc.querySelectorAll('question');
  
  questionNodes.forEach((node) => {
    if (node.querySelector('text')?.textContent?.trim()) {
      regularQuestions.push({
        id: uuidv4(),
        category: node.querySelector('category')?.textContent || '',
        text: node.querySelector('text')?.textContent || '',
        answers: {
          a: { 
            text: node.querySelector('a')?.textContent || '', 
            correct: node.querySelector('a')?.getAttribute('correct') === 'yes' 
          },
          b: { 
            text: node.querySelector('b')?.textContent || '', 
            correct: node.querySelector('b')?.getAttribute('correct') === 'yes' 
          },
          c: { 
            text: node.querySelector('c')?.textContent || '', 
            correct: node.querySelector('c')?.getAttribute('correct') === 'yes' 
          },
          d: { 
            text: node.querySelector('d')?.textContent || '', 
            correct: node.querySelector('d')?.getAttribute('correct') === 'yes' 
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
  const text = await file.text();
  const questions = parseXML(text);
  setQuestions(questions);
};
