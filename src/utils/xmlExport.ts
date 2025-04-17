
import { FastestFingerQuestion, RegularQuestion } from '@/types/question';

export const generateXML = (
  fastestFingerQuestion: FastestFingerQuestion | null,
  regularQuestions: RegularQuestion[]
): string => {
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n<questions>\n';

  // Add the fastest finger first question if selected
  if (fastestFingerQuestion) {
    xml += `\t<fastest difficulty="${fastestFingerQuestion.difficulty || 0}">\n`;
    xml += `\t\t<text>${fastestFingerQuestion.text}</text>\n`;
    xml += `\t\t<a>${fastestFingerQuestion.answers.a}</a>\n`;
    xml += `\t\t<b>${fastestFingerQuestion.answers.b}</b>\n`;
    xml += `\t\t<c>${fastestFingerQuestion.answers.c}</c>\n`;
    xml += `\t\t<d>${fastestFingerQuestion.answers.d}</d>\n`;
    xml += '\t\t<correctOrder>\n';
    xml += `\t\t\t<one>${fastestFingerQuestion.correctOrder.one}</one>\n`;
    xml += `\t\t\t<two>${fastestFingerQuestion.correctOrder.two}</two>\n`;
    xml += `\t\t\t<three>${fastestFingerQuestion.correctOrder.three}</three>\n`;
    xml += `\t\t\t<four>${fastestFingerQuestion.correctOrder.four}</four>\n`;
    xml += '\t\t</correctOrder>\n';
    xml += '\t</fastest>\n';
  }

  // Add regular questions
  regularQuestions.forEach(question => {
    xml += '\t<question>\n';
    xml += `\t\t<category>${question.category}</category>\n`;
    xml += `\t\t<text>${question.text}</text>\n`;
    xml += `\t\t<a correct="${question.answers.a.correct ? 'yes' : 'no'}">${question.answers.a.text}</a>\n`;
    xml += `\t\t<b correct="${question.answers.b.correct ? 'yes' : 'no'}">${question.answers.b.text}</b>\n`;
    xml += `\t\t<c correct="${question.answers.c.correct ? 'yes' : 'no'}">${question.answers.c.text}</c>\n`;
    xml += `\t\t<d correct="${question.answers.d.correct ? 'yes' : 'no'}">${question.answers.d.text}</d>\n`;
    xml += '\t</question>\n';
  });

  xml += '</questions>';
  return xml;
};

export const downloadXML = (
  fastestFingerQuestion: FastestFingerQuestion | null,
  regularQuestions: RegularQuestion[]
) => {
  const xml = generateXML(fastestFingerQuestion, regularQuestions);
  const blob = new Blob([xml], { type: 'application/xml' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = 'questions.xml';
  document.body.appendChild(a);
  a.click();
  
  // Cleanup
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 0);
};
