import { Layout } from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { PageTitle } from "@/components/ui/PageTitle";
import { Subtitle } from "@/components/ui/Subtitle";
import { BarbershopCard } from "@/components/cards/BarbershopCard";
import { Heart } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { favoritesApi } from "@/lib/api/favorites";
import { toast } from "@/hooks/use-toast";
import { FloatingMenuButton } from "@/components/client/FloatingMenuButton";

const ClientFavorites = () => {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      const data = await favoritesApi.list();
      setFavorites(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Erro ao carregar favoritos:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFavorite = async (barbershopId: number) => {
    try {
      await favoritesApi.remove(barbershopId);
      setFavorites(favorites.filter((f) => f.barbershop_id !== barbershopId));
      toast({ title: "Removido dos favoritos" });
    } catch (error: any) {
      toast({ title: error.message || "Erro ao remover", variant: "destructive" });
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <PageTitle className="mb-2">Favoritos</PageTitle>
            <Subtitle>Suas barbearias preferidas</Subtitle>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <Card key={i} className="h-48 animate-pulse bg-secondary/50" />
              ))}
            </div>
          ) : favorites.length === 0 ? (
            <Card className="p-12 text-center">
              <Heart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-bold text-navy mb-2">Nenhum favorito ainda</h3>
              <p className="text-muted-foreground mb-6">
                Explore barbearias e adicione aos favoritos para acessá-las rapidamente.
              </p>
              <button
                onClick={() => navigate("/client/home")}
                className="text-accent font-semibold hover:underline"
              >
                Explorar barbearias →
              </button>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {favorites.map((fav) => (
                <div key={fav.id} className="relative">
                  <BarbershopCard
                    name={fav.barbershop?.name || "Barbearia"}
                    address={fav.barbershop?.address || ""}
                    rating={fav.barbershop?.rating || 0}
                    reviewCount={fav.barbershop?.review_count || 0}
                    imageUrl={fav.barbershop?.photo_url}
                    onClick={() => navigate(`/client/barbershop/${fav.barbershop_id}`)}
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveFavorite(fav.barbershop_id);
                    }}
                    className="absolute top-4 right-4 p-2 bg-background/80 rounded-full hover:bg-destructive/10 transition-smooth"
                  >
                    <Heart className="w-5 h-5 fill-accent text-accent" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Floating Menu Button */}
          <FloatingMenuButton />
        </div>
      </div>
    </Layout>
  );
};

export default ClientFavorites;
