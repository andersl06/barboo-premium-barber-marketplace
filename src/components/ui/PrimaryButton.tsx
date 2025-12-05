import { Button, ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const PrimaryButton = ({ className, children, ...props }: ButtonProps) => {
  return (
    <Button
      className={cn(
        "bg-accent hover:bg-accent/90 text-accent-foreground font-semibold shadow-soft hover:shadow-medium transition-smooth",
        className
      )}
      {...props}
    >
      {children}
    </Button>
  );
};
