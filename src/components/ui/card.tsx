import { cn } from "@/lib/utils";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

export function Card({ children, className, hover, onClick }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "rounded-xl border border-zinc-800/60 bg-zinc-900/60 backdrop-blur-sm p-5",
        hover && "transition-all duration-200 hover:border-zinc-700/60 hover:bg-zinc-900/80 cursor-pointer",
        onClick && "cursor-pointer",
        className
      )}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("flex items-center justify-between mb-4", className)}>{children}</div>;
}

export function CardTitle({ children, className }: { children: React.ReactNode; className?: string }) {
  return <h3 className={cn("text-xs font-semibold text-zinc-500 uppercase tracking-wider", className)}>{children}</h3>;
}

export function CardValue({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("text-2xl font-bold text-white", className)}>{children}</div>;
}

export function CardLabel({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("text-xs text-zinc-600", className)}>{children}</div>;
}
