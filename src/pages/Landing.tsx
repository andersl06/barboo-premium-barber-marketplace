import { Link } from "react-router-dom";
import { Check, Calendar, Zap, Users, DollarSign } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { PageTitle } from "@/components/ui/PageTitle";
import { Subtitle } from "@/components/ui/Subtitle";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { SecondaryButton } from "@/components/ui/SecondaryButton";
import { BenefitItem } from "@/components/feedback/BenefitItem";

import barbershopBackground from "@/assets/fundo_1628__4.jpg"; 

const Landing = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="container mx-auto px-4 py-6 flex items-center justify-between border-b border-border">
        <Logo variant="horizontal" size="md" /> {/* ALTERADO: size de "md" para "lg" */}
        <div className="flex items-center gap-3">
          <Link to="/login">
            <SecondaryButton variant="ghost" className="border-0">
              Entrar
            </SecondaryButton>
          </Link>
          <Link to="/register-type">
            <PrimaryButton>
              Cadastrar
            </PrimaryButton>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-24 text-center">
        <div className="max-w-4xl mx-auto">
          <PageTitle className="text-5xl md:text-6xl mb-6">
            O jeito moderno de agendar cortes
          </PageTitle>
          <Subtitle className="text-xl md:text-2xl mb-12 max-w-2xl mx-auto">
            Conforto para clientes. Inovação grátis para barbeiros.
          </Subtitle>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register-type">
              <PrimaryButton size="lg" className="text-lg px-10 py-7 h-auto">
                Começar agora {/* CORRIGIDO: "Começar Agora" para "Começar agora" */}
              </PrimaryButton>
            </Link>
            <Link to="/client/barbershops">
              <SecondaryButton size="lg" className="text-lg px-10 py-7 h-auto">
                Explorar barbearias
              </SecondaryButton>
            </Link>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="container mx-auto px-4 py-20 bg-secondary/30">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-navy text-center mb-16 font-manrope">
            Por que escolher o Barboo?
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <BenefitItem
              icon={DollarSign}
              title="Sem taxas para barbeiros"
              description="100% grátis para profissionais. Sem mensalidades ou cobranças escondidas."
            />
            <BenefitItem
              icon={Calendar}
              title="Agenda inteligente"
              description="Gerencie horários com facilidade e mantenha seus clientes organizados."
            />
            <BenefitItem
              icon={Zap}
              title="Agendamentos rápidos"
              description="Clientes agendam em segundos, direto pelo app. Sem ligações."
            />
            <BenefitItem
              icon={Users}
              title="Clientes descobrem você"
              description="Apareça para milhares de pessoas procurando barbearias próximas."
            />
            <BenefitItem
              icon={Check}
              title="Fácil de usar"
              description="Interface moderna e intuitiva. Começa a usar em minutos."
            />
            <BenefitItem
              icon={Check}
              title="100% grátis para profissionais"
              description="Plataforma completa sem custos. Focada em ajudar seu negócio crescer."
            />
          </div>
        </div>
      </section>

      {/* CTA Section - Com a imagem de fundo */}
      <section className="container mx-auto px-4 py-20">
        <div 
          className="rounded-3xl p-12 md:p-16 text-center text-white shadow-strong relative overflow-hidden"
          style={{
            backgroundImage: `url(${barbershopBackground})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        >
          {/* Overlay para escurecer a imagem e manter o texto legível */}
          <div className="absolute inset-0 bg-navy/80 rounded-3xl"></div>
          
          <div className="relative z-10"> {/* Conteúdo sobre o overlay */}
            <h2 className="text-3xl md:text-4xl font-bold mb-4 font-manrope">
              Pronto para começar?
            </h2>
            <p className="text-lg md:text-xl mb-10 opacity-90 max-w-2xl mx-auto">
              Cadastre-se gratuitamente e comece a agendar hoje mesmo. Seja cliente ou barbeiro, o Barboo é para você.
            </p>
            <Link to="/register-type">
              <PrimaryButton size="lg" className="text-lg px-10 py-7 h-auto bg-accent hover:bg-accent/90">
                Criar minha conta
              </PrimaryButton>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-10 text-center text-muted-foreground border-t border-border">
        <Logo variant="horizontal" size="sm" className="mx-auto mb-4" />
        <p className="text-sm">© 2025 Barboo. Todos os direitos reservados.</p>
        <p className="text-sm mt-2">O jeito moderno de agendar cortes.</p>
      </footer>
    </div>
  );
};

export default Landing;