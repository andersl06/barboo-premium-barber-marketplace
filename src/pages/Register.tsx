import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import { Logo } from "@/components/ui/Logo";
import { PageTitle } from "@/components/ui/PageTitle";
import { Subtitle } from "@/components/ui/Subtitle";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { toast } from "@/components/ui/use-toast";

import { authApi } from "@/lib/api/auth";
import { saveAuthSession } from "@/lib/auth/session";
import { redirectByRole } from "@/lib/auth/redirect";
import { saveOwnerDraft } from "@/lib/auth/ownerDraft";

const Register = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const type = searchParams.get("type") || "client";
  const isClient = type === "client";

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    cpf: "",
    gender: "",
    password: "",
    confirmPassword: "",
  });

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      return toast({
        title: "Senhas não coincidem",
        variant: "destructive",
      });
    }

    try {
      // --- CRIA O USUÁRIO ---
      if (isClient) {
        await authApi.registerClient({
          name: form.name,
          email: form.email,
          phone: form.phone,
          cpf: form.cpf,
          gender: form.gender || "n/a",
          password: form.password,
        });
      } else {
        await authApi.registerOwner({
          name: form.name,
          email: form.email,
          phone: form.phone,
          cpf: form.cpf,
          gender: form.gender || "n/a",
          password: form.password,
        });

        // salva dados do owner para onboarding
        saveOwnerDraft(form);
      }

      // --- LOGIN AUTOMÁTICO ---
      const loginRes = await authApi.login({
        email: form.email,
        password: form.password,
      });

      saveAuthSession(loginRes);

      toast({ title: "Conta criada!", description: "Bem-vindo ao Barboo" });

      // fluxo must_change_password
      if (loginRes.must_change_password) {
        return navigate("/barber/change-password");
      }

      // Redireciona baseado no role real
      await redirectByRole(loginRes.user, navigate);

    } catch (err) {
      toast({
        title: "Erro ao registrar",
        description: err?.message || "Tente novamente.",
        variant: "destructive",
      });
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">

        <Link to="/register-type" className="inline-flex items-center gap-2 text-navy mb-8">
          <ArrowLeft /> Voltar
        </Link>

        <Card className="p-8">
          <div className="text-center mb-8">
            <Logo variant="vertical" size="lg" className="mx-auto mb-6" />
            <PageTitle>
              {isClient ? "Criar conta como Cliente" : "Criar conta como Proprietário"}
            </PageTitle>
            <Subtitle>
              {isClient ? "Agende cortes com facilidade" : "Monte sua barbearia com o Barboo"}
            </Subtitle>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <Input id="name" placeholder="Nome" onChange={handleChange} required />
            <Input id="email" type="email" placeholder="E-mail" onChange={handleChange} required />
            <Input id="phone" placeholder="Telefone" onChange={handleChange} required />
            <Input id="cpf" placeholder="CPF" onChange={handleChange} required />
            <Input id="password" type="password" placeholder="Senha" onChange={handleChange} required />
            <Input id="confirmPassword" type="password" placeholder="Confirmar senha" onChange={handleChange} required />

            <PrimaryButton className="w-full h-12">
              Criar Conta
            </PrimaryButton>
          </form>

          <div className="mt-8 text-center">
            Já tem conta?{" "}
            <Link to="/login" className="text-accent font-semibold">
              Entrar
            </Link>
          </div>
        </Card>

      </div>
    </div>
  );
};

export default Register;
