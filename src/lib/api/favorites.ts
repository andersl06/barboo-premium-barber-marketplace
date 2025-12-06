import { api } from "./index";

export interface FavoriteBarbershop {
  id: number;
  name: string;
  logo_url: string | null;
  city: string | null;
  state: string | null;
}

export interface Favorite {
  barbershop_id: number;
  barbershops: FavoriteBarbershop;
}

export const favoritesApi = {
  // Favoritar barbearia
  add: (barbershopId: number): Promise<Favorite> => {
    return api.post(`/favorites/${barbershopId}`);
  },

  // Remover favorito
  remove: (barbershopId: number): Promise<{ success: true }> => {
    return api.delete(`/favorites/${barbershopId}`);
  },

  // Listar favoritos do cliente logado
  list: (): Promise<Favorite[]> => {
    return api.get("/favorites");
  }
};
