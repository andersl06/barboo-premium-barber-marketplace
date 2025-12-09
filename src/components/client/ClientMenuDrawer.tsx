import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerClose,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { 
  Calendar, 
  Home, 
  User, 
  LogOut, 
  X, 
  Clock,
  ChevronRight,
  History
} from "lucide-react";
import { bookingsApi } from "@/lib/api/bookings";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface ClientMenuDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ClientMenuDrawer = ({ open, onOpenChange }: ClientMenuDrawerProps) => {
  const navigate = useNavigate();
  const [upcomingAppointments, setUpcomingAppointments] = useState<any[]>([]);
  const [pastAppointments, setPastAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("barboo_user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    if (open) {
      loadAppointments();
    }
  }, [open]);

  const loadAppointments = async () => {
    try {
      const bookingsData = await bookingsApi.listByClient();
      const bookings = Array.isArray(bookingsData) ? bookingsData : [];
      
      const upcoming = bookings
        .filter((b: any) => b.status === "pending" || b.status === "confirmed")
        .slice(0, 3);
      
      const past = bookings
        .filter((b: any) => b.status === "completed" || b.status === "cancelled")
        .slice(0, 5);
      
      setUpcomingAppointments(upcoming);
      setPastAppointments(past);
    } catch (error) {
      console.error("Erro ao carregar agendamentos:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("barboo_token");
    localStorage.removeItem("barboo_user");
    onOpenChange(false);
    navigate("/login");
  };

  const handleNavigate = (path: string) => {
    onOpenChange(false);
    navigate(path);
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange} direction="right" modal={true}>
      <DrawerContent showHandle={false} className="h-full w-[85vw] max-w-[400px] ml-auto inset-y-0 right-0 left-auto rounded-l-2xl rounded-r-none border-l">
        <div className="flex flex-col h-full">
          {/* Header */}
          <DrawerHeader className="border-b bg-navy text-white rounded-tl-2xl">
            <div className="flex items-center justify-between">
              <div>
                <DrawerTitle className="text-white text-lg">
                  Olá, {user?.name?.split(" ")[0] || "Cliente"}! 👋
                </DrawerTitle>
                <p className="text-white/70 text-sm mt-1">
                  {user?.email || ""}
                </p>
              </div>
              <DrawerClose asChild>
                <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
                  <X className="w-5 h-5" />
                </Button>
              </DrawerClose>
            </div>
          </DrawerHeader>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            {/* Próximos Agendamentos */}
            <section>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-navy flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-accent" />
                  Próximos Agendamentos
                </h3>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-accent text-xs p-0 h-auto"
                  onClick={() => handleNavigate("/client/bookings")}
                >
                  Ver todos
                  <ChevronRight className="w-3 h-3 ml-1" />
                </Button>
              </div>
              
              {loading ? (
                <div className="space-y-2">
                  {[1, 2].map((i) => (
                    <Card key={i} className="h-16 animate-pulse bg-secondary/50" />
                  ))}
                </div>
              ) : upcomingAppointments.length === 0 ? (
                <Card className="p-4 text-center bg-secondary/30">
                  <Clock className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">
                    Nenhum agendamento próximo
                  </p>
                  <Button 
                    variant="link" 
                    className="text-accent text-sm mt-1 p-0 h-auto"
                    onClick={() => handleNavigate("/client/home")}
                  >
                    Agendar agora
                  </Button>
                </Card>
              ) : (
                <div className="space-y-2">
                  {upcomingAppointments.map((appointment) => (
                    <Card 
                      key={appointment.id} 
                      className="p-3 hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => handleNavigate("/client/bookings")}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-navy/10 rounded-lg flex items-center justify-center">
                            <Calendar className="w-5 h-5 text-navy" />
                          </div>
                          <div>
                            <p className="font-medium text-navy text-sm">
                              {appointment.barbershop?.name || "Barbearia"}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {appointment.barber?.name || "Barbeiro"}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-navy text-sm">
                            {appointment.date
                              ? format(new Date(appointment.date), "dd MMM", { locale: ptBR })
                              : ""}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {appointment.start_time}
                          </p>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </section>

            {/* Histórico */}
            <section>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-navy flex items-center gap-2">
                  <History className="w-4 h-4 text-accent" />
                  Histórico
                </h3>
              </div>
              
              {loading ? (
                <div className="space-y-2">
                  {[1, 2].map((i) => (
                    <Card key={i} className="h-12 animate-pulse bg-secondary/50" />
                  ))}
                </div>
              ) : pastAppointments.length === 0 ? (
                <Card className="p-3 text-center bg-secondary/30">
                  <p className="text-sm text-muted-foreground">
                    Nenhum agendamento anterior
                  </p>
                </Card>
              ) : (
                <div className="space-y-2">
                  {pastAppointments.slice(0, 3).map((appointment) => (
                    <Card 
                      key={appointment.id} 
                      className="p-3 bg-secondary/20"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-navy text-sm">
                            {appointment.barbershop?.name || "Barbearia"}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {appointment.date
                              ? format(new Date(appointment.date), "dd/MM/yyyy", { locale: ptBR })
                              : ""}
                          </p>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          appointment.status === "completed" 
                            ? "bg-green-100 text-green-700" 
                            : "bg-red-100 text-red-700"
                        }`}>
                          {appointment.status === "completed" ? "Concluído" : "Cancelado"}
                        </span>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </section>

            <Separator />

            {/* Menu de Navegação */}
            <section className="space-y-2">
              <h3 className="font-semibold text-navy text-sm mb-3">Menu</h3>
              
              <Button 
                variant="ghost" 
                className="w-full justify-start gap-3 h-12 text-navy hover:bg-navy/5"
                onClick={() => handleNavigate("/client/home")}
              >
                <Home className="w-5 h-5 text-accent" />
                <span>Início</span>
              </Button>
              
              <Button 
                variant="ghost" 
                className="w-full justify-start gap-3 h-12 text-navy hover:bg-navy/5"
                onClick={() => handleNavigate("/client/bookings")}
              >
                <Calendar className="w-5 h-5 text-accent" />
                <span>Meus Agendamentos</span>
              </Button>
              
              <Button 
                variant="ghost" 
                className="w-full justify-start gap-3 h-12 text-navy hover:bg-navy/5"
                onClick={() => handleNavigate("/client/favorites")}
              >
                <span className="text-accent">❤️</span>
                <span>Favoritos</span>
              </Button>
              
              <Button 
                variant="ghost" 
                className="w-full justify-start gap-3 h-12 text-navy hover:bg-navy/5"
                onClick={() => handleNavigate("/client/profile")}
              >
                <User className="w-5 h-5 text-accent" />
                <span>Meu Perfil</span>
              </Button>
            </section>
          </div>

          {/* Footer */}
          <div className="border-t p-4">
            <Button 
              variant="outline" 
              className="w-full justify-start gap-3 h-12 text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
              onClick={handleLogout}
            >
              <LogOut className="w-5 h-5" />
              <span>Sair da conta</span>
            </Button>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};