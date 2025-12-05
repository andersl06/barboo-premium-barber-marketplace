import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface CardOptionProps {
  icon: LucideIcon;
  title: string;
  description: string;
  accentColor?: "accent" | "navy";
  onClick?: () => void;
  className?: string;
}

export const CardOption = ({ 
  icon: Icon, 
  title, 
  description, 
  accentColor = "accent",
  onClick,
  className 
}: CardOptionProps) => {
  const colorClasses = accentColor === "accent" 
    ? "bg-accent/10 group-hover:bg-accent/20 text-accent border-accent"
    : "bg-navy/10 group-hover:bg-navy/20 text-navy border-navy";

  return (
    <Card 
      className={cn(
        "p-8 hover:shadow-strong transition-smooth cursor-pointer border-2 hover:border-current group",
        className
      )}
      onClick={onClick}
    >
      <div className="text-center">
        <div className={cn(
          "w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 transition-colors",
          colorClasses
        )}>
          <Icon className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-bold text-navy mb-3 font-manrope">
          {title}
        </h2>
        <p className="text-muted-foreground">
          {description}
        </p>
      </div>
    </Card>
  );
};
