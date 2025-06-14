
import { utils, WorkBook, WorkSheet, write } from 'xlsx';
import { FastestFingerQuestion, RegularQuestion } from '@/types/question';

export const downloadXLSX = (
  fastestFingerQuestion: FastestFingerQuestion | null,
  regularQuestions: RegularQuestion[]
): void => {
  // Create a new workbook
  const workbook: WorkBook = utils.book_new();
  
  // Create worksheet for Regular Questions
  const regularQuestionsData = regularQuestions.map((q, index) => {
    return {
      Category: q.category,
      Question: q.text,
      A: q.answers.a.text,
      B: q.answers.b.text,
      C: q.answers.c.text,
      D: q.answers.d.text,
      ANSWER: q.answers.a.correct ? 'A' : q.answers.b.correct ? 'B' : q.answers.c.correct ? 'C' : q.answers.d.correct ? 'D' : '',
      DIFFICULTY: q.difficulty
    };
  });
  
  // Add header rows for the Regular Questions worksheet
  const regularHeader = ["Category", "Question", "A", "B", "C", "D", "ANSWER", "DIFFICULTY"];
  const regularWorksheet: WorkSheet = utils.json_to_sheet([
    regularHeader.reduce((obj, key, index) => ({ ...obj, [key]: key }), {}),
    ...regularQuestionsData
  ]);
  
  // Add Regular Questions worksheet to workbook
  utils.book_append_sheet(workbook, regularWorksheet, "NORMAL");
  
  // Create worksheet for Fastest Finger First Question
  if (fastestFingerQuestion) {
    // Convert correct order to readable format
    const correctOrderArray = [
      fastestFingerQuestion.correctOrder.one,
      fastestFingerQuestion.correctOrder.two,
      fastestFingerQuestion.correctOrder.three,
      fastestFingerQuestion.correctOrder.four
    ].map(letter => letter.toUpperCase());
    
    const correctOrderString = correctOrderArray.join('');
    
    const fastestData = [{
      Category: 'Fastest Finger', // Using Category instead of ID
      Question: fastestFingerQuestion.text,
      A: fastestFingerQuestion.answers.a,
      B: fastestFingerQuestion.answers.b,
      C: fastestFingerQuestion.answers.c,
      D: fastestFingerQuestion.answers.d,
      "CORRECT ORDER": correctOrderString,
      DIFFICULTY: fastestFingerQuestion.difficulty
    }];
    
    // Add header rows for the Fastest Finger worksheet
    const fastestHeader = ["Category", "Question", "A", "B", "C", "D", "CORRECT ORDER", "DIFFICULTY"];
    const fastestWorksheet: WorkSheet = utils.json_to_sheet([
      fastestHeader.reduce((obj, key, index) => ({ ...obj, [key]: key }), {}),
      ...fastestData
    ]);
    
    // Add Fastest Finger worksheet to workbook
    utils.book_append_sheet(workbook, fastestWorksheet, "FASTEST FINGER FIRST");
  }
  
  // Generate Excel file and download
  const excelBuffer = write(workbook, { bookType: 'xlsx', type: 'array' });
  const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  
  // Create download link
  const url = window.URL.createObjectURL(data);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'questions.xlsx';
  
  // Trigger download
  document.body.appendChild(link);
  link.click();
  
  // Clean up
  window.URL.revokeObjectURL(url);
  document.body.removeChild(link);
};
