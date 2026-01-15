import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { 
  Trophy, 
  Star, 
  CheckCircle2, 
  XCircle,
  ArrowRight,
  RotateCcw,
  Share2,
  Clock,
  Target,
  Zap
} from 'lucide-react';
import { Hazard } from '@/types';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface GameResultsProps {
  hazards: Hazard[];
  identifiedHazards: string[];
  timeRemaining: number;
  totalTime: number;
  score: number;
  onReset: () => void;
  onContinue: () => void;
}

export const GameResults = ({
  hazards,
  identifiedHazards,
  timeRemaining,
  totalTime,
  score,
  onReset,
  onContinue
}: GameResultsProps) => {
  const accuracy = Math.round((identifiedHazards.length / hazards.length) * 100);
  const timeBonus = Math.round((timeRemaining / totalTime) * 100);
  const totalScore = score + Math.round(timeBonus * 2);
  
  const getGrade = () => {
    if (accuracy >= 100 && timeBonus >= 50) return { grade: 'S', color: 'text-yellow-400', bg: 'bg-yellow-400/20' };
    if (accuracy >= 90) return { grade: 'A', color: 'text-green-400', bg: 'bg-green-400/20' };
    if (accuracy >= 75) return { grade: 'B', color: 'text-blue-400', bg: 'bg-blue-400/20' };
    if (accuracy >= 60) return { grade: 'C', color: 'text-orange-400', bg: 'bg-orange-400/20' };
    return { grade: 'D', color: 'text-red-400', bg: 'bg-red-400/20' };
  };

  const gradeInfo = getGrade();
  const stars = accuracy >= 100 ? 3 : accuracy >= 75 ? 2 : accuracy >= 50 ? 1 : 0;

  const getSeverityColor = (severity: Hazard['severity']) => {
    switch (severity) {
      case 'critical': return 'text-destructive';
      case 'high': return 'text-accent';
      case 'medium': return 'text-warning';
      case 'low': return 'text-success';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="absolute inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 z-50"
    >
      <div className="w-full max-w-2xl space-y-6">
        {/* Header with grade */}
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center"
        >
          <div className={cn(
            "inline-flex items-center justify-center w-24 h-24 rounded-full mb-4",
            gradeInfo.bg
          )}>
            <span className={cn("font-display text-5xl font-black", gradeInfo.color)}>
              {gradeInfo.grade}
            </span>
          </div>
          <h2 className="font-display text-3xl font-bold text-white">Assessment Complete!</h2>
          
          {/* Stars */}
          <div className="flex justify-center gap-1 mt-2">
            {[1, 2, 3].map((i) => (
              <motion.div
                key={i}
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.4 + i * 0.1, type: 'spring' }}
              >
                <Star 
                  className={cn(
                    "h-8 w-8",
                    i <= stars ? "text-yellow-400 fill-yellow-400" : "text-muted-foreground"
                  )} 
                />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Stats grid */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-3 gap-4"
        >
          <Card className="bg-card/60 border-none">
            <CardContent className="p-4 text-center">
              <Target className="h-6 w-6 text-accent mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Accuracy</p>
              <p className="font-display text-2xl font-bold">{accuracy}%</p>
            </CardContent>
          </Card>
          <Card className="bg-card/60 border-none">
            <CardContent className="p-4 text-center">
              <Clock className="h-6 w-6 text-primary mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Time Bonus</p>
              <p className="font-display text-2xl font-bold">+{timeBonus}</p>
            </CardContent>
          </Card>
          <Card className="bg-card/60 border-none">
            <CardContent className="p-4 text-center">
              <Zap className="h-6 w-6 text-yellow-500 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Total Score</p>
              <p className="font-display text-2xl font-bold">{totalScore}</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Hazard breakdown */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="bg-card/60 border-none">
            <CardContent className="p-4">
              <h3 className="font-medium mb-3 flex items-center gap-2">
                <Trophy className="h-5 w-5 text-accent" />
                Hazard Breakdown
              </h3>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {hazards.map((hazard, index) => {
                  const found = identifiedHazards.includes(hazard.id);
                  return (
                    <motion.div
                      key={hazard.id}
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.7 + index * 0.05 }}
                      className={cn(
                        "flex items-center gap-3 p-2 rounded-lg",
                        found ? "bg-success/10" : "bg-destructive/10"
                      )}
                    >
                      {found ? (
                        <CheckCircle2 className="h-5 w-5 text-success flex-shrink-0" />
                      ) : (
                        <XCircle className="h-5 w-5 text-destructive flex-shrink-0" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{hazard.description}</p>
                        <p className="text-xs text-muted-foreground capitalize">{hazard.type}</p>
                      </div>
                      <Badge 
                        variant="outline" 
                        className={cn("capitalize flex-shrink-0", getSeverityColor(hazard.severity))}
                      >
                        {hazard.severity}
                      </Badge>
                    </motion.div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Actions */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="flex gap-3 justify-center"
        >
          <Button variant="outline" size="lg" onClick={onReset}>
            <RotateCcw className="mr-2 h-4 w-4" />
            Try Again
          </Button>
          <Button variant="accent" size="lg" onClick={onContinue}>
            Continue
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
};
