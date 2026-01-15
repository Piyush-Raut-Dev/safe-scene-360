import { cn } from '@/lib/utils';

interface CrosshairProps {
  isHovering?: boolean;
  className?: string;
}

export const Crosshair = ({ isHovering = false, className }: CrosshairProps) => {
  return (
    <div
      className={cn(
        "fixed inset-0 flex items-center justify-center pointer-events-none select-none z-[9999]",
        className
      )}
    >
      {/* Simple crosshair - always visible */}
      <div className="relative">
        {/* Center dot */}
        <div
          className={cn(
            "w-2 h-2 rounded-full transition-all duration-150",
            isHovering
              ? "bg-green-400 scale-150 shadow-[0_0_8px_2px_rgba(74,222,128,0.6)]"
              : "bg-white shadow-[0_0_4px_1px_rgba(0,0,0,0.8)]"
          )}
        />
        
        {/* Cross lines */}
        {/* Top */}
        <div
          className={cn(
            "absolute left-1/2 -translate-x-1/2 w-0.5 transition-all duration-150",
            isHovering
              ? "h-4 -top-5 bg-green-400 shadow-[0_0_4px_1px_rgba(74,222,128,0.5)]"
              : "h-3 -top-4 bg-white shadow-[0_0_2px_1px_rgba(0,0,0,0.6)]"
          )}
        />
        {/* Bottom */}
        <div
          className={cn(
            "absolute left-1/2 -translate-x-1/2 w-0.5 transition-all duration-150",
            isHovering
              ? "h-4 -bottom-5 bg-green-400 shadow-[0_0_4px_1px_rgba(74,222,128,0.5)]"
              : "h-3 -bottom-4 bg-white shadow-[0_0_2px_1px_rgba(0,0,0,0.6)]"
          )}
        />
        {/* Left */}
        <div
          className={cn(
            "absolute top-1/2 -translate-y-1/2 h-0.5 transition-all duration-150",
            isHovering
              ? "w-4 -left-5 bg-green-400 shadow-[0_0_4px_1px_rgba(74,222,128,0.5)]"
              : "w-3 -left-4 bg-white shadow-[0_0_2px_1px_rgba(0,0,0,0.6)]"
          )}
        />
        {/* Right */}
        <div
          className={cn(
            "absolute top-1/2 -translate-y-1/2 h-0.5 transition-all duration-150",
            isHovering
              ? "w-4 -right-5 bg-green-400 shadow-[0_0_4px_1px_rgba(74,222,128,0.5)]"
              : "w-3 -right-4 bg-white shadow-[0_0_2px_1px_rgba(0,0,0,0.6)]"
          )}
        />
      </div>
    </div>
  );
};
