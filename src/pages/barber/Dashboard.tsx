import { Layout } from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { PageTitle } from "@/components/ui/PageTitle";
import { Subtitle } from "@/components/ui/Subtitle";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { Calendar, Clock, DollarSign, Star, Users } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { bookingsApi } from "@/lib/api/bookings";
import { commissionApi } from "@/lib/api/commission";

const BarberDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    todayBookings: 0,
    totalBookings: 0,
    earnings: 0,
    rating: 0,
  });
  const [upcomingBookings, setUpcomingBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("barboo_user") || "{}");
      if (user.barber_id) {
        const [bookingsData, commissionData] = await Promise.all([
          bookingsApi.listByBarber(user.barber_id),
          commissionApi.getByBarber(user.barber_id),
        ]);

        const bookings = Array.isArray(bookingsData) ? bookingsData : [];
        const today = new Date().toISOString().split("T")[0];
        const todayBookings = bookings.filter((b: any) => b.date === today);
        const upcoming = bookings
          .filter((b: any) => b.status === "pending" || b.status === "confirmed")
          .slice(0, 3);

        setStats({
          todayBookings: todayBookings.length,
          totalBookings: commissionData?.total_bookings || 0,
          earnings: commissionData?.barber_earnings || 0,
          rating: user.rating || 4.8,
        });
        setUpcomingBookings(upcoming);
      }
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    } finally {
      setLoading(false);
    }
  };

  const statsCards = [
    {
      label: "Agendamentos Hoje",
      value: stats.todayBookings,
      icon: Calendar,
      color: "text-accent",
      bgColor: "bg-accent/10",
    },
    {
      label: "Total de Atendimentos",
      value: stats.totalBookings,
      icon: Users,
      color: "text-navy",
      bgColor: "bg-navy/10",
    },
    {
      label: "Ganhos Totais",
      value: `R$ ${stats.earnings.toFixed(2)}`,
      icon: DollarSign,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      label: "Avaliação",
      value: stats.rating.toFixed(1),
      icon: Star,
      color: "text-yellow-500",
      bgColor: "bg-yellow-100",
    },
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <PageTitle className="mb-2">Dashboard</PageTitle>
            <Subtitle>Acompanhe seu desempenho e agendamentos</Subtitle>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            {statsCards.map((stat, index) => (
              <Card key={index} className="p-4 hover:shadow-medium transition-smooth">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                    <stat.icon className={`w-5 h-5 ${stat.color}`} />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                    <p className={`text-xl font-bold font-manrope ${stat.color}`}>
                      {stat.value}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Próximos Agendamentos */}
          <Card className="p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-navy font-manrope">Próximos Atendimentos</h2>
              <PrimaryButton size="sm" onClick={() => navigate("/barber/agenda")}>
                Ver Agenda
              </PrimaryButton>
            </div>

            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-16 animate-pulse bg-secondary/50 rounded-lg" />
                ))}
              </div>
            ) : upcomingBookings.length === 0 ? (
              <div className="text-center py-8">
                <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">Nenhum agendamento próximo</p>
              </div>
            ) : (
              <div className="space-y-3">
                {upcomingBookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg"
                  >
                    <div>
                      <p className="font-semibold text-navy">{booking.client?.name || "Cliente"}</p>
                      <p className="text-sm text-muted-foreground">
                        {booking.service?.name || "Serviço"}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-navy">{booking.date}</p>
                      <p className="text-sm text-muted-foreground">{booking.start_time}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-4">
            <Card
              className="p-4 cursor-pointer hover:shadow-medium hover:border-accent transition-smooth"
              onClick={() => navigate("/barber/agenda")}
            >
              <Calendar className="w-6 h-6 text-accent mb-2" />
              <p className="font-semibold text-navy">Ver Agenda</p>
              <p className="text-xs text-muted-foreground">Todos os agendamentos</p>
            </Card>
            <Card
              className="p-4 cursor-pointer hover:shadow-medium hover:border-accent transition-smooth"
              onClick={() => navigate("/barber/profile")}
            >
              <Users className="w-6 h-6 text-accent mb-2" />
              <p className="font-semibold text-navy">Meu Perfil</p>
              <p className="text-xs text-muted-foreground">Editar informações</p>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default BarberDashboard;
