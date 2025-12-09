import { Layout } from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { PageTitle } from "@/components/ui/PageTitle";
import { Subtitle } from "@/components/ui/Subtitle";
import { Calendar } from "@/components/ui/calendar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Clock, User, Scissors } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { bookingsApi } from "@/lib/api/bookings";
import { format, isSameDay } from "date-fns";
import { ptBR } from "date-fns/locale";

const BarberAgenda = () => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("barboo_user") || "{}");
      if (user.barbershop_id && user.barber_id) {
        const data = await bookingsApi.listByBarber(user.barbershop_id, user.barber_id);
        setBookings(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error("Erro ao carregar agendamentos:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredBookings = bookings.filter((b) => {
    if (!selectedDate) return true;
    return isSameDay(new Date(b.date), selectedDate);
  });

  const upcomingBookings = filteredBookings.filter(
    (b) => b.status === "pending" || b.status === "confirmed"
  );
  const completedBookings = filteredBookings.filter(
    (b) => b.status === "completed" || b.status === "cancelled"
  );

  const BookingItem = ({ booking }: { booking: any }) => (
    <Card className="p-4 hover:shadow-medium transition-smooth">
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-accent" />
          </div>
          <div>
            <p className="font-semibold text-navy">{booking.client?.name || "Cliente"}</p>
            <p className="text-xs text-muted-foreground">{booking.client?.phone || ""}</p>
          </div>
        </div>
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            booking.status === "confirmed"
              ? "bg-accent/10 text-accent"
              : booking.status === "pending"
              ? "bg-yellow-100 text-yellow-700"
              : booking.status === "cancelled"
              ? "bg-destructive/10 text-destructive"
              : "bg-secondary text-muted-foreground"
          }`}
        >
          {booking.status === "confirmed"
            ? "Confirmado"
            : booking.status === "pending"
            ? "Pendente"
            : booking.status === "cancelled"
            ? "Cancelado"
            : "Concluído"}
        </span>
      </div>

      <div className="flex gap-4 text-sm">
        <div className="flex items-center gap-1 text-muted-foreground">
          <Scissors className="w-4 h-4" />
          {booking.service?.name || "Serviço"}
        </div>
        <div className="flex items-center gap-1 text-muted-foreground">
          <Clock className="w-4 h-4" />
          {booking.start_time}
        </div>
      </div>
    </Card>
  );

  return (
    <Layout>
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => navigate("/barber/dashboard")}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            Voltar
          </button>

          <div className="mb-8">
            <PageTitle className="mb-2">Minha Agenda</PageTitle>
            <Subtitle>
              {selectedDate
                ? format(selectedDate, "EEEE, dd 'de' MMMM", { locale: ptBR })
                : "Selecione uma data"}
            </Subtitle>
          </div>

          {/* Calendar */}
          <Card className="p-4 mb-6">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              locale={ptBR}
              className="rounded-md pointer-events-auto"
            />
          </Card>

          {/* Bookings */}
          <Tabs defaultValue="upcoming" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="upcoming">
                Próximos ({upcomingBookings.length})
              </TabsTrigger>
              <TabsTrigger value="history">
                Histórico ({completedBookings.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="upcoming">
              {loading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <Card key={i} className="h-24 animate-pulse bg-secondary/50" />
                  ))}
                </div>
              ) : upcomingBookings.length === 0 ? (
                <Card className="p-8 text-center">
                  <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground">Nenhum agendamento para esta data</p>
                </Card>
              ) : (
                <div className="space-y-3">
                  {upcomingBookings.map((booking) => (
                    <BookingItem key={booking.id} booking={booking} />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="history">
              {loading ? (
                <div className="space-y-3">
                  {[1, 2].map((i) => (
                    <Card key={i} className="h-24 animate-pulse bg-secondary/50" />
                  ))}
                </div>
              ) : completedBookings.length === 0 ? (
                <Card className="p-8 text-center">
                  <p className="text-muted-foreground">Nenhum histórico para esta data</p>
                </Card>
              ) : (
                <div className="space-y-3">
                  {completedBookings.map((booking) => (
                    <BookingItem key={booking.id} booking={booking} />
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default BarberAgenda;
