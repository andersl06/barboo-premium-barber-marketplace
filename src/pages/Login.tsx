import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { PageTitle } from "@/components/ui/PageTitle";
import { Subtitle } from "@/components/ui/Subtitle";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { toast } from "@/components/ui/use-toast";

import { authApi } from "@/lib/api/auth";
import { barbershopsApi } from "@/lib/api/barbershops";

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: any) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await authApi.login(formData);

      const user = res.user;

      // 1 — Senha temporária
      if (res.must_change_password) {
        navigate("/barber/change-password");
        return;
      }

      // 2 — Cliente
      if (user.role === "client") {
        navigate("/client/home");
        return;
      }

      // 3 — Barbeiro
      if (user.role === "barber") {
        navigate("/barber/agenda");
        return;
      }

      // 4 — OWNER (fluxo mais importante)
      if (user.role === "owner") {
        try {
          const shop = await barbershopsApi.getMine();

          console.log("SHOP DO OWNER:", shop);

          if (shop && shop.id) {
            navigate("/owner/dashboard");
            return;
          }
        } catch (err) {
          console.log("Owner ainda não tem barbearia.");
        }

        navigate("/owner/onboarding");
        return;
      }

      // fallback
      navigate("/client/home");

    } catch (err: any) {
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
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full">

        <Link to="/" className="inline-flex items-center gap-2 mb-6">
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
