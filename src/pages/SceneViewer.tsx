import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  AlertTriangle, 
  CheckCircle2, 
  Eye,
  RotateCcw,
  ArrowLeft,
  Info
} from 'lucide-react';
import { mockScenes } from '@/data/mockData';
import { Hazard } from '@/types';
import { toast } from 'sonner';

const SceneViewer = () => {
  const { sceneId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [identifiedHazards, setIdentifiedHazards] = useState<string[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const scene = mockScenes.find(s => s.id === sceneId);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

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

  const handleHazardClick = (hazardId: string) => {
    if (isComplete) return;

    if (!identifiedHazards.includes(hazardId)) {
      const newIdentified = [...identifiedHazards, hazardId];
      setIdentifiedHazards(newIdentified);
      toast.success('Hazard identified!', {
        description: 'Great work spotting that safety issue.',
      });

      if (newIdentified.length === scene.hazards.length) {
        setIsComplete(true);
        toast.success('All hazards found!', {
          description: 'You\'ve identified all safety hazards in this scene.',
        });
      }
    }
  };

  const handleSubmit = () => {
    setShowResults(true);
  };

  const handleReset = () => {
    setIdentifiedHazards([]);
    setShowResults(false);
    setIsComplete(false);
  };

  const accuracy = Math.round((identifiedHazards.length / scene.hazards.length) * 100);

  const getSeverityColor = (severity: Hazard['severity']) => {
    switch (severity) {
      case 'critical':
        return 'bg-destructive';
      case 'high':
        return 'bg-accent';
      case 'medium':
        return 'bg-warning';
      case 'low':
        return 'bg-success';
      default:
        return 'bg-muted';
    }
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/training')}
              className="mb-2"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Training
            </Button>
            <h1 className="font-display text-2xl font-bold text-foreground">
              {scene.name}
            </h1>
            <p className="text-muted-foreground">{scene.description}</p>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Progress</p>
              <p className="font-display text-xl font-bold">
                {identifiedHazards.length} / {scene.hazards.length}
              </p>
            </div>
            <div className="h-16 w-16">
              <svg className="h-16 w-16 -rotate-90 transform">
                <circle
                  cx="32"
                  cy="32"
                  r="28"
                  stroke="currentColor"
                  strokeWidth="6"
                  fill="transparent"
                  className="text-muted"
                />
                <circle
                  cx="32"
                  cy="32"
                  r="28"
                  stroke="currentColor"
                  strokeWidth="6"
                  fill="transparent"
                  strokeDasharray={`${2 * Math.PI * 28}`}
                  strokeDashoffset={`${2 * Math.PI * 28 * (1 - accuracy / 100)}`}
                  className="text-accent transition-all duration-500"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-4">
          {/* Scene Viewer */}
          <div className="lg:col-span-3">
            <Card className="overflow-hidden">
              <div className="relative aspect-video bg-gradient-to-br from-slate-800 to-slate-900">
                {/* Simulated 360 scene - in production, this would use a 360 viewer library */}
                <div 
                  className="absolute inset-0 opacity-30"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cg fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.2'%3E%3Cpath opacity='.5' d='M96 95h4v1h-4v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9zm-1 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                  }}
                />

                {/* Warehouse illustration overlay */}
                <div className="absolute inset-0 flex items-end justify-center p-8">
                  <div className="flex w-full max-w-4xl items-end justify-between gap-4">
                    {/* Shelving units */}
                    <div className="h-32 w-24 rounded bg-slate-600/50" />
                    <div className="h-40 w-24 rounded bg-slate-600/50" />
                    <div className="h-36 w-24 rounded bg-slate-600/50" />
                    <div className="h-44 w-24 rounded bg-slate-600/50" />
                    <div className="h-32 w-24 rounded bg-slate-600/50" />
                  </div>
                </div>

                {/* Hazard hotspots */}
                {scene.hazards.map((hazard) => (
                  <button
                    key={hazard.id}
                    onClick={() => handleHazardClick(hazard.id)}
                    className={`scene-hotspot ${identifiedHazards.includes(hazard.id) ? 'identified' : ''}`}
                    style={{
                      left: `${hazard.x}%`,
                      top: `${hazard.y}%`,
                      transform: 'translate(-50%, -50%)',
                    }}
                    title={identifiedHazards.includes(hazard.id) ? hazard.description : 'Click to identify'}
                  >
                    {identifiedHazards.includes(hazard.id) ? (
                      <CheckCircle2 className="h-5 w-5 text-success-foreground" />
                    ) : (
                      <AlertTriangle className="h-5 w-5 text-accent-foreground" />
                    )}
                  </button>
                ))}

                {/* 360 indicator */}
                <div className="absolute bottom-4 left-4 flex items-center gap-2 rounded-full bg-card/80 px-3 py-1.5 backdrop-blur-sm">
                  <Eye className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">360° View</span>
                </div>

                {/* Instructions */}
                <div className="absolute right-4 top-4 flex items-center gap-2 rounded-lg bg-card/90 px-3 py-2 backdrop-blur-sm">
                  <Info className="h-4 w-4 text-primary" />
                  <span className="text-sm">Click on hazards to identify them</span>
                </div>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Hazard List */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg font-display">
                  <AlertTriangle className="h-5 w-5 text-accent" />
                  Hazards Found
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {scene.hazards.map((hazard) => {
                  const isFound = identifiedHazards.includes(hazard.id);
                  return (
                    <div
                      key={hazard.id}
                      className={`flex items-center gap-3 rounded-lg p-2 transition-colors ${
                        isFound ? 'bg-success/10' : 'bg-muted/50'
                      }`}
                    >
                      {isFound ? (
                        <CheckCircle2 className="h-4 w-4 text-success" />
                      ) : (
                        <div className="h-4 w-4 rounded-full border-2 border-muted-foreground/30" />
                      )}
                      <div className="flex-1">
                        {isFound ? (
                          <p className="text-sm font-medium">{hazard.description}</p>
                        ) : (
                          <p className="text-sm text-muted-foreground">Hidden hazard</p>
                        )}
                      </div>
                      {isFound && (
                        <Badge className={getSeverityColor(hazard.severity)} variant="secondary">
                          {hazard.severity}
                        </Badge>
                      )}
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex flex-col gap-2">
              {!showResults ? (
                <Button
                  variant="accent"
                  className="w-full"
                  onClick={handleSubmit}
                  disabled={identifiedHazards.length === 0}
                >
                  Submit Assessment
                </Button>
              ) : (
                <Card className="bg-success/10 border-success/20">
                  <CardContent className="py-4 text-center">
                    <p className="text-sm text-muted-foreground">Your Accuracy</p>
                    <p className="font-display text-3xl font-bold text-success">{accuracy}%</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {identifiedHazards.length} of {scene.hazards.length} hazards
                    </p>
                  </CardContent>
                </Card>
              )}

              <Button
                variant="outline"
                className="w-full"
                onClick={handleReset}
              >
                <RotateCcw className="mr-2 h-4 w-4" />
                Reset Scene
              </Button>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default SceneViewer;
