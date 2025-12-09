import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from "react-router-dom";
import { Search, MapPin, Star, Filter, ArrowLeft } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { useState, useEffect } from "react";
import { barbershopsApi } from "@/lib/api/barbershops";
import { FloatingMenuButton } from "@/components/client/FloatingMenuButton";

const Barbershops = () => {
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
    <div className="min-h-screen bg-secondary/20">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/client/home">
              <Button variant="ghost" size="icon" className="text-navy">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <Logo size="md" linkTo="/client/home" />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <h1 className="text-3xl font-bold text-navy mb-6">
          Barbearias próximas
        </h1>

        {/* Filters */}
        <div className="mb-6 flex gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome, localização..."
              className="pl-10 h-12"
            />
          </div>
          <Button variant="outline" className="border-navy text-navy hover:bg-navy hover:text-white">
            <Filter className="w-4 h-4 mr-2" />
            Filtros
          </Button>
        </div>

        {/* Barbershops Grid */}
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="h-72 animate-pulse bg-secondary/50" />
            ))}
          </div>
        ) : barbershops.length === 0 ? (
          <Card className="p-12 text-center">
            <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-bold text-navy mb-2">Nenhuma barbearia encontrada</h3>
            <p className="text-muted-foreground">Tente ajustar seus filtros de busca</p>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {barbershops.map((barbershop) => (
              <Card 
                key={barbershop.id} 
                className="overflow-hidden hover:shadow-xl transition-all cursor-pointer h-full"
                onClick={() => navigate(`/client/barbershop/${barbershop.id}`)}
              >
                <div className="h-48 bg-gradient-to-br from-navy via-navy-light to-navy-lighter flex items-center justify-center">
                  <span className="text-white text-5xl">💈</span>
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-lg text-navy mb-2">{barbershop.name}</h3>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                    <MapPin className="w-4 h-4" />
                    <span>{barbershop.neighborhood || barbershop.address}, {barbershop.city}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-accent text-accent" />
                      <span className="font-semibold text-navy">{barbershop.rating || "N/A"}</span>
                      <span className="text-sm text-muted-foreground">({barbershop.review_count || 0})</span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Floating Menu Button */}
      <FloatingMenuButton />
    </div>
  );
};

export default Barbershops;
