import { Layout } from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { PageTitle } from "@/components/ui/PageTitle";
import { Subtitle } from "@/components/ui/Subtitle";
import { SecondaryButton } from "@/components/ui/SecondaryButton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, Scissors, MapPin, XCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { bookingsApi } from "@/lib/api/bookings";
import { toast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const ClientBookings = () => {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("barboo_user") || "{}");
      if (user.id) {
        const data = await bookingsApi.listByClient();
        setBookings(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error("Erro ao carregar agendamentos:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (booking: any) => {
    try {
      await bookingsApi.cancel(booking.barbershop_id, booking.id);
      setBookings(
        bookings.map((b) =>
          b.id === booking.id ? { ...b, status: "cancelled" } : b
        )
      );
      toast({ title: "Agendamento cancelado" });
    } catch (error: any) {
      toast({ title: error.message || "Erro ao cancelar", variant: "destructive" });
    }
  };

  const upcomingBookings = bookings.filter(
    (b) => b.status === "pending" || b.status === "confirmed"
  );
  const pastBookings = bookings.filter(
    (b) => b.status === "completed" || b.status === "cancelled"
  );

  const BookingCard = ({ booking, showCancel = false }: { booking: any; showCancel?: boolean }) => (
    <Card className="p-5 hover:shadow-medium transition-smooth">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-bold text-navy font-manrope">{booking.barbershop?.name || "Barbearia"}</h3>
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            {booking.barbershop?.address || "Endereço"}
          </p>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${
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

      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-sm">
          <Scissors className="w-4 h-4 text-accent" />
          <span>{booking.service?.name || "Serviço"}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Calendar className="w-4 h-4 text-accent" />
          <span>
            {booking.date
              ? format(new Date(booking.date), "dd 'de' MMMM, yyyy", { locale: ptBR })
              : "Data"}
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Clock className="w-4 h-4 text-accent" />
          <span>{booking.start_time || "Horário"}</span>
        </div>
      </div>

      <div className="flex justify-between items-center pt-4 border-t border-border">
        <div>
          <p className="text-sm text-muted-foreground">Total</p>
          <p className="text-lg font-bold text-navy">
            R$ {booking.total?.toFixed(2) || "0,00"}
          </p>
        </div>
        {showCancel && (booking.status === "pending" || booking.status === "confirmed") && (
          <SecondaryButton
            size="sm"
            onClick={() => handleCancel(booking)}
            className="text-destructive border-destructive hover:bg-destructive/10"
          >
            <XCircle className="w-4 h-4 mr-1" />
            Cancelar
          </SecondaryButton>
        )}
      </div>
    </Card>
  );

  return (
    <Layout>
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <PageTitle className="mb-2">Meus Agendamentos</PageTitle>
            <Subtitle>Acompanhe seus cortes e serviços</Subtitle>
          </div>

          <Tabs defaultValue="upcoming" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="upcoming">Próximos</TabsTrigger>
              <TabsTrigger value="history">Histórico</TabsTrigger>
            </TabsList>

            <TabsContent value="upcoming">
              {loading ? (
                <div className="space-y-4">
                  {[1, 2].map((i) => (
                    <Card key={i} className="h-40 animate-pulse bg-secondary/50" />
                  ))}
                </div>
              ) : upcomingBookings.length === 0 ? (
                <Card className="p-12 text-center">
                  <Calendar className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-navy mb-2">Nenhum agendamento</h3>
                  <p className="text-muted-foreground">
                    Você ainda não tem agendamentos futuros.
                  </p>
                </Card>
              ) : (
                <div className="space-y-4">
                  {upcomingBookings.map((booking) => (
                    <BookingCard key={booking.id} booking={booking} showCancel />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="history">
              {loading ? (
                <div className="space-y-4">
                  {[1, 2].map((i) => (
                    <Card key={i} className="h-40 animate-pulse bg-secondary/50" />
                  ))}
                </div>
              ) : pastBookings.length === 0 ? (
                <Card className="p-12 text-center">
                  <Clock className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-navy mb-2">Sem histórico</h3>
                  <p className="text-muted-foreground">
                    Seus agendamentos anteriores aparecerão aqui.
                  </p>
                </Card>
              ) : (
                <div className="space-y-4">
                  {pastBookings.map((booking) => (
                    <BookingCard key={booking.id} booking={booking} />
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

export default ClientBookings;
