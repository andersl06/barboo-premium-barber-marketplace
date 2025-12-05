import { Layout } from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { PageTitle } from "@/components/ui/PageTitle";
import { Subtitle } from "@/components/ui/Subtitle";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { SecondaryButton } from "@/components/ui/SecondaryButton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, User, Mail, Phone, Lock, LogOut, Star } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { authApi } from "@/lib/api/auth";

const BarberProfile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const [passwordData, setPasswordData] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });

  useEffect(() => {
    const storedUser = localStorage.getItem("barboo_user");
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      setUser(parsed);
      setFormData({
        name: parsed.name || "",
        email: parsed.email || "",
        phone: parsed.phone || "",
      });
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("barboo_token");
    localStorage.removeItem("barboo_user");
    toast({ title: "Logout realizado com sucesso!" });
    navigate("/login");
  };

  const handleChangePassword = async () => {
    if (passwordData.new_password !== passwordData.confirm_password) {
      toast({ title: "As senhas não coincidem", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      await authApi.changePassword({
        current_password: passwordData.current_password,
        new_password: passwordData.new_password,
      });
      toast({ title: "Senha alterada com sucesso!" });
      setIsChangingPassword(false);
      setPasswordData({ current_password: "", new_password: "", confirm_password: "" });
    } catch (error: any) {
      toast({ title: error.message || "Erro ao alterar senha", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-2xl mx-auto">
          <button
            onClick={() => navigate("/barber/dashboard")}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            Voltar
          </button>

          <div className="mb-8">
            <PageTitle className="mb-2">Meu Perfil</PageTitle>
            <Subtitle>Gerencie suas informações pessoais</Subtitle>
          </div>

          {/* Avatar e Info */}
          <Card className="p-6 mb-6">
            <div className="flex items-center gap-4 mb-6">
              <Avatar className="w-20 h-20">
                <AvatarImage src={user?.photo_url} />
                <AvatarFallback className="bg-accent text-accent-foreground text-2xl">
                  {user?.name?.charAt(0)?.toUpperCase() || "B"}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-xl font-bold text-navy font-manrope">{user?.name}</h2>
                <p className="text-muted-foreground">{user?.email}</p>
                {user?.rating && (
                  <div className="flex items-center gap-1 mt-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{user.rating}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label className="flex items-center gap-2 mb-2">
                  <User className="w-4 h-4" /> Nome
                </Label>
                <Input value={formData.name} disabled />
              </div>

              <div>
                <Label className="flex items-center gap-2 mb-2">
                  <Mail className="w-4 h-4" /> E-mail
                </Label>
                <Input value={formData.email} disabled />
              </div>

              <div>
                <Label className="flex items-center gap-2 mb-2">
                  <Phone className="w-4 h-4" /> Telefone
                </Label>
                <Input value={formData.phone} disabled placeholder="Não informado" />
              </div>
            </div>
          </Card>

          {/* Alterar Senha */}
          <Card className="p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-navy font-manrope flex items-center gap-2">
                <Lock className="w-5 h-5" /> Segurança
              </h3>
              <SecondaryButton
                size="sm"
                onClick={() => setIsChangingPassword(!isChangingPassword)}
              >
                {isChangingPassword ? "Cancelar" : "Alterar Senha"}
              </SecondaryButton>
            </div>

            {isChangingPassword && (
              <div className="space-y-4">
                <div>
                  <Label className="mb-2">Senha Atual</Label>
                  <Input
                    type="password"
                    value={passwordData.current_password}
                    onChange={(e) =>
                      setPasswordData({ ...passwordData, current_password: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label className="mb-2">Nova Senha</Label>
                  <Input
                    type="password"
                    value={passwordData.new_password}
                    onChange={(e) =>
                      setPasswordData({ ...passwordData, new_password: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label className="mb-2">Confirmar Nova Senha</Label>
                  <Input
                    type="password"
                    value={passwordData.confirm_password}
                    onChange={(e) =>
                      setPasswordData({ ...passwordData, confirm_password: e.target.value })
                    }
                  />
                </div>
                <PrimaryButton onClick={handleChangePassword} disabled={loading}>
                  {loading ? "Salvando..." : "Salvar Nova Senha"}
                </PrimaryButton>
              </div>
            )}
          </Card>

          {/* Logout */}
          <Card className="p-6">
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 p-4 text-destructive hover:bg-destructive/10 rounded-lg transition-smooth"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-semibold">Sair da conta</span>
            </button>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default BarberProfile;
