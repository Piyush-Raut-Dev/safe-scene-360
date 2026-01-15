import { cn } from '@/lib/utils';

interface CrosshairProps {
  isHovering?: boolean;
  className?: string;
}

export const Crosshair = ({ isHovering = false, className }: CrosshairProps) => {
  return (
    <div
      className={cn(
        "fixed inset-0 flex items-center justify-center pointer-events-none z-[999]",
        className
      )}
    >
      {/*
        Two-layer crosshair (dark + light) so it stays visible on both bright and dark
        backgrounds, including during pointer lock.
      */}
      <div className={cn(
        "relative transition-transform duration-200",
        isHovering ? "scale-150" : "scale-100"
      )}>
        {/* Outer ring */}
        <div
          className={cn(
            "absolute inset-0 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full border-2 transition-all duration-200",
            isHovering
              ? "border-primary opacity-100 animate-pulse"
              : "border-foreground/70 opacity-90"
          )}
          style={{ left: '50%', top: '50%' }}
        />

        {/* Outer ring shadow (contrast on light backgrounds) */}
        <div
          className={cn(
            "absolute inset-0 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full border-2 transition-all duration-200",
            isHovering ? "border-primary/30" : "border-background/40"
          )}
          style={{ left: '50%', top: '50%' }}
        />

        {/* Inner dot */}
        <div
          className={cn(
            "absolute w-2 h-2 rounded-full -translate-x-1/2 -translate-y-1/2 transition-all duration-200",
            isHovering ? "bg-primary scale-150" : "bg-foreground"
          )}
          style={{ left: '50%', top: '50%' }}
        />

        {/* Cross lines */}
        <div className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left: '50%', top: '50%' }}>
          {/* Top */}
          <div
            className={cn(
              "absolute w-0.5 h-2 -translate-x-1/2 -bottom-5 transition-all duration-200",
              isHovering ? "bg-primary h-3" : "bg-foreground/80"
            )}
          />
          {/* Bottom */}
          <div
            className={cn(
              "absolute w-0.5 h-2 -translate-x-1/2 -top-5 transition-all duration-200",
              isHovering ? "bg-primary h-3" : "bg-foreground/80"
            )}
          />
          {/* Left */}
          <div
            className={cn(
              "absolute h-0.5 w-2 -translate-y-1/2 -left-5 transition-all duration-200",
              isHovering ? "bg-primary w-3" : "bg-foreground/80"
            )}
          />
          {/* Right */}
          <div
            className={cn(
              "absolute h-0.5 w-2 -translate-y-1/2 -right-5 transition-all duration-200",
              isHovering ? "bg-primary w-3" : "bg-foreground/80"
            )}
          />

          {/* Cross line shadow for bright scenes */}
          <div className="absolute inset-0">
            <div className={cn(
              "absolute w-0.5 h-2 -translate-x-1/2 -bottom-5",
              isHovering ? "bg-primary/30" : "bg-background/40"
            )} />
            <div className={cn(
              "absolute w-0.5 h-2 -translate-x-1/2 -top-5",
              isHovering ? "bg-primary/30" : "bg-background/40"
            )} />
            <div className={cn(
              "absolute h-0.5 w-2 -translate-y-1/2 -left-5",
              isHovering ? "bg-primary/30" : "bg-background/40"
            )} />
            <div className={cn(
              "absolute h-0.5 w-2 -translate-y-1/2 -right-5",
              isHovering ? "bg-primary/30" : "bg-background/40"
            )} />
          </div>
        </div>
      </div>
    </div>
  );
};
