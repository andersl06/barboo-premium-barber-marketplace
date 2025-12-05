// src/lib/api/favorites.ts
import { api } from "./index";

export interface Favorite {
  id: number;
  client_id: number;
  barbershop_id: number;
  created_at?: string;
}

export const favoritesApi = {
  // POST /favorites/:barbershopId
  add: (barbershopId: number | string) =>
    api.post(`favorites/${barbershopId}`),

  // DELETE /favorites/:barbershopId
  remove: (barbershopId: number | string) =>
    api.delete(`favorites/${barbershopId}`),

  // GET /favorites
  list: () =>
    api.get("favorites"),
};
