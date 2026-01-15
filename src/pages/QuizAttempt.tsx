import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { 
  ArrowLeft, 
  ArrowRight, 
  Clock, 
  CheckCircle2, 
  XCircle,
  RotateCcw,
  Trophy,
  AlertTriangle
} from 'lucide-react';
import { mockQuizzes } from '@/data/mockData';
import { toast } from 'sonner';

const QuizAttempt = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);

  const quiz = mockQuizzes.find(q => q.id === quizId);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (quiz && quiz.timeLimit && !showResults) {
      setTimeLeft(quiz.timeLimit * 60);
    }
  }, [quiz, showResults]);

  useEffect(() => {
    if (timeLeft === null || showResults) return;

    if (timeLeft <= 0) {
      handleSubmit();
      toast.warning('Time\'s up!', {
        description: 'Your quiz has been automatically submitted.',
      });
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => (prev !== null ? prev - 1 : null));
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, showResults]);

  useEffect(() => {
    if (quiz) {
      setAnswers(new Array(quiz.questions.length).fill(null));
    }
  }, [quiz]);

  if (!quiz) {
    return (
      <MainLayout>
        <div className="container mx-auto flex min-h-[60vh] items-center justify-center px-4">
          <Card className="w-full max-w-md text-center">
            <CardContent className="py-12">
              <AlertTriangle className="mx-auto mb-4 h-12 w-12 text-destructive" />
              <h2 className="mb-2 text-xl font-semibold">Quiz Not Found</h2>
              <p className="mb-4 text-muted-foreground">
                The quiz you're looking for doesn't exist.
              </p>
              <Button onClick={() => navigate('/quizzes')}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Quizzes
              </Button>
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    );
  }

  const question = quiz.questions[currentQuestion];
  const progress = ((currentQuestion + 1) / quiz.questions.length) * 100;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswerSelect = (value: string) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = parseInt(value);
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const handleSubmit = () => {
    setShowResults(true);
  };

  const calculateScore = () => {
    let correct = 0;
    quiz.questions.forEach((q, index) => {
      if (answers[index] === q.correctAnswer) {
        correct++;
      }
    });
    return {
      correct,
      total: quiz.questions.length,
      percentage: Math.round((correct / quiz.questions.length) * 100),
    };
  };

  const handleRetake = () => {
    setCurrentQuestion(0);
    setAnswers(new Array(quiz.questions.length).fill(null));
    setShowResults(false);
    if (quiz.timeLimit) {
      setTimeLeft(quiz.timeLimit * 60);
    }
  };

  if (showResults) {
    const score = calculateScore();
    const passed = score.percentage >= quiz.passingScore;

    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="mx-auto max-w-2xl">
            <Card className="card-elevated">
              <CardHeader className="text-center">
                <div className={`mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full ${
                  passed ? 'bg-success/10' : 'bg-destructive/10'
                }`}>
                  {passed ? (
                    <Trophy className="h-10 w-10 text-success" />
                  ) : (
                    <XCircle className="h-10 w-10 text-destructive" />
                  )}
                </div>
                <CardTitle className="font-display text-2xl">
                  {passed ? 'Congratulations!' : 'Keep Practicing'}
                </CardTitle>
                <p className="text-muted-foreground">
                  {passed
                    ? 'You have passed the safety quiz!'
                    : `You need ${quiz.passingScore}% to pass. Try again!`}
                </p>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Score Display */}
                <div className="rounded-xl bg-muted/50 p-6 text-center">
                  <p className="text-sm text-muted-foreground">Your Score</p>
                  <p className={`font-display text-5xl font-bold ${
                    passed ? 'text-success' : 'text-destructive'
                  }`}>
                    {score.percentage}%
                  </p>
                  <p className="mt-2 text-muted-foreground">
                    {score.correct} of {score.total} questions correct
                  </p>
                </div>

                {/* Question Review */}
                <div className="space-y-3">
                  <h3 className="font-semibold">Question Review</h3>
                  {quiz.questions.map((q, index) => {
                    const isCorrect = answers[index] === q.correctAnswer;
                    return (
                      <div
                        key={q.id}
                        className={`flex items-center gap-3 rounded-lg p-3 ${
                          isCorrect ? 'bg-success/10' : 'bg-destructive/10'
                        }`}
                      >
                        {isCorrect ? (
                          <CheckCircle2 className="h-5 w-5 shrink-0 text-success" />
                        ) : (
                          <XCircle className="h-5 w-5 shrink-0 text-destructive" />
                        )}
                        <div className="flex-1">
                          <p className="text-sm font-medium">Q{index + 1}: {q.question}</p>
                          {!isCorrect && (
                            <p className="mt-1 text-xs text-muted-foreground">
                              Correct: {q.options[q.correctAnswer]}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2 sm:flex-row">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => navigate('/quizzes')}
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Quizzes
                  </Button>
                  <Button
                    variant={passed ? 'default' : 'accent'}
                    className="flex-1"
                    onClick={handleRetake}
                  >
                    <RotateCcw className="mr-2 h-4 w-4" />
                    Retake Quiz
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-2xl">
          {/* Header */}
          <div className="mb-6 flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/quizzes')}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Exit Quiz
            </Button>

            {timeLeft !== null && (
              <div className={`flex items-center gap-2 rounded-full px-4 py-2 ${
                timeLeft < 60 ? 'bg-destructive/10 text-destructive' : 'bg-muted'
              }`}>
                <Clock className="h-4 w-4" />
                <span className="font-mono font-medium">{formatTime(timeLeft)}</span>
              </div>
            )}
          </div>

          {/* Progress */}
          <div className="mb-6">
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                Question {currentQuestion + 1} of {quiz.questions.length}
              </span>
              <span className="font-medium">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Question Card */}
          <Card className="card-elevated mb-6">
            <CardHeader>
              <span className="mb-2 inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                {question.category}
              </span>
              <CardTitle className="font-display text-xl leading-relaxed">
                {question.question}
              </CardTitle>
            </CardHeader>

            <CardContent>
              <RadioGroup
                value={answers[currentQuestion]?.toString() ?? ''}
                onValueChange={handleAnswerSelect}
                className="space-y-3"
              >
                {question.options.map((option, index) => (
                  <div
                    key={index}
                    className={`flex items-center space-x-3 rounded-lg border p-4 transition-colors hover:bg-muted/50 ${
                      answers[currentQuestion] === index
                        ? 'border-primary bg-primary/5'
                        : 'border-border'
                    }`}
                  >
                    <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                    <Label
                      htmlFor={`option-${index}`}
                      className="flex-1 cursor-pointer text-base"
                    >
                      {option}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Previous
            </Button>

            {currentQuestion === quiz.questions.length - 1 ? (
              <Button
                variant="accent"
                onClick={handleSubmit}
                disabled={answers.includes(null)}
              >
                Submit Quiz
                <CheckCircle2 className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button onClick={handleNext} disabled={answers[currentQuestion] === null}>
                Next
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>

          {/* Question Navigator */}
          <div className="mt-8">
            <p className="mb-3 text-sm text-muted-foreground">Quick Navigation</p>
            <div className="flex flex-wrap gap-2">
              {quiz.questions.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentQuestion(index)}
                  className={`flex h-8 w-8 items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                    currentQuestion === index
                      ? 'bg-primary text-primary-foreground'
                      : answers[index] !== null
                      ? 'bg-success/20 text-success'
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default QuizAttempt;
