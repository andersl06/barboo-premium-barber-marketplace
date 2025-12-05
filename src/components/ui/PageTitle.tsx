import { cn } from "@/lib/utils";

interface PageTitleProps {
  children: React.ReactNode;
  className?: string;
}

export const PageTitle = ({ children, className }: PageTitleProps) => {
  return (
    <h1 className={cn(
      "text-3xl md:text-4xl font-bold text-navy font-manrope",
      className
    )}>
      {children}
    </h1>
  );
};
