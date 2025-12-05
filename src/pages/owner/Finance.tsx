import { Layout } from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { PageTitle } from "@/components/ui/PageTitle";
import { Subtitle } from "@/components/ui/Subtitle";
import { ArrowLeft, DollarSign, TrendingUp, Users, Calendar } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { commissionApi } from "@/lib/api/commission";

const OwnerFinance = () => {
  const navigate = useNavigate();
  const [finance, setFinance] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFinance();
  }, []);

  const loadFinance = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("barboo_user") || "{}");
      if (user.barbershop_id) {
        const data = await commissionApi.getByBarbershop(user.barbershop_id);
        setFinance(data);
      }
    } catch (error) {
      console.error("Erro ao carregar finanças:", error);
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    {
      label: "Total de Agendamentos",
      value: finance?.total_bookings || 0,
      icon: Calendar,
      color: "text-navy",
      bgColor: "bg-navy/10",
    },
    {
      label: "Receita Total",
      value: `R$ ${(finance?.total_revenue || 0).toFixed(2)}`,
      icon: DollarSign,
      color: "text-accent",
      bgColor: "bg-accent/10",
    },
    {
      label: "Taxa Barboo",
      value: `R$ ${(finance?.barboo_fee_total || 0).toFixed(2)}`,
      icon: TrendingUp,
      color: "text-muted-foreground",
      bgColor: "bg-secondary",
    },
    {
      label: "Ganhos dos Barbeiros",
      value: `R$ ${(finance?.barber_earnings || 0).toFixed(2)}`,
      icon: Users,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => navigate("/owner/dashboard")}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            Voltar
          </button>

          <div className="mb-8">
            <PageTitle className="mb-2">Finanças</PageTitle>
            <Subtitle>Acompanhe a receita e comissões da barbearia</Subtitle>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <Card key={i} className="h-32 animate-pulse bg-secondary/50" />
              ))}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                {stats.map((stat, index) => (
                  <Card key={index} className="p-6 hover:shadow-medium transition-smooth">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                        <stat.icon className={`w-6 h-6 ${stat.color}`} />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">{stat.label}</p>
                        <p className={`text-2xl font-bold font-manrope ${stat.color}`}>
                          {stat.value}
                        </p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Info sobre taxa */}
              <Card className="p-6 bg-secondary/30">
                <h3 className="font-bold text-navy font-manrope mb-3">Como funciona a taxa Barboo?</h3>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>• A taxa Barboo é de 5% sobre o valor do serviço</p>
                  <p>• Essa taxa é cobrada do cliente, não do barbeiro</p>
                  <p>• O barbeiro recebe 100% do valor do serviço</p>
                  <p>• A taxa ajuda a manter a plataforma funcionando</p>
                </div>
              </Card>
            </>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default OwnerFinance;
