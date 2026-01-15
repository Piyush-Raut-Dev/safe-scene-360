import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Timer, 
  Target, 
  Eye, 
  Trophy, 
  Lightbulb,
  RotateCcw,
  HelpCircle
} from 'lucide-react';
import { Hazard } from '@/types';
import { cn } from '@/lib/utils';

interface GameHUDProps {
  sceneName: string;
  hazards: Hazard[];
  identifiedHazards: string[];
  timeRemaining: number;
  totalTime: number;
  showHints: boolean;
  onToggleHints: () => void;
  onReset: () => void;
  onSubmit: () => void;
  isComplete: boolean;
  score: number;
}

export const GameHUD = ({
  sceneName,
  hazards,
  identifiedHazards,
  timeRemaining,
  totalTime,
  showHints,
  onToggleHints,
  onReset,
  onSubmit,
  isComplete,
  score
}: GameHUDProps) => {
  const [showTutorial, setShowTutorial] = useState(false);
  
  const progress = (identifiedHazards.length / hazards.length) * 100;
  const timeProgress = (timeRemaining / totalTime) * 100;
  const isLowTime = timeRemaining < 60;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Combo system for consecutive finds
  const [combo, setCombo] = useState(0);
  const [lastFindTime, setLastFindTime] = useState(0);

  useEffect(() => {
    if (identifiedHazards.length > 0) {
      const now = Date.now();
      if (now - lastFindTime < 5000) {
        setCombo(prev => Math.min(prev + 1, 5));
      } else {
        setCombo(1);
      }
      setLastFindTime(now);
    }
  }, [identifiedHazards.length]);

  // Decay combo over time
  useEffect(() => {
    const timer = setInterval(() => {
      if (Date.now() - lastFindTime > 8000 && combo > 0) {
        setCombo(0);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [lastFindTime, combo]);

  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* Top bar */}
      <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/80 to-transparent">
        <div className="flex items-center justify-between gap-4">
          {/* Scene info */}
          <div className="pointer-events-auto">
            <h2 className="font-display text-lg font-bold text-white">{sceneName}</h2>
            <p className="text-sm text-white/70">Find all safety hazards</p>
          </div>

          {/* Timer */}
          <div className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-md",
            isLowTime ? "bg-destructive/80 animate-pulse" : "bg-card/60"
          )}>
            <Timer className={cn("h-5 w-5", isLowTime ? "text-destructive-foreground" : "text-accent")} />
            <span className={cn(
              "font-mono text-xl font-bold",
              isLowTime ? "text-destructive-foreground" : "text-white"
            )}>
              {formatTime(timeRemaining)}
            </span>
          </div>

          {/* Score */}
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-accent/80 backdrop-blur-md">
            <Trophy className="h-5 w-5 text-accent-foreground" />
            <span className="font-mono text-xl font-bold text-accent-foreground">{score}</span>
          </div>
        </div>
      </div>

      {/* Left sidebar - Hazard progress */}
      <div className="absolute left-4 top-1/2 -translate-y-1/2 w-48 pointer-events-auto">
        <div className="bg-card/80 backdrop-blur-md rounded-xl p-4 space-y-4">
          <div className="flex items-center gap-2">
            <Target className="h-5 w-5 text-accent" />
            <span className="font-medium text-sm">Hazards</span>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Found</span>
              <span className="font-bold">{identifiedHazards.length} / {hazards.length}</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Hazard indicators */}
          <div className="flex flex-wrap gap-1">
            {hazards.map((hazard, i) => (
              <div
                key={hazard.id}
                className={cn(
                  "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300",
                  identifiedHazards.includes(hazard.id)
                    ? "bg-success text-success-foreground scale-110"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {identifiedHazards.includes(hazard.id) ? '✓' : i + 1}
              </div>
            ))}
          </div>

          {/* Combo indicator */}
          {combo > 1 && (
            <div className="text-center animate-bounce">
              <Badge variant="secondary" className="bg-accent text-accent-foreground">
                🔥 {combo}x COMBO!
              </Badge>
            </div>
          )}
        </div>
      </div>

      {/* Right sidebar - Controls */}
      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-auto">
        <div className="flex flex-col gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="bg-card/60 backdrop-blur-md hover:bg-card/80"
            onClick={onToggleHints}
          >
            <Lightbulb className={cn("h-5 w-5", showHints ? "text-accent" : "text-muted-foreground")} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="bg-card/60 backdrop-blur-md hover:bg-card/80"
            onClick={() => setShowTutorial(!showTutorial)}
          >
            <HelpCircle className="h-5 w-5 text-muted-foreground" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="bg-card/60 backdrop-blur-md hover:bg-card/80"
            onClick={onReset}
          >
            <RotateCcw className="h-5 w-5 text-muted-foreground" />
          </Button>
        </div>
      </div>

      {/* Bottom bar - Instructions & Submit */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-card/60 backdrop-blur-md">
              <span className="text-sm text-white/80 font-mono">WASD</span>
              <span className="text-sm text-white/60">Move</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-card/60 backdrop-blur-md">
              <Eye className="h-4 w-4 text-primary" />
              <span className="text-sm text-white/80">Click to look</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-card/60 backdrop-blur-md">
              <Target className="h-4 w-4 text-accent" />
              <span className="text-sm text-white/80">Click hazards</span>
            </div>
          </div>

          <Button
            variant="accent"
            size="lg"
            className="pointer-events-auto"
            onClick={onSubmit}
            disabled={identifiedHazards.length === 0}
          >
            {isComplete ? 'View Results' : 'Submit Assessment'}
          </Button>
        </div>
      </div>

      {/* Tutorial overlay */}
      {showTutorial && (
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center pointer-events-auto">
          <div className="bg-card rounded-2xl p-8 max-w-md mx-4 text-center space-y-4">
            <h3 className="font-display text-2xl font-bold">How to Play</h3>
            <div className="space-y-3 text-left">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <Eye className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Look Around</p>
                  <p className="text-sm text-muted-foreground">Click and drag to rotate the 360° view</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
                  <Target className="h-4 w-4 text-accent" />
                </div>
                <div>
                  <p className="font-medium">Find Hazards</p>
                  <p className="text-sm text-muted-foreground">Spot glowing markers and click to identify</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-success/20 flex items-center justify-center flex-shrink-0">
                  <Trophy className="h-4 w-4 text-success" />
                </div>
                <div>
                  <p className="font-medium">Score Points</p>
                  <p className="text-sm text-muted-foreground">Find hazards quickly for combo bonuses!</p>
                </div>
              </div>
            </div>
            <Button onClick={() => setShowTutorial(false)}>Got it!</Button>
          </div>
        </div>
      )}
    </div>
  );
};
