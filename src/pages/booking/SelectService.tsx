import { Layout } from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { PageTitle } from "@/components/ui/PageTitle";
import { Subtitle } from "@/components/ui/Subtitle";
import { ServiceCard } from "@/components/cards/ServiceCard";
import { ArrowLeft, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { servicesApi } from "@/lib/api/services";
import { barbershopsApi } from "@/lib/api/barbershops";

const SelectService = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const barbershopId = searchParams.get("barbershop");

  const [barbershop, setBarbershop] = useState<any>(null);
  const [services, setServices] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (barbershopId) {
      loadData();
    }
  }, [barbershopId]);

  const loadData = async () => {
    try {
      const [barbershopData, servicesData] = await Promise.all([
        barbershopsApi.getById(barbershopId!),
        servicesApi.list(barbershopId!),
      ]);
      setBarbershop(barbershopData);
      setServices(Array.isArray(servicesData) ? servicesData : []);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectService = (service: any) => {
    // Salvar no sessionStorage para usar nos próximos steps
    sessionStorage.setItem("booking_service", JSON.stringify(service));
    sessionStorage.setItem("booking_barbershop_id", barbershopId || "");
    navigate(`/booking/select-barber?barbershop=${barbershopId}`);
  };

  const filteredServices = services.filter((s) =>
    s.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Layout>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="bg-navy p-6 pb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-white/80 hover:text-white mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            Voltar
          </button>
          <PageTitle className="text-white mb-2">Escolha o Serviço</PageTitle>
          <Subtitle className="text-white/70">
            {barbershop?.name || "Carregando..."}
          </Subtitle>

          {/* Progress */}
          <div className="flex gap-2 mt-6">
            <div className="flex-1 h-1 bg-accent rounded-full" />
            <div className="flex-1 h-1 bg-white/30 rounded-full" />
            <div className="flex-1 h-1 bg-white/30 rounded-full" />
            <div className="flex-1 h-1 bg-white/30 rounded-full" />
          </div>
          <p className="text-xs text-white/50 mt-2">Passo 1 de 4</p>
        </div>

        {/* Content */}
        <div className="p-6 -mt-4">
          {/* Search */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Buscar serviço..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Services List */}
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="h-24 animate-pulse bg-secondary/50" />
              ))}
            </div>
          ) : filteredServices.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">Nenhum serviço encontrado</p>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredServices.map((service) => (
                <ServiceCard
                  key={service.id}
                  name={service.name}
                  description={service.description}
                  price={`R$ ${service.price?.toFixed(2)}`}
                  duration={`${service.duration} min`}
                  onClick={() => handleSelectService(service)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default SelectService;
