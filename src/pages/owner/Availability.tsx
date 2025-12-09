import { Layout } from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { PageTitle } from "@/components/ui/PageTitle";
import { Subtitle } from "@/components/ui/Subtitle";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { SecondaryButton } from "@/components/ui/SecondaryButton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Clock, Save } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { availabilityApi } from "@/lib/api/availability";
import { barbersApi } from "@/lib/api/barbers";
import { toast } from "@/hooks/use-toast";

const DAYS = [
  { value: 0, label: "Domingo" },
  { value: 1, label: "Segunda-feira" },
  { value: 2, label: "Terça-feira" },
  { value: 3, label: "Quarta-feira" },
  { value: 4, label: "Quinta-feira" },
  { value: 5, label: "Sexta-feira" },
  { value: 6, label: "Sábado" },
];

const OwnerAvailability = () => {
  const navigate = useNavigate();
  const [barbers, setBarbers] = useState<any[]>([]);
  const [barbershopId, setBarbershopId] = useState<number | null>(null);
  const [selectedBarber, setSelectedBarber] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [schedule, setSchedule] = useState(
    DAYS.map((day) => ({
      day_of_week: day.value,
      enabled: day.value >= 1 && day.value <= 5,
      start_time: "09:00",
      end_time: "18:00",
    }))
  );

  useEffect(() => {
    loadBarbers();
  }, []);

  useEffect(() => {
    if (selectedBarber) {
      loadAvailability();
    }
  }, [selectedBarber]);

  const loadBarbers = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("barboo_user") || "{}");
      if (user.barbershop_id) {
        setBarbershopId(user.barbershop_id);
        const data = await barbersApi.list(user.barbershop_id);
        setBarbers(Array.isArray(data) ? data : []);
        if (data.length > 0) {
          setSelectedBarber(data[0].id.toString());
        }
      }
    } catch (error) {
      console.error("Erro ao carregar barbeiros:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadAvailability = async () => {
    if (!barbershopId) return;
    try {
      const data = await availabilityApi.get(barbershopId, Number(selectedBarber));
      if (Array.isArray(data) && data.length > 0) {
        setSchedule((prev) =>
          prev.map((day) => {
            const found = data.find((a: any) => a.day_of_week === day.day_of_week);
            if (found) {
              return {
                ...day,
                enabled: true,
                start_time: found.start_time || "09:00",
                end_time: found.end_time || "18:00",
              };
            }
            return { ...day, enabled: false };
          })
        );
      }
    } catch (error) {
      console.error("Erro ao carregar disponibilidade:", error);
    }
  };

  const handleDayToggle = (dayOfWeek: number) => {
    setSchedule((prev) =>
      prev.map((day) =>
        day.day_of_week === dayOfWeek ? { ...day, enabled: !day.enabled } : day
      )
    );
  };

  const handleTimeChange = (dayOfWeek: number, field: "start_time" | "end_time", value: string) => {
    setSchedule((prev) =>
      prev.map((day) =>
        day.day_of_week === dayOfWeek ? { ...day, [field]: value } : day
      )
    );
  };

  const handleSave = async () => {
    if (!selectedBarber || !barbershopId) return;

    setSaving(true);
    try {
      for (const day of schedule) {
        if (day.enabled) {
          await availabilityApi.set(barbershopId, Number(selectedBarber), {
            day_of_week: day.day_of_week,
            start_time: day.start_time,
            end_time: day.end_time,
          });
        }
      }
      toast({ title: "Disponibilidade salva!" });
    } catch (error: any) {
      toast({ title: error.message || "Erro ao salvar", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-3xl mx-auto">
          <button
            onClick={() => navigate("/owner/dashboard")}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            Voltar
          </button>

          <div className="mb-8">
            <PageTitle className="mb-2">Disponibilidade</PageTitle>
            <Subtitle>Configure os horários de trabalho dos barbeiros</Subtitle>
          </div>

          {/* Seletor de Barbeiro */}
          <Card className="p-4 mb-6">
            <Label className="mb-2 block">Selecionar Barbeiro</Label>
            <Select value={selectedBarber} onValueChange={setSelectedBarber}>
              <SelectTrigger>
                <SelectValue placeholder="Escolha um barbeiro" />
              </SelectTrigger>
              <SelectContent>
                {barbers.map((barber) => (
                  <SelectItem key={barber.id} value={barber.id.toString()}>
                    {barber.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Card>

          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                <Card key={i} className="h-16 animate-pulse bg-secondary/50" />
              ))}
            </div>
          ) : !selectedBarber ? (
            <Card className="p-8 text-center">
              <Clock className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                Selecione um barbeiro para configurar a disponibilidade.
              </p>
            </Card>
          ) : (
            <>
              <div className="space-y-3 mb-6">
                {DAYS.map((day) => {
                  const daySchedule = schedule.find((s) => s.day_of_week === day.value);
                  return (
                    <Card key={day.value} className="p-4">
                      <div className="flex items-center gap-4">
                        <Checkbox
                          checked={daySchedule?.enabled}
                          onCheckedChange={() => handleDayToggle(day.value)}
                        />
                        <span className="w-32 font-medium text-navy">{day.label}</span>

                        {daySchedule?.enabled && (
                          <div className="flex items-center gap-2 flex-1">
                            <Input
                              type="time"
                              value={daySchedule.start_time}
                              onChange={(e) =>
                                handleTimeChange(day.value, "start_time", e.target.value)
                              }
                              className="w-28"
                            />
                            <span className="text-muted-foreground">até</span>
                            <Input
                              type="time"
                              value={daySchedule.end_time}
                              onChange={(e) =>
                                handleTimeChange(day.value, "end_time", e.target.value)
                              }
                              className="w-28"
                            />
                          </div>
                        )}

                        {!daySchedule?.enabled && (
                          <span className="text-muted-foreground text-sm">Fechado</span>
                        )}
                      </div>
                    </Card>
                  );
                })}
              </div>

              <PrimaryButton className="w-full" onClick={handleSave} disabled={saving}>
                <Save className="w-4 h-4 mr-2" />
                {saving ? "Salvando..." : "Salvar Disponibilidade"}
              </PrimaryButton>
            </>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default OwnerAvailability;
