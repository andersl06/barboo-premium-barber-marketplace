import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface BenefitItemProps {
  icon: LucideIcon;
  title: string;
  description: string;
  className?: string;
}

export const BenefitItem = ({ icon: Icon, title, description, className }: BenefitItemProps) => {
  return (
    <div className={cn("flex items-start gap-4", className)}>
      <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0">
        <Icon className="w-6 h-6 text-accent" />
      </div>
      <div>
        <h3 className="text-lg font-bold text-navy mb-1 font-manrope">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </div>
    </div>
  );
};
