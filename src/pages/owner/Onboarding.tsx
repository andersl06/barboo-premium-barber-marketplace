import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Logo } from "@/components/ui/Logo";
import { PageTitle } from "@/components/ui/PageTitle";
import { Subtitle } from "@/components/ui/Subtitle";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { SecondaryButton } from "@/components/ui/SecondaryButton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/components/ui/use-toast";

import { barbershopsApi } from "@/lib/api/barbershops";
import { barbersApi } from "@/lib/api/barbers";

const DAYS = [
  { id: "monday", label: "Segunda" },
  { id: "tuesday", label: "Terça" },
  { id: "wednesday", label: "Quarta" },
  { id: "thursday", label: "Quinta" },
  { id: "friday", label: "Sexta" },
  { id: "saturday", label: "Sábado" },
  { id: "sunday", label: "Domingo" },
];

const OwnerOnboarding = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // ---------------- STEP 1 — BARBERSHOP DATA ----------------
  const [barbershopData, setBarbershopData] = useState({
    name: "",
    phone: "",
    zipcode: "",
    address: "",
    address_number: "",
    address_complement: "",
    neighborhood: "",
    city: "",
    state: "",
  });

  // Busca CEP
  async function handleCepBlur() {
    const cep = barbershopData.zipcode.replace(/\D/g, "");
    if (cep.length < 8) return;

    try {
      const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await res.json();

      if (data.erro) {
        toast({
          title: "CEP inválido",
          description: "Verifique o CEP informado.",
          variant: "destructive",
        });
        return;
      }

      setBarbershopData((prev) => ({
        ...prev,
        address: data.logradouro || "",
        neighborhood: data.bairro || "",
        city: data.localidade || "",
        state: data.uf || "",
      }));
    } catch {
      toast({
        title: "Erro ao buscar CEP",
        variant: "destructive",
      });
    }
  }

  // ---------------- STEP 2 — SCHEDULE ----------------
  const [schedule, setSchedule] = useState({
    monday: { enabled: true, start: "09:00", end: "18:00" },
    tuesday: { enabled: true, start: "09:00", end: "18:00" },
    wednesday: { enabled: true, start: "09:00", end: "18:00" },
    thursday: { enabled: true, start: "09:00", end: "18:00" },
    friday: { enabled: true, start: "09:00", end: "18:00" },
    saturday: { enabled: true, start: "09:00", end: "14:00" },
    sunday: { enabled: false, start: "09:00", end: "18:00" },
  });

  // ---------------- STEP 3 — FIRST BARBER DATA ----------------
  const [barberData, setBarberData] = useState({
    name: "",
    email: "",
    phone: "",
    cpf: "",
    birth_date: "",
    password: "",
    confirm_password: "",
    bio: "",
  });

  const handleNext = () => {
    if (step === 1) {
      if (!barbershopData.name || !barbershopData.phone || !barbershopData.address) {
        toast({
          title: "Campos obrigatórios",
          description: "Preencha todos os campos para continuar.",
          variant: "destructive",
        });
        return;
      }
    }

    if (step === 3) {
      if (barberData.password && barberData.password !== barberData.confirm_password) {
        toast({
          title: "Senhas diferentes",
          description: "A senha e a confirmação precisam ser iguais.",
          variant: "destructive",
        });
        return;
      }
    }

    setStep(step + 1);
  };

  const handleBack = () => setStep(step - 1);

  // ---------------- STEP 4 — FINISH ----------------
  const handleFinish = async () => {
    setLoading(true);

    try {
      // 1 — Criar barbearia
      const newShop = await barbershopsApi.create({
        ...barbershopData,
        opening_hours: schedule,
        slug: barbershopData.name.toLowerCase().replace(/\s+/g, "-"),
      });

      if (!newShop?.id) throw new Error("Erro ao criar barbearia.");

      const barbershopId = newShop.id;

      // 2 — Vincular owner como barbeiro
      try {
        await barbersApi.linkOwner(barbershopId);
      } catch {
        console.warn("Owner já era barbeiro.");
      }

      // 3 — Criar primeiro barbeiro SE dados completos forem preenchidos
      if (barberData.name && barberData.email && barberData.phone && barberData.password && barberData.cpf && barberData.birth_date) {
        await barbersApi.create(barbershopId, {
          user: {
            name: barberData.name,
            email: barberData.email,
            phone: barberData.phone,
            password: barberData.password,
          },
          profile: {
            document: barberData.cpf,
            birth_date: barberData.birth_date,
            bio: barberData.bio || "",
          },
        });
      }

      toast({
        title: "Sucesso!",
        description: "Sua barbearia foi criada com sucesso.",
      });

      navigate("/owner/dashboard");

    } catch (error: any) {
      toast({
        title: "Erro",
        description: error?.message || "Não foi possível finalizar o onboarding.",
        variant: "destructive",
      });
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <Logo variant="vertical" size="lg" className="mx-auto mb-6" linkTo={null} />
        </div>

        <Card className="p-8 shadow-medium border-border">

          {/* Progress Bar */}
          <div className="flex items-center justify-center gap-2 mb-8">
            {[1, 2, 3, 4].map((s) => (
              <div
                key={s}
                className={`h-2 w-12 rounded-full ${s <= step ? "bg-accent" : "bg-secondary"}`}
              />
            ))}
          </div>

          {/* ---------------- STEP 1 ---------------- */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <PageTitle className="mb-2">Dados da Barbearia</PageTitle>
                <Subtitle>Vamos começar com as informações básicas</Subtitle>
              </div>

              <div className="space-y-4">

                <div>
                  <Label>Nome da Barbearia *</Label>
                  <Input
                    className="h-12"
                    placeholder="Ex: Barbearia Premium"
                    value={barbershopData.name}
                    onChange={(e) => setBarbershopData({ ...barbershopData, name: e.target.value })}
                  />
                </div>

                <div>
                  <Label>Telefone *</Label>
                  <Input
                    className="h-12"
                    placeholder="(11) 98888-8888"
                    value={barbershopData.phone}
                    onChange={(e) => setBarbershopData({ ...barbershopData, phone: e.target.value })}
                  />
                </div>

                <div>
                  <Label>CEP *</Label>
                  <Input
                    className="h-12"
                    placeholder="00000-000"
                    value={barbershopData.zipcode}
                    onChange={(e) => setBarbershopData({ ...barbershopData, zipcode: e.target.value })}
                    onBlur={handleCepBlur}
                  />
                </div>

                <div>
                  <Label>Endereço *</Label>
                  <Input
                    className="h-12"
                    placeholder="Rua"
                    value={barbershopData.address}
                    onChange={(e) => setBarbershopData({ ...barbershopData, address: e.target.value })}
                  />
                </div>

                <div>
                  <Label>Número *</Label>
                  <Input
                    className="h-12"
                    placeholder="123"
                    value={barbershopData.address_number}
                    onChange={(e) => setBarbershopData({ ...barbershopData, address_number: e.target.value })}
                  />
                </div>

                <div>
                  <Label>Complemento</Label>
                  <Input
                    className="h-12"
                    placeholder="Apto, bloco, sala..."
                    value={barbershopData.address_complement}
                    onChange={(e) => setBarbershopData({ ...barbershopData, address_complement: e.target.value })}
                  />
                </div>

                <div>
                  <Label>Bairro *</Label>
                  <Input
                    className="h-12"
                    placeholder="Centro"
                    value={barbershopData.neighborhood}
                    onChange={(e) => setBarbershopData({ ...barbershopData, neighborhood: e.target.value })}
                  />
                </div>

                <div>
                  <Label>Cidade *</Label>
                  <Input
                    className="h-12"
                    placeholder="São Paulo"
                    value={barbershopData.city}
                    onChange={(e) => setBarbershopData({ ...barbershopData, city: e.target.value })}
                  />
                </div>

                <div>
                  <Label>Estado *</Label>
                  <Input
                    className="h-12"
                    placeholder="SP"
                    value={barbershopData.state}
                    onChange={(e) => setBarbershopData({ ...barbershopData, state: e.target.value })}
                  />
                </div>

              </div>

              <PrimaryButton onClick={handleNext} className="w-full h-12">
                Continuar <ArrowRight className="ml-2 w-5 h-5" />
              </PrimaryButton>
            </div>
          )}

          {/* ---------------- STEP 2 ---------------- */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <PageTitle className="mb-2">Horários de Funcionamento</PageTitle>
                <Subtitle>Defina quando sua barbearia estará aberta</Subtitle>
              </div>

              <div className="space-y-4">
                {DAYS.map((day) => (
                  <div key={day.id} className="flex items-center gap-4">
                    <Checkbox
                      id={day.id}
                      checked={schedule[day.id].enabled}
                      onCheckedChange={(checked) =>
                        setSchedule({
                          ...schedule,
                          [day.id]: { ...schedule[day.id], enabled: !!checked },
                        })
                      }
                    />
                    <Label htmlFor={day.id} className="w-24">{day.label}</Label>

                    {schedule[day.id].enabled && (
                      <div className="flex items-center gap-2 flex-1">
                        <Input
                          type="time"
                          className="h-10"
                          value={schedule[day.id].start}
                          onChange={(e) =>
                            setSchedule({
                              ...schedule,
                              [day.id]: { ...schedule[day.id], start: e.target.value },
                            })
                          }
                        />
                        <span className="text-muted-foreground">às</span>
                        <Input
                          type="time"
                          className="h-10"
                          value={schedule[day.id].end}
                          onChange={(e) =>
                            setSchedule({
                              ...schedule,
                              [day.id]: { ...schedule[day.id], end: e.target.value },
                            })
                          }
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex gap-3">
                <SecondaryButton onClick={handleBack} className="flex-1 h-12">
                  <ArrowLeft className="mr-2 w-5 h-5" /> Voltar
                </SecondaryButton>
                <PrimaryButton onClick={handleNext} className="flex-1 h-12">
                  Continuar <ArrowRight className="ml-2 w-5 h-5" />
                </PrimaryButton>
              </div>
            </div>
          )}

          {/* ---------------- STEP 3 ---------------- */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <PageTitle className="mb-2">Adicionar Barbeiro</PageTitle>
                <Subtitle>Cadastre seu primeiro barbeiro (opcional)</Subtitle>
              </div>

              <div className="space-y-4">

                <div>
                  <Label>Nome do Barbeiro</Label>
                  <Input
                    className="h-12"
                    placeholder="Ex: João Silva"
                    value={barberData.name}
                    onChange={(e) => setBarberData({ ...barberData, name: e.target.value })}
                  />
                </div>

                <div>
                  <Label>E-mail</Label>
                  <Input
                    className="h-12"
                    type="email"
                    placeholder="joao@email.com"
                    value={barberData.email}
                    onChange={(e) => setBarberData({ ...barberData, email: e.target.value })}
                  />
                </div>

                <div>
                  <Label>Telefone</Label>
                  <Input
                    className="h-12"
                    placeholder="(11) 98888-8888"
                    value={barberData.phone}
                    onChange={(e) => setBarberData({ ...barberData, phone: e.target.value })}
                  />
                </div>

                <div>
                  <Label>CPF</Label>
                  <Input
                    className="h-12"
                    placeholder="000.000.000-00"
                    value={barberData.cpf}
                    onChange={(e) => setBarberData({ ...barberData, cpf: e.target.value })}
                  />
                </div>

                <div>
                  <Label>Data de Nascimento</Label>
                  <Input
                    className="h-12"
                    type="date"
                    value={barberData.birth_date}
                    onChange={(e) => setBarberData({ ...barberData, birth_date: e.target.value })}
                  />
                </div>

                <div>
                  <Label>Senha</Label>
                  <Input
                    className="h-12"
                    type="password"
                    value={barberData.password}
                    onChange={(e) => setBarberData({ ...barberData, password: e.target.value })}
                  />
                </div>

                <div>
                  <Label>Confirmar Senha</Label>
                  <Input
                    className="h-12"
                    type="password"
                    value={barberData.confirm_password}
                    onChange={(e) =>
                      setBarberData({ ...barberData, confirm_password: e.target.value })
                    }
                  />
                </div>

                <div>
                  <Label>Bio (opcional)</Label>
                  <Input
                    className="h-12"
                    placeholder="Ex: Apaixonado por cortes clássicos"
                    value={barberData.bio}
                    onChange={(e) => setBarberData({ ...barberData, bio: e.target.value })}
                  />
                </div>

              </div>

              <div className="flex gap-3">
                <SecondaryButton onClick={handleBack} className="flex-1 h-12">
                  <ArrowLeft className="mr-2 w-5 h-5" /> Voltar
                </SecondaryButton>
                <PrimaryButton onClick={handleNext} className="flex-1 h-12">
                  Continuar <ArrowRight className="ml-2 w-5 h-5" />
                </PrimaryButton>
              </div>
            </div>
          )}

          {/* ---------------- STEP 4 ---------------- */}
          {step === 4 && (
            <div className="space-y-6 text-center">
              <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-10 h-10 text-accent" />
              </div>

              <PageTitle className="mb-2">Sua barbearia está pronta!</PageTitle>
              <Subtitle>
                Agora você pode gerenciar sua equipe, agenda e serviços em um só lugar.
              </Subtitle>

              <div className="pt-4">
                <PrimaryButton
                  onClick={handleFinish}
                  disabled={loading}
                  className="w-full h-12"
                >
                  {loading ? "Finalizando..." : "Ir para o Dashboard"}
                </PrimaryButton>
              </div>
            </div>
          )}

        </Card>
      </div>
    </div>
  );
};

export default OwnerOnboarding;
