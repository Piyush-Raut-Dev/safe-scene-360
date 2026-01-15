import { cn } from '@/lib/utils';

interface CrosshairProps {
  isHovering?: boolean;
  className?: string;
}

export const Crosshair = ({ isHovering = false, className }: CrosshairProps) => {
  return (
    <div className={cn(
      "fixed inset-0 flex items-center justify-center pointer-events-none z-50",
      className
    )}>
      <div className={cn(
        "relative transition-all duration-200",
        isHovering ? "scale-150" : "scale-100"
      )}>
        {/* Outer ring */}
        <div className={cn(
          "absolute inset-0 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full border-2 transition-all duration-200",
          isHovering 
            ? "border-safety-orange opacity-100 animate-pulse" 
            : "border-white/50 opacity-70"
        )} 
        style={{ left: '50%', top: '50%' }}
        />
        
        {/* Inner dot */}
        <div className={cn(
          "absolute w-2 h-2 rounded-full -translate-x-1/2 -translate-y-1/2 transition-all duration-200",
          isHovering ? "bg-safety-orange scale-150" : "bg-white"
        )}
        style={{ left: '50%', top: '50%' }}
        />
        
        {/* Cross lines */}
        <div className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left: '50%', top: '50%' }}>
          {/* Top */}
          <div className={cn(
            "absolute w-0.5 h-2 -translate-x-1/2 -bottom-5 transition-all duration-200",
            isHovering ? "bg-safety-orange h-3" : "bg-white/70"
          )} />
          {/* Bottom */}
          <div className={cn(
            "absolute w-0.5 h-2 -translate-x-1/2 -top-5 transition-all duration-200",
            isHovering ? "bg-safety-orange h-3" : "bg-white/70"
          )} />
          {/* Left */}
          <div className={cn(
            "absolute h-0.5 w-2 -translate-y-1/2 -left-5 transition-all duration-200",
            isHovering ? "bg-safety-orange w-3" : "bg-white/70"
          )} />
          {/* Right */}
          <div className={cn(
            "absolute h-0.5 w-2 -translate-y-1/2 -right-5 transition-all duration-200",
            isHovering ? "bg-safety-orange w-3" : "bg-white/70"
          )} />
        </div>
      </div>
    </div>
  );
};
