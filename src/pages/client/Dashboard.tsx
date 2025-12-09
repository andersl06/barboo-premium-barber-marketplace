import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from "react-router-dom";
import { Search, MapPin, Star, Calendar, User, LogOut } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { useState, useEffect } from "react";
import { bookingsApi } from "@/lib/api/bookings";
import { barbershopsApi } from "@/lib/api/barbershops";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const ClientDashboard = () => {
  const navigate = useNavigate();
  const [upcomingAppointments, setUpcomingAppointments] = useState<any[]>([]);
  const [barbershops, setBarbershops] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("barboo_user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const storedUser = JSON.parse(localStorage.getItem("barboo_user") || "{}");
      
      const [bookingsData, barbershopsData] = await Promise.all([
        storedUser.id ? bookingsApi.listByClient() : Promise.resolve([]),
        barbershopsApi.list(),
      ]);
      
      // Filtrar apenas agendamentos futuros/pendentes
      const bookings = Array.isArray(bookingsData) ? bookingsData : [];
      const upcoming = bookings
        .filter((b: any) => b.status === "pending" || b.status === "confirmed")
        .slice(0, 3);
      
      setUpcomingAppointments(upcoming);
      setBarbershops(Array.isArray(barbershopsData) ? barbershopsData.slice(0, 3) : []);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("barboo_token");
    localStorage.removeItem("barboo_user");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-secondary/20">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Logo size="md" linkTo="/client/home" />
          </div>
          <div className="flex items-center gap-4">
            <Link to="/client/profile">
              <Button variant="ghost" size="icon" className="text-navy">
                <User className="w-5 h-5" />
              </Button>
            </Link>
            <Button variant="ghost" size="icon" className="text-navy" onClick={handleLogout}>
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-navy mb-2">
            Olá, {user?.name?.split(" ")[0] || "Cliente"}! 👋
          </h1>
          <p className="text-muted-foreground">
            Encontre a barbearia perfeita para você
          </p>
        </div>

        {/* Search Bar */}
        <Card className="p-4 mb-8 shadow-md">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Buscar barbearias..."
                className="pl-10 h-12"
              />
            </div>
            <Button 
              className="bg-accent hover:bg-accent-light text-white px-6"
              onClick={() => navigate("/client/home")}
            >
              Buscar
            </Button>
          </div>
        </Card>

        {/* Upcoming Appointments */}
        {!loading && upcomingAppointments.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-navy">Próximos Agendamentos</h2>
              <Link to="/client/bookings">
                <Button variant="ghost" className="text-accent hover:text-accent-light font-medium">
                  Ver todos
                </Button>
              </Link>
            </div>
            <div className="grid gap-4">
              {upcomingAppointments.map((appointment) => (
                <Card key={appointment.id} className="p-5 shadow-md hover:shadow-lg transition-shadow">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-navy/10 rounded-lg flex items-center justify-center">
                        <Calendar className="w-6 h-6 text-navy" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-navy">
                          {appointment.barbershop?.name || "Barbearia"}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {appointment.barber?.name || "Barbeiro"}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-navy">
                        {appointment.date
                          ? format(new Date(appointment.date), "dd MMM", { locale: ptBR })
                          : "Data"}
                      </p>
                      <p className="text-sm text-muted-foreground">{appointment.start_time}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Featured Barbershops */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-navy">Barbearias em Destaque</h2>
            <Link to="/client/home">
              <Button variant="ghost" className="text-accent hover:text-accent-light font-medium">
                Ver todas
              </Button>
            </Link>
          </div>
          
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="h-72 animate-pulse bg-secondary/50" />
              ))}
            </div>
          ) : barbershops.length === 0 ? (
            <Card className="p-8 text-center">
              <Search className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">Nenhuma barbearia disponível</p>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {barbershops.map((barbershop) => (
                <Card 
                  key={barbershop.id} 
                  className="overflow-hidden hover:shadow-xl transition-shadow cursor-pointer"
                  onClick={() => navigate(`/client/barbershop/${barbershop.id}`)}
                >
                  <div className="h-48 bg-gradient-to-br from-navy to-navy-lighter flex items-center justify-center">
                    <span className="text-white text-4xl">💈</span>
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-lg text-navy mb-2">{barbershop.name}</h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                      <MapPin className="w-4 h-4" />
                      <span>{barbershop.neighborhood || barbershop.city || "São Paulo"}</span>
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
      </div>
    </div>
  );
};

export default ClientDashboard;
