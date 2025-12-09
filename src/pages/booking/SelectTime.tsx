import { Layout } from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { PageTitle } from "@/components/ui/PageTitle";
import { Subtitle } from "@/components/ui/Subtitle";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { Calendar } from "@/components/ui/calendar";
import { ArrowLeft, Clock } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { availabilityApi } from "@/lib/api/availability";
import { format, addDays, isBefore, startOfDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";

const SelectTime = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const barbershopId = searchParams.get("barbershop");

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [availability, setAvailability] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedBarber] = useState(() => {
    const saved = sessionStorage.getItem("booking_barber");
    return saved ? JSON.parse(saved) : null;
  });

  const [selectedService] = useState(() => {
    const saved = sessionStorage.getItem("booking_service");
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    if (selectedBarber?.id) {
      loadAvailability();
    }
  }, [selectedBarber]);

  const loadAvailability = async () => {
    try {
      const data = await availabilityApi.get(Number(barbershopId), selectedBarber.id);
      setAvailability(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Erro ao carregar disponibilidade:", error);
    } finally {
      setLoading(false);
    }
  };

  // Gerar horários disponíveis (mock para demonstração)
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 9; hour <= 18; hour++) {
      slots.push(`${hour.toString().padStart(2, "0")}:00`);
      if (hour < 18) {
        slots.push(`${hour.toString().padStart(2, "0")}:30`);
      }
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  const handleContinue = () => {
    if (selectedDate && selectedTime) {
      sessionStorage.setItem(
        "booking_datetime",
        JSON.stringify({
          date: format(selectedDate, "yyyy-MM-dd"),
          time: selectedTime,
        })
      );
      navigate(`/booking/confirm?barbershop=${barbershopId}`);
    }
  };

  const disabledDays = (date: Date) => {
    return isBefore(date, startOfDay(new Date()));
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
          <PageTitle className="text-white mb-2">Escolha Data e Hora</PageTitle>
          <Subtitle className="text-white/70">
            {selectedBarber?.name || "Barbeiro"} • {selectedService?.name || "Serviço"}
          </Subtitle>

          {/* Progress */}
          <div className="flex gap-2 mt-6">
            <div className="flex-1 h-1 bg-accent rounded-full" />
            <div className="flex-1 h-1 bg-accent rounded-full" />
            <div className="flex-1 h-1 bg-accent rounded-full" />
            <div className="flex-1 h-1 bg-white/30 rounded-full" />
          </div>
          <p className="text-xs text-white/50 mt-2">Passo 3 de 4</p>
        </div>

        {/* Content */}
        <div className="p-6 -mt-4">
          {/* Calendar */}
          <Card className="p-4 mb-6">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              disabled={disabledDays}
              locale={ptBR}
              className="rounded-md pointer-events-auto"
            />
          </Card>

          {/* Time Slots */}
          <Card className="p-4 mb-6">
            <h3 className="font-bold text-navy font-manrope mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-accent" />
              Horários disponíveis
            </h3>

            {loading ? (
              <div className="grid grid-cols-4 gap-2">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                  <div key={i} className="h-10 animate-pulse bg-secondary/50 rounded-lg" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-4 gap-2">
                {timeSlots.map((time) => (
                  <button
                    key={time}
                    onClick={() => setSelectedTime(time)}
                    className={cn(
                      "py-2 px-3 rounded-lg text-sm font-medium transition-smooth",
                      selectedTime === time
                        ? "bg-accent text-accent-foreground"
                        : "bg-secondary hover:bg-secondary/80 text-foreground"
                    )}
                  >
                    {time}
                  </button>
                ))}
              </div>
            )}
          </Card>

          {/* Continue Button */}
          <PrimaryButton
            className="w-full"
            disabled={!selectedDate || !selectedTime}
            onClick={handleContinue}
          >
            Continuar
          </PrimaryButton>
        </div>
      </div>
    </Layout>
  );
};

export default SelectTime;
