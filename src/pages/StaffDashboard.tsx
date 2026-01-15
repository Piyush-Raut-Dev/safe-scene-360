import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Eye, 
  ClipboardCheck, 
  TrendingUp, 
  Award,
  ArrowRight,
  Clock,
  Target
} from 'lucide-react';
import { mockQuizAttempts, mockHazardAttempts, mockScenes, mockQuizzes } from '@/data/mockData';

const StaffDashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  if (!user) return null;

  // Calculate user stats from mock data
  const userQuizAttempts = mockQuizAttempts.filter(a => a.userId === user.id);
  const userHazardAttempts = mockHazardAttempts.filter(a => a.userId === user.id);
  
  const avgQuizScore = userQuizAttempts.length > 0
    ? Math.round(userQuizAttempts.reduce((sum, a) => sum + a.percentage, 0) / userQuizAttempts.length)
    : 0;
  
  const avgHazardAccuracy = userHazardAttempts.length > 0
    ? Math.round(userHazardAttempts.reduce((sum, a) => sum + a.accuracyScore, 0) / userHazardAttempts.length)
    : 0;

  const completedScenes = userHazardAttempts.length;
  const completedQuizzes = userQuizAttempts.length;

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold text-foreground">
            Welcome back, {user.name.split(' ')[0]}!
          </h1>
          <p className="mt-1 text-muted-foreground">
            Continue your safety training and track your progress.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="card-elevated">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                <Target className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Quiz Score</p>
                <p className="font-display text-2xl font-bold text-foreground">{avgQuizScore}%</p>
              </div>
            </CardContent>
          </Card>

          <Card className="card-elevated">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10">
                <Eye className="h-6 w-6 text-accent" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Hazard Accuracy</p>
                <p className="font-display text-2xl font-bold text-foreground">{avgHazardAccuracy}%</p>
              </div>
            </CardContent>
          </Card>

          <Card className="card-elevated">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-success/10">
                <ClipboardCheck className="h-6 w-6 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Completed Quizzes</p>
                <p className="font-display text-2xl font-bold text-foreground">{completedQuizzes}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="card-elevated">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-warning/10">
                <Award className="h-6 w-6 text-warning" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Scenes Completed</p>
                <p className="font-display text-2xl font-bold text-foreground">{completedScenes}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Continue Training */}
          <Card className="card-elevated">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-display">
                <Eye className="h-5 w-5 text-accent" />
                360° Safety Scenes
              </CardTitle>
              <CardDescription>
                Explore immersive warehouse environments and identify hazards
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {mockScenes.slice(0, 2).map((scene) => (
                <div
                  key={scene.id}
                  className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-muted/50"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                      <Eye className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{scene.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {scene.hazards.length} hazards • {scene.duration} min
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate(`/training/${scene.id}`)}
                  >
                    Start
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button
                variant="outline"
                className="w-full"
                onClick={() => navigate('/training')}
              >
                View All Scenes
              </Button>
            </CardContent>
          </Card>

          {/* Quizzes */}
          <Card className="card-elevated">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-display">
                <ClipboardCheck className="h-5 w-5 text-success" />
                Safety Quizzes
              </CardTitle>
              <CardDescription>
                Test your knowledge with comprehensive safety assessments
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {mockQuizzes.slice(0, 2).map((quiz) => (
                <div
                  key={quiz.id}
                  className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-muted/50"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                      <ClipboardCheck className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{quiz.title}</p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>{quiz.questions.length} questions</span>
                        {quiz.timeLimit && (
                          <>
                            <span>•</span>
                            <Clock className="h-3 w-3" />
                            <span>{quiz.timeLimit} min</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate(`/quizzes/${quiz.id}`)}
                  >
                    Take Quiz
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button
                variant="outline"
                className="w-full"
                onClick={() => navigate('/quizzes')}
              >
                View All Quizzes
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="card-elevated mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-display">
              <TrendingUp className="h-5 w-5 text-primary" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            {userQuizAttempts.length === 0 && userHazardAttempts.length === 0 ? (
              <div className="py-8 text-center text-muted-foreground">
                <p>No activity yet. Start a training session or take a quiz!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {userQuizAttempts.slice(0, 3).map((attempt) => {
                  const quiz = mockQuizzes.find(q => q.id === attempt.quizId);
                  return (
                    <div
                      key={attempt.id}
                      className="flex items-center justify-between rounded-lg bg-muted/50 p-3"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`h-2 w-2 rounded-full ${attempt.passed ? 'bg-success' : 'bg-destructive'}`} />
                        <div>
                          <p className="text-sm font-medium">{quiz?.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {attempt.timestamp.toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <span className={`font-semibold ${attempt.passed ? 'text-success' : 'text-destructive'}`}>
                        {attempt.percentage}%
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default StaffDashboard;
