import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ServiceCardProps {
  name: string;
  description?: string;
  price: string;
  duration: string;
  onClick?: () => void;
  className?: string;
}

export const ServiceCard = ({ 
  name, 
  description, 
  price, 
  duration, 
  onClick,
  className 
}: ServiceCardProps) => {
  return (
    <Card 
      className={cn(
        "p-6 hover:shadow-medium transition-smooth cursor-pointer border hover:border-accent",
        className
      )}
      onClick={onClick}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-bold text-navy font-manrope">{name}</h3>
        <span className="text-lg font-bold text-accent">{price}</span>
      </div>
      {description && (
        <p className="text-sm text-muted-foreground mb-3">{description}</p>
      )}
      <p className="text-sm text-gray-soft">{duration}</p>
    </Card>
  );
};
