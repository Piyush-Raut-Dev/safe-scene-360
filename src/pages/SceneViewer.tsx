import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  AlertTriangle, 
  ArrowLeft,
  Play,
  Info,
  Gamepad2,
  Clock,
  Target
} from 'lucide-react';
import { mockScenes } from '@/data/mockData';
import { toast } from 'sonner';
import { WarehouseScene3D } from '@/components/scene/WarehouseScene3D';
import { GameHUD } from '@/components/scene/GameHUD';
import { GameResults } from '@/components/scene/GameResults';
import { Crosshair } from '@/components/scene/Crosshair';

const SceneViewer = () => {
  const { sceneId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [identifiedHazards, setIdentifiedHazards] = useState<string[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [showHints, setShowHints] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [score, setScore] = useState(0);

  const scene = mockScenes.find(s => s.id === sceneId);
  const totalTime = scene ? scene.duration * 60 : 600;

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  // Timer countdown
  useEffect(() => {
    if (!gameStarted || showResults || timeRemaining <= 0) return;
    
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setShowResults(true);
          toast.error("Time's up!", {
            description: 'Review your results and try again to improve.',
          });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameStarted, showResults, timeRemaining]);

  const handleStartGame = () => {
    setGameStarted(true);
    setTimeRemaining(totalTime);
    setIdentifiedHazards([]);
    setScore(0);
    setShowResults(false);
    setIsComplete(false);
  };

  const handleHazardClick = useCallback((hazardId: string) => {
    if (isComplete || showResults) return;

    if (!identifiedHazards.includes(hazardId)) {
      const hazard = scene?.hazards.find(h => h.id === hazardId);
      const newIdentified = [...identifiedHazards, hazardId];
      setIdentifiedHazards(newIdentified);
      
      // Score based on severity
      const severityPoints: Record<string, number> = {
        critical: 100,
        high: 75,
        medium: 50,
        low: 25
      };
      const points = severityPoints[hazard?.severity || 'low'] || 25;
      setScore(prev => prev + points);

      toast.success(`+${points} Points!`, {
        description: `${hazard?.description || 'Hazard'} identified.`,
      });

      if (scene && newIdentified.length === scene.hazards.length) {
        setIsComplete(true);
        toast.success('🎉 All hazards found!', {
          description: 'Great job! Click Submit to see your results.',
        });
      }
    }
  }, [identifiedHazards, scene, isComplete, showResults]);

  const handleSubmit = () => {
    setShowResults(true);
  };

  const handleReset = () => {
    handleStartGame();
  };

  const handleContinue = () => {
    navigate('/training');
  };

  const getSceneType = (): 'storage' | 'loading' | 'chemical' => {
    if (!sceneId) return 'storage';
    if (sceneId.includes('2')) return 'loading';
    if (sceneId.includes('3')) return 'chemical';
    return 'storage';
  };

  if (!scene) {
    return (
      <MainLayout>
        <div className="container mx-auto flex min-h-[60vh] items-center justify-center px-4">
          <Card className="w-full max-w-md text-center">
            <CardContent className="py-12">
              <AlertTriangle className="mx-auto mb-4 h-12 w-12 text-destructive" />
              <h2 className="mb-2 text-xl font-semibold">Scene Not Found</h2>
              <p className="mb-4 text-muted-foreground">
                The training scene you're looking for doesn't exist.
              </p>
              <Button onClick={() => navigate('/training')}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Training
              </Button>
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    );
  }

  // Pre-game screen
  if (!gameStarted) {
    return (
      <MainLayout>
        <div className="container mx-auto flex min-h-[70vh] items-center justify-center px-4">
          <Card className="w-full max-w-2xl overflow-hidden">
            <div className="relative h-48 bg-gradient-to-br from-primary to-accent">
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRoLTJ2LTRoMnY0em0wLThoLTJ2LTRoMnY0em0wLThoLTJWNmgydjEyem0tOCAyMmgtMnYtNGgydjR6bTAtOGgtMnYtNGgydjR6bTAtOGgtMnYtNGgydjR6bTAtOGgtMlY2aDJ2MTJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-30" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white">
                  <h1 className="font-display text-3xl font-bold mb-2">{scene.name}</h1>
                  <p className="opacity-80">{scene.description}</p>
                </div>
              </div>
            </div>
            <CardContent className="p-8">
              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="text-center p-4 rounded-lg bg-muted/50">
                  <p className="text-2xl font-bold text-primary">{scene.hazards.length}</p>
                  <p className="text-sm text-muted-foreground">Hazards to Find</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-muted/50">
                  <p className="text-2xl font-bold text-accent">{scene.duration} min</p>
                  <p className="text-sm text-muted-foreground">Time Limit</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-muted/50">
                  <p className="text-2xl font-bold capitalize text-success">{scene.difficulty}</p>
                  <p className="text-sm text-muted-foreground">Difficulty</p>
                </div>
              </div>

              <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 mb-8">
                <div className="flex items-start gap-3">
                  <Info className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium text-sm">How to Play</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Explore the 360° warehouse environment by clicking and dragging. 
                      Identify safety hazards by clicking on glowing markers. 
                      Find all hazards before time runs out to achieve the highest score!
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <Button variant="outline" className="flex-1" onClick={() => navigate('/training')}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
                <Button variant="accent" className="flex-1" size="lg" onClick={handleStartGame}>
                  <Play className="mr-2 h-5 w-5" />
                  Start Training
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    );
  }

  // Game screen
  return (
    <div className="fixed inset-0 bg-background">
      {/* Fixed Crosshair - Always visible during gameplay */}
      {!showResults && <Crosshair />}
      
      {/* Back button - outside game area */}
      <div className="absolute top-4 left-4 z-50">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/training')}
          className="bg-card/60 backdrop-blur-md hover:bg-card/80"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Exit
        </Button>
      </div>

      {/* 3D Scene */}
      <div className="absolute inset-0">
        <WarehouseScene3D
          hazards={scene.hazards}
          identifiedHazards={identifiedHazards}
          onIdentifyHazard={handleHazardClick}
          showHints={showHints}
          sceneType={getSceneType()}
        />
      </div>

      {/* Game HUD overlay */}
      {!showResults && (
        <GameHUD
          sceneName={scene.name}
          hazards={scene.hazards}
          identifiedHazards={identifiedHazards}
          timeRemaining={timeRemaining}
          totalTime={totalTime}
          showHints={showHints}
          onToggleHints={() => setShowHints(!showHints)}
          onReset={handleReset}
          onSubmit={handleSubmit}
          isComplete={isComplete}
          score={score}
        />
      )}

      {/* Results overlay */}
      {showResults && (
        <GameResults
          hazards={scene.hazards}
          identifiedHazards={identifiedHazards}
          timeRemaining={timeRemaining}
          totalTime={totalTime}
          score={score}
          onReset={handleReset}
          onContinue={handleContinue}
        />
      )}
    </div>
  );
};

export default SceneViewer;
