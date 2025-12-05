import { Button, ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const SecondaryButton = ({ className, children, ...props }: ButtonProps) => {
  return (
    <Button
      variant="outline"
      className={cn(
        "bg-background border-2 border-navy text-navy hover:bg-navy hover:text-primary-foreground font-semibold shadow-soft transition-smooth",
        className
      )}
      {...props}
    >
      {children}
    </Button>
  );
};
