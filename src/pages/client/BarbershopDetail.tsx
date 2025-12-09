import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link, useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin, Star, Clock, Phone, Users } from "lucide-react";
import { useState, useEffect } from "react";
import { barbershopsApi } from "@/lib/api/barbershops";
import { barbersApi } from "@/lib/api/barbers";
import barbooLogo from "@/assets/barboo-logo.png";

const BarbershopDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [barbershop, setBarbershop] = useState<any>(null);
  const [barbers, setBarbers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadData();
    }
  }, [id]);

  const loadData = async () => {
    try {
      const [barbershopData, barbersData] = await Promise.all([
        barbershopsApi.getOne(id!),
        barbersApi.list(Number(id)),
      ]);
      setBarbershop(barbershopData);
      setBarbers(Array.isArray(barbersData) ? barbersData : []);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStartBooking = () => {
    sessionStorage.setItem("booking_barbershop_id", id!);
    navigate(`/booking/select-service?barbershop=${id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-secondary/20 flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Carregando...</div>
      </div>
    );
  }

  if (!barbershop) {
    return (
      <div className="min-h-screen bg-secondary/20 flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Barbearia não encontrada</p>
          <Button onClick={() => navigate("/client/home")}>Voltar</Button>
        </div>
      </div>
    );
  }

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
            <img src={barbooLogo} alt="Barboo" className="h-8" />
          </div>
        </div>
      </header>

      {/* Hero Image */}
      <div className="h-72 bg-gradient-to-br from-navy via-navy-light to-navy-lighter flex items-center justify-center">
        <span className="text-white text-8xl">💈</span>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Barbershop Info */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-navy mb-4">{barbershop.name}</h1>
          
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div className="flex items-center gap-3 text-muted-foreground">
              <MapPin className="w-5 h-5 text-accent" />
              <span>
                {barbershop.address}, {barbershop.address_number} - {barbershop.neighborhood}, {barbershop.city}
              </span>
            </div>
            <div className="flex items-center gap-3 text-muted-foreground">
              <Clock className="w-5 h-5 text-accent" />
              <span>Seg-Sex: 9h-20h | Sáb: 9h-18h</span>
            </div>
            <div className="flex items-center gap-3 text-muted-foreground">
              <Phone className="w-5 h-5 text-accent" />
              <span>{barbershop.phone || "(11) 99999-9999"}</span>
            </div>
            <div className="flex items-center gap-3">
              <Star className="w-5 h-5 fill-accent text-accent" />
              <span className="font-semibold text-navy">{barbershop.rating || "N/A"}</span>
              <span className="text-muted-foreground">({barbershop.review_count || 0} avaliações)</span>
            </div>
          </div>

          {barbershop.description && (
            <p className="text-muted-foreground leading-relaxed">
              {barbershop.description}
            </p>
          )}
        </div>

        {/* Barbers */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-navy mb-4">Nossos Barbeiros</h2>
          {barbers.length === 0 ? (
            <Card className="p-8 text-center">
              <Users className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">Nenhum barbeiro cadastrado</p>
            </Card>
          ) : (
            <div className="grid md:grid-cols-3 gap-4">
              {barbers.map((barber) => (
                <Card key={barber.id} className="p-5 text-center hover:shadow-lg transition-shadow">
                  <div className="w-20 h-20 bg-navy/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Users className="w-10 h-10 text-navy" />
                  </div>
                  <h3 className="font-semibold text-navy mb-2">{barber.name}</h3>
                  {barber.rating && (
                    <div className="flex items-center justify-center gap-1">
                      <Star className="w-4 h-4 fill-accent text-accent" />
                      <span className="font-semibold text-navy">{barber.rating}</span>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* CTA */}
        <Card className="p-6 bg-gradient-to-r from-navy to-navy-light text-white">
          <h3 className="text-xl font-bold mb-3">Pronto para agendar?</h3>
          <p className="mb-4 opacity-90">Escolha seu barbeiro e horário preferido</p>
          <Button 
            size="lg" 
            className="bg-accent hover:bg-accent-light text-white font-semibold w-full md:w-auto"
            onClick={handleStartBooking}
          >
            Agendar Agora
          </Button>
        </Card>
      </div>
    </div>
  );
};

export default BarbershopDetail;
