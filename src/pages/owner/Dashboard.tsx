import { Layout } from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { PageTitle } from "@/components/ui/PageTitle";
import { Subtitle } from "@/components/ui/Subtitle";
import { Users, Calendar, DollarSign, Settings } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { useAuthInfo } from "@/lib/auth/useAuthInfo";
import { barbershopsApi } from "@/lib/api/barbershops";
import { barbersApi } from "@/lib/api/barbers";
import { commissionApi } from "@/lib/api/commission";

const OwnerDashboard = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuthInfo();

  const [barbershop, setBarbershop] = useState<any>(null);
  const [barbers, setBarbers] = useState<any[]>([]);
  const [commission, setCommission] = useState<any>({
    total_commission: 0,
    status: "",
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && user) {
      loadDashboard();
    }
  }, [authLoading, user]);

  const loadDashboard = async () => {
    try {
      // 1 — Buscar barbearia vinculada ao owner
      const shop = await barbershopsApi.getMine();

      if (!shop || !shop.id) {
        navigate("/owner/onboarding");
        return;
      }

      setBarbershop(shop);

      // 2 — Buscar equipe corretamente
      let barbersData = [];
      try {
        barbersData = await barbersApi.list(shop.id);
      } catch (err) {
        console.warn("Erro ao carregar barbeiros:", err);
      }

      setBarbers(Array.isArray(barbersData) ? barbersData : []);

      // 3 — Buscar financeiro (invoice do mês atual)
      try {
        const invoice = await commissionApi.generateInvoice(shop.id);
        setCommission(invoice || { total_commission: 0 });
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

  if (loading || authLoading) {
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
            <Subtitle>Gerencie barbeiros, horários e finanças</Subtitle>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="p-6">
              <div className="flex items-center gap-4">
                <Calendar className="w-6 h-6 text-accent" />
                <div>
                  <p className="text-sm text-muted-foreground">Agendamentos (mês)</p>
                  <p className="text-3xl font-bold">{commission?.total_bookings ?? 0}</p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-4">
                <Users className="w-6 h-6 text-accent" />
                <div>
                  <p className="text-sm text-muted-foreground">Barbeiros</p>
                  <p className="text-3xl font-bold">{barbers?.length}</p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-4">
                <DollarSign className="w-6 h-6 text-green-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Ganhos Totais</p>
                  <p className="text-3xl font-bold text-green-600">
                    R$ {(commission?.total_commission ?? 0).toFixed(2)}
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Actions */}
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4">Ações Rápidas</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={() => navigate("/owner/team")}
                className="p-4 border-2 border-border rounded-lg hover:border-accent hover:shadow-lg transition text-left"
              >
                <Users className="w-6 h-6 text-accent mb-2" />
                <p className="font-semibold">Gerenciar Barbeiros</p>
                <p className="text-sm text-muted-foreground">
                  Adicionar ou editar equipe
                </p>
              </button>

              <button
                onClick={() => navigate("/owner/availability")}
                className="p-4 border-2 border-border rounded-lg hover:border-accent hover:shadow-lg transition text-left"
              >
                <Calendar className="w-6 h-6 text-accent mb-2" />
                <p className="font-semibold">Disponibilidade</p>
                <p className="text-sm text-muted-foreground">
                  Horários de funcionamento
                </p>
              </button>

              <button
                onClick={() => navigate("/owner/finance")}
                className="p-4 border-2 border-border rounded-lg hover:border-accent hover:shadow-lg transition text-left"
              >
                <DollarSign className="w-6 h-6 text-accent mb-2" />
                <p className="font-semibold">Financeiro</p>
                <p className="text-sm text-muted-foreground">
                  Ganhos e comissões
                </p>
              </button>

              <button
                onClick={() => navigate("/owner/barbershop/edit")}
                className="p-4 border-2 border-border rounded-lg hover:border-accent hover:shadow-lg transition text-left"
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
