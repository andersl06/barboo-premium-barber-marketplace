import { CheckCircle2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/utils";

interface SuccessMessageProps {
  message: string;
  className?: string;
}

export const SuccessMessage = ({ message, className }: SuccessMessageProps) => {
  if (!message) return null;
  
  return (
    <Alert className={cn("border-accent bg-accent/10", className)}>
      <CheckCircle2 className="h-4 w-4 text-accent" />
      <AlertDescription className="text-accent">{message}</AlertDescription>
    </Alert>
  );
};
