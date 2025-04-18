
import { useAuth } from '@/context/AuthContext';
import { Progress } from '@/components/ui/progress';

const QuestionCounter = () => {
  const { userProfile } = useAuth();
  const questionsCount = userProfile?.questionsCount || 0;
  const maxQuestions = 20;
  const percentage = (questionsCount / maxQuestions) * 100;

  return (
    <div className="p-4 bg-muted rounded-lg mb-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-medium">Question Storage</h3>
        <span className="text-sm">
          {questionsCount} of {maxQuestions} questions used
        </span>
      </div>
      <Progress value={percentage} className="h-2" />
      {questionsCount >= maxQuestions && (
        <p className="text-sm text-destructive mt-2">
          You've reached your limit of 20 questions. Please delete some questions to add more.
        </p>
      )}
      {questionsCount < maxQuestions && (
        <p className="text-sm text-muted-foreground mt-2">
          You can store up to {maxQuestions - questionsCount} more questions.
        </p>
      )}
    </div>
  );
};

export default QuestionCounter;
