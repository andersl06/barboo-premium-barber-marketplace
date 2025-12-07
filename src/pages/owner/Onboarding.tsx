import { useEffect, useState } from "react";
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
import { usersApi } from "@/lib/api/users";
import { getOwnerDraft, clearOwnerDraft } from "@/lib/auth/ownerDraft";

// Dias de funcionamento
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

  const ownerDraft = getOwnerDraft();

  // ---------------- STEP 1 — BARBERSHOP DATA ----------------
  const [barbershopData, setBarbershopData] = useState({
    name: ownerDraft?.shopName || "",
    phone: ownerDraft?.phone || "",
    zipcode: ownerDraft?.zipcode || "",
    address: ownerDraft?.address || "",
    address_number: ownerDraft?.address_number || "",
    address_complement: ownerDraft?.address_complement || "",
    neighborhood: ownerDraft?.neighborhood || "",
    city: ownerDraft?.city || "",
    state: ownerDraft?.state || "",
  });

  async function handleCepBlur() {
    const cep = (barbershopData.zipcode || "").replace(/\D/g, "");
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
      toast({ title: "Erro ao buscar CEP", variant: "destructive" });
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

  // ---------------- STEP 3 — BARBER DATA ----------------
  const [ownerAlsoBarber, setOwnerAlsoBarber] = useState(true);

  const [barberData, setBarberData] = useState({
    name: ownerDraft?.name || "",
    email: ownerDraft?.email || "",
    phone: ownerDraft?.phone || "",
    cpf: ownerDraft?.cpf || "",
    password: "",
    confirm_password: "",
    bio: "",
  });

  useEffect(() => {
    if (!ownerDraft) {
      (async () => {
        try {
          const me = await usersApi.me();
          if (me) {
            setBarberData((prev) => ({
              ...prev,
              name: me.name || prev.name,
              email: me.email || prev.email,
              phone: me.phone || prev.phone,
              cpf: me.cpf || prev.cpf,
            }));
          }
        } catch {}
      })();
    }
  }, [ownerDraft]);

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
      if (!ownerAlsoBarber && barberData.password !== barberData.confirm_password) {
        toast({
          title: "Senhas diferentes",
          description: "A senha e a confirmação precisam ser iguais.",
          variant: "destructive",
        });
        return;
      }
    }

    setStep((s) => s + 1);
  };

  const handleBack = () => setStep((s) => Math.max(s - 1, 1));

  // ---------------- STEP 4 — FINISH ----------------
  const handleFinish = async () => {
    setLoading(true);

    try {
      // 1 — Criar barbearia
      const payload = {
        ...barbershopData,
        opening_hours: schedule,
        slug: barbershopData.name.toLowerCase().replace(/\s+/g, "-"),
      };

      const shop = await barbershopsApi.create(payload);
      if (!shop?.id) throw new Error("Erro ao criar barbearia.");
      const barbershopId = shop.id;

      // 2 — OWNER TAMBÉM É BARBEIRO
      if (ownerAlsoBarber) {
        await barbersApi.linkOwner(barbershopId, {
          profile: { bio: barberData.bio || "" },
        });
      }

      // 3 — Criar barbeiro SEPARADO
      const shouldCreateNew =
        !ownerAlsoBarber &&
        barberData.name &&
        barberData.email &&
        barberData.phone &&
        barberData.cpf &&
        barberData.password;

      if (shouldCreateNew) {
        await barbersApi.create(barbershopId, {
          user: {
            name: barberData.name,
            email: barberData.email,
            phone: barberData.phone,
            cpf: barberData.cpf,
            gender: "n/a",
            password: barberData.password,
          },
          profile: {
            bio: barberData.bio || "",
          },
        });
      }

      clearOwnerDraft();

      toast({
        title: "Sucesso!",
        description: "Sua barbearia foi configurada com sucesso.",
      });

      navigate("/owner/dashboard");
    } catch (err: any) {
      toast({
        title: "Erro ao finalizar",
        description: err?.message || "Tente novamente.",
        variant: "destructive",
      });
    }

    setLoading(false);
  };

  // ---------------- TEMPLATE ----------------
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <Logo variant="vertical" size="lg" className="mx-auto mb-6" linkTo={null} />
        </div>

        <Card className="p-8 shadow-medium border-border">
          {/* Progress bar */}
          <div className="flex items-center justify-center gap-2 mb-8">
            {[1, 2, 3, 4].map((s) => (
              <div
                key={s}
                className={`h-2 w-12 rounded-full ${
                  s <= step ? "bg-accent" : "bg-secondary"
                }`}
              />
            ))}
          </div>

          {/* STEP 1 */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <PageTitle>Dados da Barbearia</PageTitle>
                <Subtitle>Vamos começar com as informações básicas</Subtitle>
              </div>

              <div className="space-y-4">
                {Object.entries({
                  name: "Nome",
                  phone: "Telefone",
                  zipcode: "CEP",
                  address: "Endereço",
                  address_number: "Número",
                  address_complement: "Complemento",
                  neighborhood: "Bairro",
                  city: "Cidade",
                  state: "Estado",
                }).map(([key, label]) => (
                  <div key={key}>
                    <Label>{label}</Label>
                    <Input
                      value={barbershopData[key]}
                      onChange={(e) =>
                        setBarbershopData((p) => ({ ...p, [key]: e.target.value }))
                      }
                      onBlur={key === "zipcode" ? handleCepBlur : undefined}
                    />
                  </div>
                ))}
              </div>

              <PrimaryButton onClick={handleNext} className="w-full h-12">
                Continuar <ArrowRight className="ml-2 w-5 h-5" />
              </PrimaryButton>
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <PageTitle>Horários de Funcionamento</PageTitle>
                <Subtitle>Defina quando sua barbearia estará aberta</Subtitle>
              </div>

              <div className="space-y-4">
                {DAYS.map((day) => (
                  <div key={day.id} className="flex items-center gap-4">
                    <Checkbox
                      checked={schedule[day.id].enabled}
                      onCheckedChange={(v) =>
                        setSchedule((p) => ({
                          ...p,
                          [day.id]: { ...p[day.id], enabled: !!v },
                        }))
                      }
                    />
                    <Label className="w-24">{day.label}</Label>

                    {schedule[day.id].enabled && (
                      <div className="flex items-center gap-2 flex-1">
                        <Input
                          type="time"
                          value={schedule[day.id].start}
                          onChange={(e) =>
                            setSchedule((p) => ({
                              ...p,
                              [day.id]: { ...p[day.id], start: e.target.value },
                            }))
                          }
                        />
                        <span className="text-muted-foreground">às</span>
                        <Input
                          type="time"
                          value={schedule[day.id].end}
                          onChange={(e) =>
                            setSchedule((p) => ({
                              ...p,
                              [day.id]: { ...p[day.id], end: e.target.value },
                            }))
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

          {/* STEP 3 — BARBER INPUTS */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <PageTitle>Adicionar Barbeiro</PageTitle>
                <Subtitle>Cadastre seu primeiro barbeiro (opcional)</Subtitle>
              </div>

              <div className="flex items-center gap-3 mb-4">
                <Checkbox
                  checked={ownerAlsoBarber}
                  onCheckedChange={(v) => setOwnerAlsoBarber(!!v)}
                />
                <Label>Eu sou proprietário e também quero ser barbeiro</Label>
              </div>

              {/* CAMPOS SEMPRE EDITÁVEIS */}
              <div className="space-y-4">
                {[
                  ["name", "Nome"],
                  ["email", "E-mail"],
                  ["phone", "Telefone"],
                  ["cpf", "CPF"],
                ].map(([key, label]) => (
                  <div key={key}>
                    <Label>{label}</Label>
                    <Input
                      value={barberData[key]}
                      onChange={(e) =>
                        setBarberData((p) => ({ ...p, [key]: e.target.value }))
                      }
                    />
                  </div>
                ))}

                {/* Somente se NÃO for owner */}
                {!ownerAlsoBarber && (
                  <>
                    <div>
                      <Label>Senha</Label>
                      <Input
                        type="password"
                        value={barberData.password}
                        onChange={(e) =>
                          setBarberData((p) => ({ ...p, password: e.target.value }))
                        }
                      />
                    </div>

                    <div>
                      <Label>Confirmar Senha</Label>
                      <Input
                        type="password"
                        value={barberData.confirm_password}
                        onChange={(e) =>
                          setBarberData((p) => ({
                            ...p,
                            confirm_password: e.target.value,
                          }))
                        }
                      />
                    </div>
                  </>
                )}

                <div>
                  <Label>Bio</Label>
                  <Input
                    value={barberData.bio}
                    onChange={(e) =>
                      setBarberData((p) => ({ ...p, bio: e.target.value }))
                    }
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

          {/* STEP 4 */}
          {step === 4 && (
            <div className="space-y-6 text-center">
              <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-10 h-10 text-accent" />
              </div>

              <PageTitle>Sua barbearia está pronta!</PageTitle>
              <Subtitle>
                Agora você pode gerenciar equipe, agenda e serviços.
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
