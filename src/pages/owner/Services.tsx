import { Layout } from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { PageTitle } from "@/components/ui/PageTitle";
import { Subtitle } from "@/components/ui/Subtitle";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { SecondaryButton } from "@/components/ui/SecondaryButton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ArrowLeft, Plus, Scissors, Clock, DollarSign, Edit2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { servicesApi } from "@/lib/api/services";
import { toast } from "@/hooks/use-toast";

const OwnerServices = () => {
  const navigate = useNavigate();
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<any>(null);
  const [barbershopId, setBarbershopId] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    duration: "",
  });

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("barboo_user") || "{}");
    if (user.barbershop_id) {
      setBarbershopId(user.barbershop_id);
      loadServices(user.barbershop_id);
    }
  }, []);

  const loadServices = async (id: number) => {
    try {
      const data = await servicesApi.list(id);
      setServices(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Erro ao carregar serviços:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!barbershopId) return;

    try {
      const payload = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        duration: parseInt(formData.duration),
        barbershop_id: barbershopId,
      };

      if (editingService) {
        await servicesApi.update(editingService.id, payload);
        toast({ title: "Serviço atualizado!" });
      } else {
        await servicesApi.create(payload);
        toast({ title: "Serviço criado!" });
      }

      setDialogOpen(false);
      setEditingService(null);
      setFormData({ name: "", description: "", price: "", duration: "" });
      loadServices(barbershopId);
    } catch (error: any) {
      toast({ title: error.message || "Erro ao salvar", variant: "destructive" });
    }
  };

  const openEditDialog = (service: any) => {
    setEditingService(service);
    setFormData({
      name: service.name || "",
      description: service.description || "",
      price: service.price?.toString() || "",
      duration: service.duration?.toString() || "",
    });
    setDialogOpen(true);
  };

  const openNewDialog = () => {
    setEditingService(null);
    setFormData({ name: "", description: "", price: "", duration: "" });
    setDialogOpen(true);
  };

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

          <div className="flex justify-between items-start mb-8">
            <div>
              <PageTitle className="mb-2">Serviços</PageTitle>
              <Subtitle>Gerencie os serviços oferecidos</Subtitle>
            </div>

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <PrimaryButton onClick={openNewDialog}>
                  <Plus className="w-4 h-4 mr-2" />
                  Novo Serviço
                </PrimaryButton>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {editingService ? "Editar Serviço" : "Novo Serviço"}
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                  <div>
                    <Label>Nome do Serviço</Label>
                    <Input
                      placeholder="Ex: Corte Degradê"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label>Descrição</Label>
                    <Input
                      placeholder="Descrição do serviço"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Preço (R$)</Label>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="50.00"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label>Duração (min)</Label>
                      <Input
                        type="number"
                        placeholder="30"
                        value={formData.duration}
                        onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <PrimaryButton type="submit" className="w-full">
                    {editingService ? "Salvar" : "Criar Serviço"}
                  </PrimaryButton>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="h-24 animate-pulse bg-secondary/50" />
              ))}
            </div>
          ) : services.length === 0 ? (
            <Card className="p-12 text-center">
              <Scissors className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-bold text-navy mb-2">Nenhum serviço cadastrado</h3>
              <p className="text-muted-foreground mb-6">
                Adicione os serviços que sua barbearia oferece.
              </p>
              <PrimaryButton onClick={openNewDialog}>
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Primeiro Serviço
              </PrimaryButton>
            </Card>
          ) : (
            <div className="space-y-4">
              {services.map((service) => (
                <Card key={service.id} className="p-5 hover:shadow-medium transition-smooth">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-bold text-navy font-manrope mb-1">{service.name}</h3>
                      {service.description && (
                        <p className="text-sm text-muted-foreground mb-2">{service.description}</p>
                      )}
                      <div className="flex gap-4 text-sm">
                        <span className="flex items-center gap-1 text-accent">
                          <DollarSign className="w-4 h-4" />
                          R$ {service.price?.toFixed(2)}
                        </span>
                        <span className="flex items-center gap-1 text-muted-foreground">
                          <Clock className="w-4 h-4" />
                          {service.duration} min
                        </span>
                      </div>
                    </div>
                    <SecondaryButton size="sm" onClick={() => openEditDialog(service)}>
                      <Edit2 className="w-4 h-4" />
                    </SecondaryButton>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default OwnerServices;
