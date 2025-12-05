import { Layout } from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { PageTitle } from "@/components/ui/PageTitle";
import { Subtitle } from "@/components/ui/Subtitle";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { SecondaryButton } from "@/components/ui/SecondaryButton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, Calendar, Clock, Scissors, CheckCircle, MapPin } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { bookingsApi } from "@/lib/api/bookings";
import { barbershopsApi } from "@/lib/api/barbershops";
import { toast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const BARBOO_FEE_PERCENT = 0.05; // 5%

const BookingConfirm = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const barbershopId = searchParams.get("barbershop");

  const [barbershop, setBarbershop] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const [selectedService] = useState(() => {
    const saved = sessionStorage.getItem("booking_service");
    return saved ? JSON.parse(saved) : null;
  });

  const [selectedBarber] = useState(() => {
    const saved = sessionStorage.getItem("booking_barber");
    return saved ? JSON.parse(saved) : null;
  });

  const [datetime] = useState(() => {
    const saved = sessionStorage.getItem("booking_datetime");
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    if (barbershopId) {
      loadBarbershop();
    }
  }, [barbershopId]);

  const loadBarbershop = async () => {
    try {
      const data = await barbershopsApi.getById(barbershopId!);
      setBarbershop(data);
    } catch (error) {
      console.error("Erro ao carregar barbearia:", error);
    }
  };

  const servicePrice = selectedService?.price || 0;
  const barbooFee = servicePrice * BARBOO_FEE_PERCENT;
  const totalPrice = servicePrice + barbooFee;
  const barberEarnings = servicePrice;

  const handleConfirm = async () => {
    if (!selectedService || !selectedBarber || !datetime) {
      toast({ title: "Dados incompletos", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      await bookingsApi.create({
        barber_id: selectedBarber.id,
        barbershop_id: Number(barbershopId),
        service_id: selectedService.id,
        date: datetime.date,
        start_time: datetime.time,
      });

      setSuccess(true);

      // Limpar sessionStorage
      sessionStorage.removeItem("booking_service");
      sessionStorage.removeItem("booking_barber");
      sessionStorage.removeItem("booking_datetime");
      sessionStorage.removeItem("booking_barbershop_id");
    } catch (error: any) {
      toast({ title: error.message || "Erro ao confirmar agendamento", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <Layout>
        <div className="min-h-screen bg-background flex items-center justify-center p-6">
          <Card className="p-8 text-center max-w-md w-full">
            <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-accent" />
            </div>
            <h2 className="text-2xl font-bold text-navy font-manrope mb-2">
              Agendamento Confirmado!
            </h2>
            <p className="text-muted-foreground mb-6">
              Seu horário foi reservado com sucesso. Você receberá uma confirmação em breve.
            </p>
            <div className="space-y-3">
              <PrimaryButton className="w-full" onClick={() => navigate("/client/bookings")}>
                Ver Meus Agendamentos
              </PrimaryButton>
              <SecondaryButton className="w-full" onClick={() => navigate("/client/home")}>
                Voltar ao Início
              </SecondaryButton>
            </div>
          </Card>
        </div>
      </Layout>
    );
  }

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
          <PageTitle className="text-white mb-2">Confirmar Agendamento</PageTitle>
          <Subtitle className="text-white/70">Revise os detalhes antes de confirmar</Subtitle>

          {/* Progress */}
          <div className="flex gap-2 mt-6">
            <div className="flex-1 h-1 bg-accent rounded-full" />
            <div className="flex-1 h-1 bg-accent rounded-full" />
            <div className="flex-1 h-1 bg-accent rounded-full" />
            <div className="flex-1 h-1 bg-accent rounded-full" />
          </div>
          <p className="text-xs text-white/50 mt-2">Passo 4 de 4</p>
        </div>

        {/* Content */}
        <div className="p-6 -mt-4">
          {/* Barbearia */}
          <Card className="p-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center">
                <MapPin className="w-6 h-6 text-accent" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Barbearia</p>
                <p className="font-bold text-navy">{barbershop?.name || "Carregando..."}</p>
              </div>
            </div>
          </Card>

          {/* Serviço */}
          <Card className="p-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center">
                <Scissors className="w-6 h-6 text-accent" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Serviço</p>
                <p className="font-bold text-navy">{selectedService?.name}</p>
              </div>
              <p className="font-bold text-accent">R$ {servicePrice.toFixed(2)}</p>
            </div>
          </Card>

          {/* Barbeiro */}
          <Card className="p-4 mb-4">
            <div className="flex items-center gap-3">
              <Avatar className="w-12 h-12">
                <AvatarImage src={selectedBarber?.photo_url} />
                <AvatarFallback className="bg-accent/10 text-accent">
                  {selectedBarber?.name?.charAt(0)?.toUpperCase() || "B"}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm text-muted-foreground">Barbeiro</p>
                <p className="font-bold text-navy">{selectedBarber?.name}</p>
              </div>
            </div>
          </Card>

          {/* Data e Hora */}
          <Card className="p-4 mb-6">
            <div className="flex gap-6">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-accent" />
                <div>
                  <p className="text-sm text-muted-foreground">Data</p>
                  <p className="font-bold text-navy">
                    {datetime?.date
                      ? format(new Date(datetime.date), "dd 'de' MMMM", { locale: ptBR })
                      : "-"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-accent" />
                <div>
                  <p className="text-sm text-muted-foreground">Horário</p>
                  <p className="font-bold text-navy">{datetime?.time || "-"}</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Resumo de Valores */}
          <Card className="p-4 mb-6">
            <h3 className="font-bold text-navy font-manrope mb-4">Resumo do Pagamento</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Valor do serviço</span>
                <span className="font-medium">R$ {servicePrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Taxa Barboo (5%)</span>
                <span className="font-medium">R$ {barbooFee.toFixed(2)}</span>
              </div>
              <div className="border-t pt-3 flex justify-between">
                <span className="font-bold text-navy">Total</span>
                <span className="font-bold text-accent text-lg">R$ {totalPrice.toFixed(2)}</span>
              </div>
            </div>

            <div className="mt-4 p-3 bg-secondary/50 rounded-lg">
              <p className="text-xs text-muted-foreground">
                💈 O barbeiro receberá{" "}
                <span className="font-bold text-navy">R$ {barberEarnings.toFixed(2)}</span>{" "}
                (valor integral do serviço)
              </p>
            </div>
          </Card>

          {/* Confirm Button */}
          <PrimaryButton className="w-full" onClick={handleConfirm} disabled={loading}>
            {loading ? "Confirmando..." : "Confirmar Agendamento"}
          </PrimaryButton>
        </div>
      </div>
    </Layout>
  );
};

export default BookingConfirm;
