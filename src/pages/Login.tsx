import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import { Logo } from "@/components/ui/Logo";
import { PageTitle } from "@/components/ui/PageTitle";
import { Subtitle } from "@/components/ui/Subtitle";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { toast } from "@/components/ui/use-toast";

import { authApi } from "@/lib/api/auth";
import { saveAuthSession } from "@/lib/auth/session";
import { redirectByRole } from "@/lib/auth/redirect";

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await authApi.login(formData);

      // Salva token(s)
      saveAuthSession(res);

      // fluxo must_change_password
      if (res.must_change_password) {
        return navigate("/barber/change-password");
      }

      // redirecionamento inteligente por role
      await redirectByRole(res.user, navigate);

    } catch (err) {
      toast({
        title: "Erro ao entrar",
        description: err?.message || "Verifique os dados.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full">

        <Link to="/" className="inline-flex items-center gap-2 mb-8">
          <ArrowLeft /> Voltar
        </Link>

        <Card className="p-8">
          <Logo variant="vertical" size="md" className="mx-auto mb-4" />

          <PageTitle>Entrar no Barboo</PageTitle>
          <Subtitle>Acesso rápido e seguro</Subtitle>

          <form className="space-y-4 mt-6" onSubmit={handleLogin}>
            <Input
              id="email"
              type="email"
              placeholder="E-mail"
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />

            <Input
              id="password"
              type="password"
              placeholder="Senha"
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />

            <PrimaryButton className="w-full h-12" disabled={loading}>
              {loading ? "Entrando..." : "Entrar"}
            </PrimaryButton>
          </form>

          <p className="text-center mt-6">
            Não tem conta?{" "}
            <Link to="/register-type" className="text-accent font-semibold">
              Criar agora
            </Link>
          </p>
        </Card>
      </div>
    </div>
  );
};

export default Login;
