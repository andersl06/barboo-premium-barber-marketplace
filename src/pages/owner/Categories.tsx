import { Layout } from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { PageTitle } from "@/components/ui/PageTitle";
import { Subtitle } from "@/components/ui/Subtitle";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { SecondaryButton } from "@/components/ui/SecondaryButton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ArrowLeft, Plus, Tag, Edit2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { categoriesApi } from "@/lib/api/categories";
import { toast } from "@/hooks/use-toast";

const OwnerCategories = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [barbershopId, setBarbershopId] = useState<number | null>(null);
  const [name, setName] = useState("");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("barboo_user") || "{}");
    if (user.barbershop_id) {
      setBarbershopId(user.barbershop_id);
      loadCategories(user.barbershop_id);
    }
  }, []);

  const loadCategories = async (id: number) => {
    try {
      const data = await categoriesApi.list(id);
      setCategories(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Erro ao carregar categorias:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!barbershopId) return;

    try {
      if (editingCategory) {
        await categoriesApi.update(editingCategory.id, { name });
        toast({ title: "Categoria atualizada!" });
      } else {
        await categoriesApi.create({ name, barbershop_id: barbershopId });
        toast({ title: "Categoria criada!" });
      }

      setDialogOpen(false);
      setEditingCategory(null);
      setName("");
      loadCategories(barbershopId);
    } catch (error: any) {
      toast({ title: error.message || "Erro ao salvar", variant: "destructive" });
    }
  };

  const openEditDialog = (category: any) => {
    setEditingCategory(category);
    setName(category.name || "");
    setDialogOpen(true);
  };

  const openNewDialog = () => {
    setEditingCategory(null);
    setName("");
    setDialogOpen(true);
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
              <PageTitle className="mb-2">Categorias</PageTitle>
              <Subtitle>Organize seus serviços em categorias</Subtitle>
            </div>

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <PrimaryButton onClick={openNewDialog}>
                  <Plus className="w-4 h-4 mr-2" />
                  Nova Categoria
                </PrimaryButton>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {editingCategory ? "Editar Categoria" : "Nova Categoria"}
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                  <div>
                    <Label>Nome da Categoria</Label>
                    <Input
                      placeholder="Ex: Cortes, Barba, Combo"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                  <PrimaryButton type="submit" className="w-full">
                    {editingCategory ? "Salvar" : "Criar Categoria"}
                  </PrimaryButton>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i} className="h-20 animate-pulse bg-secondary/50" />
              ))}
            </div>
          ) : categories.length === 0 ? (
            <Card className="p-12 text-center">
              <Tag className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-bold text-navy mb-2">Nenhuma categoria</h3>
              <p className="text-muted-foreground mb-6">
                Crie categorias para organizar seus serviços.
              </p>
              <PrimaryButton onClick={openNewDialog}>
                <Plus className="w-4 h-4 mr-2" />
                Criar Primeira Categoria
              </PrimaryButton>
            </Card>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {categories.map((category) => (
                <Card
                  key={category.id}
                  className="p-4 hover:shadow-medium transition-smooth flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                      <Tag className="w-5 h-5 text-accent" />
                    </div>
                    <span className="font-semibold text-navy">{category.name}</span>
                  </div>
                  <SecondaryButton size="sm" onClick={() => openEditDialog(category)}>
                    <Edit2 className="w-4 h-4" />
                  </SecondaryButton>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default OwnerCategories;
