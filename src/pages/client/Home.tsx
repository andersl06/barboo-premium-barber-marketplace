import { Layout } from "@/components/Layout";
import { PageTitle } from "@/components/ui/PageTitle";
import { Subtitle } from "@/components/ui/Subtitle";
import { Input } from "@/components/ui/input";
import { BarbershopCard } from "@/components/cards/BarbershopCard";
import { Search, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { barbershopsApi } from "@/lib/api/barbershops";
import { Card } from "@/components/ui/card";
import { FloatingMenuButton } from "@/components/client/FloatingMenuButton";

const ClientHome = () => {
  const navigate = useNavigate();
  const [barbershops, setBarbershops] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBarbershops();
  }, []);

  const loadBarbershops = async () => {
    try {
      const data = await barbershopsApi.list();
      setBarbershops(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Erro ao carregar barbearias:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <div className="bg-gradient-to-b from-navy/5 to-transparent p-6 pb-8">
          <div className="max-w-7xl mx-auto">
            <PageTitle className="mb-2">Barbearias próximas de você</PageTitle>
            <Subtitle className="mb-6">
              Encontre os melhores profissionais da sua região
            </Subtitle>

            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Buscar por barbearia..."
                className="pl-12 h-14 text-base"
              />
            </div>
          </div>
        </div>

        {/* Barbershops List */}
        <div className="p-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-2 text-muted-foreground mb-6">
              <MapPin className="w-5 h-5 text-accent" />
              <span className="font-medium">Sua localização: São Paulo, SP</span>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="h-48 animate-pulse bg-secondary/50" />
                ))}
              </div>
            ) : barbershops.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-12 h-12 text-muted-foreground" />
                </div>
                <PageTitle className="mb-2">Nenhuma barbearia encontrada</PageTitle>
                <Subtitle>Tente ajustar seus filtros de busca</Subtitle>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {barbershops.map((barbershop) => (
                  <BarbershopCard
                    key={barbershop.id}
                    name={barbershop.name}
                    address={barbershop.address || `${barbershop.neighborhood}, ${barbershop.city}`}
                    rating={barbershop.rating || 0}
                    reviewCount={barbershop.review_count || 0}
                    distance=""
                    onClick={() => navigate(`/client/barbershop/${barbershop.id}`)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Floating Menu Button */}
        <FloatingMenuButton />
      </div>
    </Layout>
  );
};

export default ClientHome;