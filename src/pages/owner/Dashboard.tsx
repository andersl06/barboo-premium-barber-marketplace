import { Layout } from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { PageTitle } from "@/components/ui/PageTitle";
import { Subtitle } from "@/components/ui/Subtitle";
import { Users, Calendar, DollarSign, Settings } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { barbershopsApi } from "@/lib/api/barbershops";
import { barbersApi } from "@/lib/api/barbers";
import { commissionApi } from "@/lib/api/commission";

const OwnerDashboard = () => {
  const navigate = useNavigate();

  const [barbershop, setBarbershop] = useState<any>(null);
  const [barbers, setBarbers] = useState<any[]>([]);
  const [commission, setCommission] = useState<any>({
    total_bookings: 0,
    total_earnings: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      // 1 — Verifica a barbearia do owner
      const shop = await barbershopsApi.getMine();

      if (!shop || !shop.id) {
        navigate("/owner/onboarding");
        return;
      }

      setBarbershop(shop);

      // 2 — Buscar barbeiros corretamente
      let barbersData = [];
      try {
        barbersData = await barbersApi.listByBarbershop(shop.id); 
      } catch (err) {
        console.warn("Erro ao carregar barbeiros:", err);
      }

      setBarbers(Array.isArray(barbersData) ? barbersData : []);

      // 3 — Buscar financeiro
      try {
        const commissionData = await commissionApi.getByBarbershop(shop.id);
        setCommission(commissionData || { total_bookings: 0, total_earnings: 0 });
      } catch (err) {
        console.warn("Erro ao carregar comissão:", err);
      }

    } catch (err) {
      console.error("Erro ao carregar dashboard:", err);
      navigate("/owner/onboarding");
    } finally {
      setLoading(false);
    }
  };

  const stats = {
    totalBookings: commission?.total_bookings || 0,
    totalBarbers: barbers?.length || 0,
    earnings: commission?.total_earnings || 0,
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-pulse text-muted-foreground">Carregando...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <PageTitle>{barbershop?.name}</PageTitle>
            <Subtitle>Gerencie barbeiros, horários e agendamentos</Subtitle>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="p-6">
              <div className="flex items-center gap-4">
                <Calendar className="w-6 h-6 text-accent" />
                <div>
                  <p className="text-sm text-muted-foreground">Agendamentos</p>
                  <p className="text-3xl font-bold">{stats.totalBookings}</p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-4">
                <Users className="w-6 h-6 text-accent" />
                <div>
                  <p className="text-sm text-muted-foreground">Barbeiros</p>
                  <p className="text-3xl font-bold">{stats.totalBarbers}</p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-4">
                <DollarSign className="w-6 h-6 text-green-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Ganhos Totais</p>
                  <p className="text-3xl font-bold text-green-600">
                    R$ {stats.earnings.toFixed(2)}
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Ações */}
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4">Ações Rápidas</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              <button
                onClick={() => navigate("/owner/team")}
                className="p-4 border-2 border-border rounded-lg hover:border-accent hover:shadow-lg transition-smooth text-left"
              >
                <Users className="w-6 h-6 text-accent mb-2" />
                <p className="font-semibold">Gerenciar Barbeiros</p>
                <p className="text-sm text-muted-foreground">
                  Adicionar ou editar equipe
                </p>
              </button>

              <button
                onClick={() => navigate("/owner/availability")}
                className="p-4 border-2 border-border rounded-lg hover:border-accent hover:shadow-lg transition-smooth text-left"
              >
                <Calendar className="w-6 h-6 text-accent mb-2" />
                <p className="font-semibold">Disponibilidade</p>
                <p className="text-sm text-muted-foreground">
                  Horários de funcionamento
                </p>
              </button>

              <button
                onClick={() => navigate("/owner/finance")}
                className="p-4 border-2 border-border rounded-lg hover:border-accent hover:shadow-lg transition-smooth text-left"
              >
                <DollarSign className="w-6 h-6 text-accent mb-2" />
                <p className="font-semibold">Financeiro</p>
                <p className="text-sm text-muted-foreground">
                  Ganhos e comissões
                </p>
              </button>

              <button
                onClick={() => navigate("/owner/barbershop/edit")}
                className="p-4 border-2 border-border rounded-lg hover:border-accent hover:shadow-lg transition-smooth text-left"
              >
                <Settings className="w-6 h-6 text-accent mb-2" />
                <p className="font-semibold">Configurações</p>
                <p className="text-sm text-muted-foreground">
                  Dados da barbearia
                </p>
              </button>

            </div>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default OwnerDashboard;
