import { Layout } from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { PageTitle } from "@/components/ui/PageTitle";
import { Subtitle } from "@/components/ui/Subtitle";
import { Calendar, Clock, User } from "lucide-react";

const BarberHome = () => {
  // Dados mockados - substituir por dados reais da API
  const todayAppointments = [
    {
      id: "1",
      clientName: "Carlos Silva",
      service: "Corte + Barba",
      time: "09:00",
      status: "confirmed",
    },
    {
      id: "2",
      clientName: "João Santos",
      service: "Corte Simples",
      time: "10:30",
      status: "confirmed",
    },
    {
      id: "3",
      clientName: "Pedro Costa",
      service: "Barba",
      time: "14:00",
      status: "pending",
    },
  ];

  const stats = {
    todayTotal: todayAppointments.length,
    completed: 1,
    pending: 2,
  };

  return (
    <Layout>
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <PageTitle className="mb-2">Sua agenda de hoje</PageTitle>
            <Subtitle>Mantenha seus clientes organizados e seu dia mais leve</Subtitle>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <Card className="p-4 text-center">
              <p className="text-2xl font-bold text-navy font-manrope">{stats.todayTotal}</p>
              <p className="text-sm text-muted-foreground">Total Hoje</p>
            </Card>
            <Card className="p-4 text-center">
              <p className="text-2xl font-bold text-accent font-manrope">{stats.completed}</p>
              <p className="text-sm text-muted-foreground">Concluídos</p>
            </Card>
            <Card className="p-4 text-center">
              <p className="text-2xl font-bold text-navy font-manrope">{stats.pending}</p>
              <p className="text-sm text-muted-foreground">Pendentes</p>
            </Card>
          </div>

          {/* Today's Appointments */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <Calendar className="w-5 h-5 text-accent" />
              <h2 className="text-xl font-bold text-navy font-manrope">
                Agendamentos de Hoje
              </h2>
            </div>

            <div className="space-y-4">
              {todayAppointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg hover:shadow-soft transition-smooth"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-navy/10 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-navy" />
                    </div>
                    <div>
                      <p className="font-semibold text-navy">{appointment.clientName}</p>
                      <p className="text-sm text-muted-foreground">{appointment.service}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-2 text-navy font-semibold mb-1">
                      <Clock className="w-4 h-4" />
                      <span>{appointment.time}</span>
                    </div>
                    <span
                      className={`text-xs px-3 py-1 rounded-full ${
                        appointment.status === "confirmed"
                          ? "bg-accent/10 text-accent"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {appointment.status === "confirmed" ? "Confirmado" : "Pendente"}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Empty State */}
            {todayAppointments.length === 0 && (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-10 h-10 text-muted-foreground" />
                </div>
                <p className="text-lg font-semibold text-navy mb-2">Nenhum agendamento hoje</p>
                <p className="text-muted-foreground">
                  Aproveite para atualizar seu perfil ou verificar a agenda futura
                </p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default BarberHome;
