import { Card } from "@/components/ui/card";
import { Star, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

interface BarbershopCardProps {
  name: string;
  address: string;
  rating: number;
  reviewCount: number;
  imageUrl?: string;
  distance?: string;
  onClick?: () => void;
  className?: string;
}

export const BarbershopCard = ({ 
  name, 
  address, 
  rating, 
  reviewCount,
  imageUrl,
  distance,
  onClick,
  className 
}: BarbershopCardProps) => {
  return (
    <Card 
      className={cn(
        "overflow-hidden hover:shadow-medium transition-smooth cursor-pointer border hover:border-accent",
        className
      )}
      onClick={onClick}
    >
      {imageUrl && (
        <div className="aspect-video bg-secondary">
          <img src={imageUrl} alt={name} className="w-full h-full object-cover" />
        </div>
      )}
      <div className="p-5">
        <h3 className="text-xl font-bold text-navy mb-2 font-manrope">{name}</h3>
        <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
          <MapPin className="w-4 h-4" />
          <span>{address}</span>
          {distance && <span className="ml-2 text-accent">• {distance}</span>}
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-accent text-accent" />
            <span className="font-semibold text-navy">{rating}</span>
          </div>
          <span className="text-sm text-gray-soft">({reviewCount} avaliações)</span>
        </div>
      </div>
    </Card>
  );
};
