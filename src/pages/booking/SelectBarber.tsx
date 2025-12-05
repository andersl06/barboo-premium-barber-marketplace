import { Layout } from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { PageTitle } from "@/components/ui/PageTitle";
import { Subtitle } from "@/components/ui/Subtitle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, Star } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { barbersApi } from "@/lib/api/barbers";

const SelectBarber = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const barbershopId = searchParams.get("barbershop");

  const [barbers, setBarbers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedService] = useState(() => {
    const saved = sessionStorage.getItem("booking_service");
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    if (barbershopId) {
      loadBarbers();
    }
  }, [barbershopId]);

  const loadBarbers = async () => {
    try {
      const data = await barbersApi.list(barbershopId!);
      setBarbers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Erro ao carregar barbeiros:", error);
      setBarbers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectBarber = (barber: any) => {
    sessionStorage.setItem("booking_barber", JSON.stringify(barber));
    navigate(`/booking/select-time?barbershop=${barbershopId}`);
  };

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
          <PageTitle className="text-white mb-2">Escolha o Barbeiro</PageTitle>
          <Subtitle className="text-white/70">
            {selectedService?.name || "Serviço selecionado"}
          </Subtitle>

          {/* Progress */}
          <div className="flex gap-2 mt-6">
            <div className="flex-1 h-1 bg-accent rounded-full" />
            <div className="flex-1 h-1 bg-accent rounded-full" />
            <div className="flex-1 h-1 bg-white/30 rounded-full" />
            <div className="flex-1 h-1 bg-white/30 rounded-full" />
          </div>
          <p className="text-xs text-white/50 mt-2">Passo 2 de 4</p>
        </div>

        {/* Content */}
        <div className="p-6 -mt-4">
          {loading ? (
            <div className="grid grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <Card key={i} className="h-40 animate-pulse bg-secondary/50" />
              ))}
            </div>
          ) : barbers.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">Nenhum barbeiro disponível</p>
            </Card>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {barbers.map((barber) => (
                <Card
                  key={barber.id}
                  className="p-4 cursor-pointer hover:shadow-medium hover:border-accent transition-smooth text-center"
                  onClick={() => handleSelectBarber(barber)}
                >
                  <Avatar className="w-16 h-16 mx-auto mb-3">
                    <AvatarImage src={barber.photo_url} />
                    <AvatarFallback className="bg-accent/10 text-accent text-xl">
                      {barber.name?.charAt(0)?.toUpperCase() || "B"}
                    </AvatarFallback>
                  </Avatar>
                  <h3 className="font-bold text-navy font-manrope mb-1">{barber.name}</h3>
                  {barber.rating && (
                    <div className="flex items-center justify-center gap-1 text-sm">
                      <Star className="w-4 h-4 fill-accent text-accent" />
                      <span>{barber.rating}</span>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default SelectBarber;
