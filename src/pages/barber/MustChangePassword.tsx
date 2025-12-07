import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { toast } from "@/components/ui/use-toast";
import { api } from "../../lib/api";

const MustChangePassword = () => {
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!password || !confirm) {
      toast({ title: "Preencha todos os campos", variant: "destructive" });
      return;
    }

    if (password !== confirm) {
      toast({
        title: "As senhas não coincidem",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);

      await api.patch("/auth/change-password", { newPassword: password });

      toast({
        title: "Senha alterada com sucesso!",
        description: "Faça login novamente.",
      });

      navigate("/login");
    } catch (err: any) {
      toast({
        title: "Erro ao alterar senha",
        description: err?.message || "Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-background">
      <Card className="p-8 w-full max-w-md shadow-lg border-border">
        <h1 className="text-2xl font-bold mb-2">Defina sua nova senha</h1>
        <p className="text-muted-foreground mb-6">
          Para continuar usando o sistema, você precisa criar uma nova senha.
        </p>

        <div className="space-y-4">
          <div>
            <Label>Nova senha</Label>
            <Input
              type="password"
              placeholder="Digite sua nova senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div>
            <Label>Confirmar nova senha</Label>
            <Input
              type="password"
              placeholder="Repita sua nova senha"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
            />
          </div>

          <PrimaryButton onClick={handleSubmit} disabled={loading} className="w-full h-12">
            {loading ? "Salvando..." : "Alterar Senha"}
          </PrimaryButton>
        </div>
      </Card>
    </div>
  );
};

export default MustChangePassword;
