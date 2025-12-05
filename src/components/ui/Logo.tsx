import { Link } from "react-router-dom";
import barbooLogoHorizontal from "@/assets/logos/barboo-logo-horizontal.png";
import barbooLogoVertical from "@/assets/logos/barboo-logo-vertical.png";
import { cn } from "@/lib/utils";

interface LogoProps {
  variant?: "horizontal" | "vertical";
  size?: "sm" | "md" | "lg";
  className?: string;
  linkTo?: string | null;
}

const sizeClasses = {
  sm: "h-16", // Aumentado um pouco para 'sm' também, caso seja usado.
  md: "h-24", // Antes era h-12, agora um aumento considerável. Será o padrão para vertical em autenticação.
  lg: "h-24", // Antes era h-16, agora para a logo horizontal na landing page.
};

export const Logo = ({ variant = "horizontal", size = "md", className, linkTo = "/" }: LogoProps) => {
  const logo = variant === "horizontal" ? barbooLogoHorizontal : barbooLogoVertical;
  const imgElement = (
    <img 
      src={logo} 
      alt="Barboo" 
      className={cn(sizeClasses[size], "object-contain", className)} 
    />
  );

  if (linkTo !== null) {
    return (
      <Link to={linkTo} className="inline-block transition-opacity hover:opacity-80">
        {imgElement}
      </Link>
    );
  }

  return imgElement;
};