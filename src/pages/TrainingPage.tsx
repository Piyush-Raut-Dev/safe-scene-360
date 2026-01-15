import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, Clock, AlertTriangle, ArrowRight } from 'lucide-react';
import { mockScenes } from '@/data/mockData';

const TrainingPage = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-success/10 text-success';
      case 'intermediate':
        return 'bg-warning/10 text-warning';
      case 'advanced':
        return 'bg-destructive/10 text-destructive';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold text-foreground">
            360° Safety Training
          </h1>
          <p className="mt-1 text-muted-foreground">
            Explore immersive warehouse environments and identify safety hazards
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {mockScenes.map((scene) => (
            <Card key={scene.id} className="card-elevated overflow-hidden">
              {/* Scene Preview */}
              <div className="relative h-48 bg-gradient-to-br from-primary/20 to-accent/20">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="rounded-full bg-card/80 p-4 backdrop-blur-sm">
                    <Eye className="h-8 w-8 text-primary" />
                  </div>
                </div>
                <div className="absolute bottom-2 left-2">
                  <Badge className={getDifficultyColor(scene.difficulty)}>
                    {scene.difficulty}
                  </Badge>
                </div>
              </div>

              <CardHeader>
                <CardTitle className="font-display">{scene.name}</CardTitle>
                <CardDescription>{scene.description}</CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <AlertTriangle className="h-4 w-4" />
                    <span>{scene.hazards.length} hazards to find</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>{scene.duration} min</span>
                  </div>
                </div>

                <Button
                  className="w-full"
                  onClick={() => navigate(`/training/${scene.id}`)}
                >
                  Start Training
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </MainLayout>
  );
};

export default TrainingPage;
