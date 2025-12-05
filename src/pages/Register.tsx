import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { PageTitle } from "@/components/ui/PageTitle";
import { Subtitle } from "@/components/ui/Subtitle";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { toast } from "@/components/ui/use-toast";

import { authApi } from "@/lib/api/auth";

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

  function handleChange(e: any) {
    setForm({ ...form, [e.target.id]: e.target.value });
  }

  async function handleSubmit(e: any) {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      return toast({
        title: "Senhas não coincidem",
        variant: "destructive",
      });
    }

    try {
      let res;

      if (isClient) {
        res = await authApi.registerClient({
          name: form.name,
          email: form.email,
          phone: form.phone,
          cpf: form.cpf,
          gender: form.gender || "n/a",
          password: form.password,
        });

        toast({ title: "Conta criada!", description: "Faça login para continuar." });
        navigate("/login");
        return;
      }

      // 🔥 OWNER → cria e já loga automaticamente
      await authApi.registerOwner({
        name: form.name,
        email: form.email,
        phone: form.phone,
        cpf: form.cpf,
        gender: form.gender || "n/a",
        password: form.password,
      });

      const loginRes = await authApi.login({
        email: form.email,
        password: form.password,
      });

      toast({ title: "Bem-vindo!", description: "Vamos configurar sua barbearia." });

      navigate("/owner/onboarding");

    } catch (err: any) {
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
          <ArrowLeft />
          Voltar
        </Link>

        <Card className="p-8">
          <div className="text-center mb-8">
            <Logo variant="vertical" size="lg" className="mx-auto mb-6" />
            <PageTitle>{isClient ? "Criar conta como Cliente" : "Criar conta como Proprietário"}</PageTitle>
            <Subtitle>{isClient ? "Agende cortes com facilidade" : "Monte sua barbearia"}</Subtitle>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <Input id="name" placeholder="Nome" onChange={handleChange} required />
            <Input id="email" type="email" placeholder="E-mail" onChange={handleChange} required />
            <Input id="phone" placeholder="Telefone" onChange={handleChange} required />
            <Input id="cpf" placeholder="CPF" onChange={handleChange} required />
            <Input id="password" type="password" placeholder="Senha" onChange={handleChange} required />
            <Input id="confirmPassword" type="password" placeholder="Confirmar senha" onChange={handleChange} required />

            <PrimaryButton className="w-full h-12">Criar Conta</PrimaryButton>
          </form>

          <div className="mt-8 text-center">
            Já tem conta? <Link to="/login" className="text-accent font-semibold">Entrar</Link>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Register;
