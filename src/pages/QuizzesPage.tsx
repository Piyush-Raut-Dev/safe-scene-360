import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ClipboardCheck, Clock, ArrowRight, Award } from 'lucide-react';
import { mockQuizzes, mockQuizAttempts } from '@/data/mockData';

const QuizzesPage = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const getUserBestScore = (quizId: string) => {
    if (!user) return null;
    const attempts = mockQuizAttempts.filter(
      a => a.quizId === quizId && a.userId === user.id
    );
    if (attempts.length === 0) return null;
    return Math.max(...attempts.map(a => a.percentage));
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold text-foreground">
            Safety Quizzes
          </h1>
          <p className="mt-1 text-muted-foreground">
            Test your knowledge with comprehensive safety assessments
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {mockQuizzes.map((quiz) => {
            const bestScore = getUserBestScore(quiz.id);
            const hasPassed = bestScore !== null && bestScore >= quiz.passingScore;

            return (
              <Card key={quiz.id} className="card-elevated">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                        <ClipboardCheck className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="font-display">{quiz.title}</CardTitle>
                        <CardDescription className="mt-1">
                          {quiz.description}
                        </CardDescription>
                      </div>
                    </div>
                    {hasPassed && (
                      <Badge className="bg-success/10 text-success">
                        <Award className="mr-1 h-3 w-3" />
                        Passed
                      </Badge>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-4">
                      <span className="text-muted-foreground">
                        {quiz.questions.length} questions
                      </span>
                      {quiz.timeLimit && (
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          <span>{quiz.timeLimit} min</span>
                        </div>
                      )}
                    </div>
                    <span className="text-muted-foreground">
                      Pass: {quiz.passingScore}%
                    </span>
                  </div>

                  {bestScore !== null && (
                    <div className="rounded-lg bg-muted/50 p-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Your best score</span>
                        <span className={`font-semibold ${hasPassed ? 'text-success' : 'text-destructive'}`}>
                          {bestScore}%
                        </span>
                      </div>
                    </div>
                  )}

                  <Button
                    className="w-full"
                    onClick={() => navigate(`/quizzes/${quiz.id}`)}
                  >
                    {bestScore !== null ? 'Retake Quiz' : 'Start Quiz'}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </MainLayout>
  );
};

export default QuizzesPage;
