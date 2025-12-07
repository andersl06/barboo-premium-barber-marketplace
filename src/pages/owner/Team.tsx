import { Layout } from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { PageTitle } from "@/components/ui/PageTitle";
import { Subtitle } from "@/components/ui/Subtitle";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ArrowLeft, Plus, Users, Mail, Phone } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { barbersApi } from "@/lib/api/barbers";
import { barbershopsApi } from "@/lib/api/barbershops";
import { toast } from "@/hooks/use-toast";

const OwnerTeam = () => {
  const navigate = useNavigate();
  const [barbers, setBarbers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [barbershopId, setBarbershopId] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    cpf: "",
    birth_date: "",
    bio: "",
    password: "",
  });

  useEffect(() => {
    loadBarbershopAndTeam();
  }, []);

  const loadBarbershopAndTeam = async () => {
    try {
      const shop = await barbershopsApi.getMine();
      if (!shop?.id) return;

      setBarbershopId(shop.id);
      loadBarbers(shop.id);
    } catch (err) {
      console.error(err);
    }
  };

  const loadBarbers = async (id: number) => {
    try {
      const data = await barbersApi.list(id);
      setBarbers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Erro ao carregar barbeiros:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!barbershopId) return;

    if (!formData.password) {
      toast({
        title: "Senha obrigatória",
        description: "Para criar o barbeiro é preciso definir uma senha.",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);
    try {
      await barbersApi.create(barbershopId, {
        user: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          cpf: formData.cpf,
          gender: "n/a",
          password: formData.password,
        },
        profile: {
          bio: formData.bio || "",
        },
      });

      toast({ title: "Barbeiro adicionado com sucesso!" });
      setDialogOpen(false);
      setFormData({
        name: "",
        email: "",
        phone: "",
        cpf: "",
        birth_date: "",
        bio: "",
        password: "",
      });
      loadBarbers(barbershopId);
    } catch (error: any) {
      toast({
        title: "Erro ao adicionar barbeiro",
        description: error?.message,
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
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
              <PageTitle className="mb-2">Equipe</PageTitle>
              <Subtitle>Gerencie os barbeiros da sua barbearia</Subtitle>
            </div>

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <PrimaryButton>
                  <Plus className="w-4 h-4 mr-2" />
                  Novo Barbeiro
                </PrimaryButton>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Adicionar Barbeiro</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                  <div>
                    <Label>Nome</Label>
                    <Input
                      required
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                    />
                  </div>

                  <div>
                    <Label>E-mail</Label>
                    <Input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                    />
                  </div>

                  <div>
                    <Label>Telefone</Label>
                    <Input
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                    />
                  </div>

                  <div>
                    <Label>CPF</Label>
                    <Input
                      value={formData.cpf}
                      onChange={(e) =>
                        setFormData({ ...formData, cpf: e.target.value })
                      }
                    />
                  </div>

                  <div>
                    <Label>Bio (opcional)</Label>
                    <Input
                      value={formData.bio}
                      onChange={(e) =>
                        setFormData({ ...formData, bio: e.target.value })
                      }
                    />
                  </div>

                  <div>
                    <Label>Senha</Label>
                    <Input
                      type="password"
                      required
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                    />
                  </div>

                  <PrimaryButton disabled={submitting} className="w-full">
                    {submitting ? "Criando..." : "Criar Barbeiro"}
                  </PrimaryButton>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {/* LISTAGEM */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <Card key={i} className="h-32 animate-pulse bg-secondary/50" />
              ))}
            </div>
          ) : barbers.length === 0 ? (
            <Card className="p-12 text-center">
              <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-bold text-navy mb-2">
                Nenhum barbeiro cadastrado
              </h3>
              <p className="text-muted-foreground mb-6">
                Adicione os profissionais da sua equipe.
              </p>
              <PrimaryButton onClick={() => setDialogOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Barbeiro
              </PrimaryButton>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {barbers.map((b) => (
                <Card key={b.id} className="p-5 hover:shadow-medium transition-smooth">
                  <div className="flex items-center gap-4">
                    <Avatar className="w-14 h-14">
                      <AvatarImage src={b.avatar_url} />
                      <AvatarFallback className="bg-accent/10 text-accent text-lg">
                        {b.name?.charAt(0)?.toUpperCase() || "B"}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1">
                      <h3 className="font-bold text-navy font-manrope">{b.name}</h3>

                      {b.email && (
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          {b.email}
                        </p>
                      )}

                      {b.phone && (
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          {b.phone}
                        </p>
                      )}
                    </div>
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

export default OwnerTeam;
