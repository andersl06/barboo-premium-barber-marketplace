import { cn } from "@/lib/utils";

interface SubtitleProps {
  children: React.ReactNode;
  className?: string;
}

export const Subtitle = ({ children, className }: SubtitleProps) => {
  return (
    <p className={cn(
      "text-base md:text-lg text-muted-foreground",
      className
    )}>
      {children}
    </p>
  );
};
