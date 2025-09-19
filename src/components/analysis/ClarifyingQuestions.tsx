import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { HelpCircle, ArrowRight, CheckCircle } from "lucide-react";
import { ClarifyingQuestion } from "@/types/analysis";

interface ClarifyingQuestionsProps {
  questions: ClarifyingQuestion[];
  onAnswersSubmit: (answers: Record<string, string>) => void;
  onSkip: () => void;
}

export const ClarifyingQuestions = ({ 
  questions, 
  onAnswersSubmit, 
  onSkip 
}: ClarifyingQuestionsProps) => {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const canProceed = answers[currentQuestion.id]?.trim().length > 0;
  const answeredCount = Object.keys(answers).length;

  const handleAnswerChange = (value: string) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: value
    }));
  };

  const handleNext = () => {
    if (isLastQuestion) {
      onAnswersSubmit(answers);
    } else {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleSkipAll = () => {
    onSkip();
  };

  return (
    <Card className="animate-slide-up shadow-medium border-psychology-accent/20" role="region" aria-labelledby="clarifying-title">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-accent rounded-lg flex items-center justify-center">
            <HelpCircle className="h-5 w-5 text-white" />
          </div>
          <div>
            <CardTitle id="clarifying-title" className="text-xl">Clarifying Questions</CardTitle>
            <p className="text-sm text-muted-foreground">
              Help us understand your situation better ({answeredCount}/{questions.length} answered)
            </p>
          </div>
        </div>
        
        {/* Progress Indicator */}
        <div className="flex gap-1 mt-4" role="progressbar" aria-valuenow={currentQuestionIndex + 1} aria-valuemin={1} aria-valuemax={questions.length}>
          {questions.map((_, index) => (
            <div
              key={index}
              className={`h-2 flex-1 rounded-full transition-colors ${
                index <= currentQuestionIndex 
                  ? 'bg-psychology-accent' 
                  : 'bg-muted'
              }`}
              aria-label={`Question ${index + 1} ${index < currentQuestionIndex ? 'completed' : index === currentQuestionIndex ? 'current' : 'pending'}`}
            />
          ))}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Current Question */}
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <Badge variant="outline" className="mt-1 bg-psychology-accent/10 text-psychology-accent border-psychology-accent/20">
              {currentQuestionIndex + 1}
            </Badge>
            <div className="flex-1">
              <label htmlFor={`question-${currentQuestion.id}`} className="block text-foreground font-medium mb-3">
                {currentQuestion.question}
              </label>
              <Textarea
                id={`question-${currentQuestion.id}`}
                placeholder="Please share your thoughts..."
                value={answers[currentQuestion.id] || ''}
                onChange={(e) => handleAnswerChange(e.target.value)}
                className="min-h-[100px] resize-none"
                aria-describedby={`question-${currentQuestion.id}-help`}
                autoFocus
              />
              <p id={`question-${currentQuestion.id}-help`} className="text-xs text-muted-foreground mt-2">
                This helps us understand the <strong>{currentQuestion.field}</strong> aspect of your experience
              </p>
            </div>
          </div>
        </div>

        {/* Previously Answered Questions Summary */}
        {answeredCount > 0 && currentQuestionIndex > 0 && (
          <div className="border-t pt-4">
            <h4 className="text-sm font-medium text-foreground mb-3">Your Previous Answers:</h4>
            <div className="space-y-2">
              {questions.slice(0, currentQuestionIndex).map((q, index) => (
                answers[q.id] && (
                  <div key={q.id} className="flex items-start gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-psychology-success mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="text-muted-foreground">{q.question}</span>
                      <p className="text-foreground truncate max-w-[300px]">{answers[q.id]}</p>
                    </div>
                  </div>
                )
              ))}
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between items-center pt-4 border-t">
          <div className="flex gap-2">
            {currentQuestionIndex > 0 && (
              <Button 
                variant="outline" 
                onClick={handlePrevious}
                className="text-sm"
              >
                Previous
              </Button>
            )}
            <Button 
              variant="ghost" 
              onClick={handleSkipAll}
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Skip All Questions
            </Button>
          </div>
          
          <Button 
            onClick={handleNext}
            disabled={!canProceed}
            className="bg-gradient-accent hover:opacity-90"
          >
            {isLastQuestion ? 'Start Analysis' : 'Next Question'}
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>

        {/* Footer Info */}
        <div className="text-xs text-muted-foreground text-center pt-2 border-t">
          Your answers help us provide more accurate psychological analysis
        </div>
      </CardContent>
    </Card>
  );
};