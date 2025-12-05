import { Link } from "react-router-dom";
import { User, Store, ArrowLeft } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { PageTitle } from "@/components/ui/PageTitle";
import { Subtitle } from "@/components/ui/Subtitle";
import { CardOption } from "@/components/cards/CardOption";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { SecondaryButton } from "@/components/ui/SecondaryButton";

const RegisterType = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-secondary/30 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <Link to="/" className="inline-flex items-center gap-2 text-navy mb-8 hover:opacity-80 transition-smooth">
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Voltar</span>
        </Link>

        <div className="text-center mb-12">
          <Logo variant="vertical" size="lg" className="mx-auto mb-6" linkTo={null} />
          <PageTitle className="mb-3">Como você quer usar o Barboo?</PageTitle>
          <Subtitle>Escolha a opção que melhor se adequa ao seu perfil</Subtitle>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <Link to="/register?type=client">
            <CardOption
              icon={User}
              title="Sou Cliente"
              description="Agende cortes com rapidez e facilidade"
              accentColor="accent"
            />
          </Link>

          <Link to="/register?type=owner">
            <CardOption
              icon={Store}
              title="Sou Proprietário"
              description="Controle sua equipe, agenda e serviços em um só lugar"
              accentColor="navy"
            />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterType;
