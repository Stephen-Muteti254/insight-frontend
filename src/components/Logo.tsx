import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  iconOnly?: boolean;
}

export function Logo({ className, iconOnly = false }: LogoProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      {/* Icon */}
      <div className="relative">
        <svg
          width="32"
          height="32"
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-full w-auto"
        >
          {/* Background Circle */}
          <circle cx="16" cy="16" r="16" className="fill-primary" />
          {/* Inner Design - Abstract "I" shape with chart elements */}
          <path
            d="M10 22V14L16 10L22 14V22"
            className="stroke-primary-foreground"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          <circle cx="16" cy="14" r="2" className="fill-primary-foreground" />
          <path
            d="M13 18H19"
            className="stroke-primary-foreground"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
        {/* Glow Effect */}
        <div className="absolute inset-0 bg-primary/20 blur-lg rounded-full -z-10" />
      </div>
      
      {/* Text */}
      {!iconOnly && (
        <span className="text-xl font-bold tracking-tight">
          <span className="text-foreground">Insight</span>
          <span className="text-primary">Pay</span>
        </span>
      )}
    </div>
  );
}
