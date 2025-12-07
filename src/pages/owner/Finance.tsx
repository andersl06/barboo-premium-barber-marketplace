import { Layout } from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { PageTitle } from "@/components/ui/PageTitle";
import { Subtitle } from "@/components/ui/Subtitle";
import { ArrowLeft, DollarSign, Calendar } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { commissionApi } from "@/lib/api/commission";
import { barbershopsApi } from "@/lib/api/barbershops";

const OwnerFinance = () => {
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFinance();
  }, []);

  const loadFinance = async () => {
    try {
      const shop = await barbershopsApi.getMine();
      if (!shop?.id) return;

      const data = await commissionApi.getInvoice(shop.id);
      setInvoice(data);
    } catch (err) {
      console.error("Erro ao carregar finanças:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen p-6">
        <div className="max-w-4xl mx-auto">

          <button
            onClick={() => navigate("/owner/dashboard")}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            Voltar
          </button>

          <PageTitle>Financeiro</PageTitle>
          <Subtitle>Resumo da fatura do mês</Subtitle>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
              {[1, 2].map((i) => (
                <Card key={i} className="h-32 animate-pulse bg-secondary/50" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">

              <Card className="p-6">
                <div className="flex items-center gap-4">
                  <Calendar className="w-8 h-8 text-accent" />
                  <div>
                    <p className="text-sm text-muted-foreground">Mês</p>
                    <p className="text-2xl font-bold">
                      {invoice?.month ?? "—"}
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center gap-4">
                  <DollarSign className="w-8 h-8 text-green-600" />
                  <div>
                    <p className="text-sm text-muted-foreground">Total Comissão</p>
                    <p className="text-2xl font-bold text-green-600">
                      R$ {(invoice?.total_commission ?? 0).toFixed(2)}
                    </p>
                  </div>
                </div>
              </Card>

            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default OwnerFinance;
