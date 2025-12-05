import { Layout } from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { PageTitle } from "@/components/ui/PageTitle";
import { Subtitle } from "@/components/ui/Subtitle";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Store, Phone, MapPin, Camera } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { barbershopsApi } from "@/lib/api/barbershops";
import { toast } from "@/hooks/use-toast";

const BarbershopEdit = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [barbershop, setBarbershop] = useState<any>(null);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    photo_url: "",
  });

  useEffect(() => {
    loadBarbershop();
  }, []);

  const loadBarbershop = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("barboo_user") || "{}");
      if (user.barbershop_id) {
        const data = await barbershopsApi.getById(user.barbershop_id);
        setBarbershop(data);
        setFormData({
          name: data.name || "",
          phone: data.phone || "",
          address: data.address || "",
          photo_url: data.photo_url || "",
        });
      }
    } catch (error) {
      console.error("Erro ao carregar barbearia:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!barbershop?.id) return;

    setLoading(true);
    try {
      await barbershopsApi.update(barbershop.id, formData);
      toast({ title: "Barbearia atualizada com sucesso!" });
      navigate("/owner/dashboard");
    } catch (error: any) {
      toast({ title: error.message || "Erro ao atualizar", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-2xl mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            Voltar
          </button>

          <div className="mb-8">
            <PageTitle className="mb-2">Editar Barbearia</PageTitle>
            <Subtitle>Atualize as informações do seu estabelecimento</Subtitle>
          </div>

          <form onSubmit={handleSubmit}>
            <Card className="p-6 space-y-6">
              {/* Foto */}
              <div>
                <Label className="flex items-center gap-2 mb-2">
                  <Camera className="w-4 h-4" /> Foto da Barbearia
                </Label>
                <Input
                  placeholder="URL da imagem"
                  value={formData.photo_url}
                  onChange={(e) => setFormData({ ...formData, photo_url: e.target.value })}
                />
              </div>

              {/* Nome */}
              <div>
                <Label className="flex items-center gap-2 mb-2">
                  <Store className="w-4 h-4" /> Nome da Barbearia
                </Label>
                <Input
                  placeholder="Ex: Barbearia Premium"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              {/* Telefone */}
              <div>
                <Label className="flex items-center gap-2 mb-2">
                  <Phone className="w-4 h-4" /> Telefone
                </Label>
                <Input
                  placeholder="(00) 00000-0000"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>

              {/* Endereço */}
              <div>
                <Label className="flex items-center gap-2 mb-2">
                  <MapPin className="w-4 h-4" /> Endereço
                </Label>
                <Input
                  placeholder="Rua, número, bairro, cidade"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                />
              </div>

              <PrimaryButton type="submit" className="w-full" disabled={loading}>
                {loading ? "Salvando..." : "Salvar Alterações"}
              </PrimaryButton>
            </Card>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default BarbershopEdit;
