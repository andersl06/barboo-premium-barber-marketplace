// src/lib/api/barbershops.ts
import { api } from "./index";

export interface Barbershop {
  id?: number;
  name?: string;
  address?: string;
  phone?: string;
  owner_id?: number;
  // outros campos que sua tabela tiver...
  [key: string]: any;
}

export interface CreateBarbershopPayload {
  name: string;
  address?: string;
  phone?: string;
  // outros campos que o frontend preenche (sem owner_id)
  [key: string]: any;
}

export const barbershopsApi = {
  // GET /barbershops/mine  (requires auth)
  getMine: async (): Promise<Barbershop | null> => {
    const res = await api.get("/barbershops/mine");
    // normalização defensiva: se backend retornar { data, error } retornamos data
    if (res && typeof res === "object" && "data" in res) return (res as any).data ?? null;
    return res ?? null;
  },

  // GET /barbershops/:id  (public)
  getOne: async (id: number | string): Promise<Barbershop> => {
    const res = await api.get(`/barbershops/${id}`);
    if (res && typeof res === "object" && "data" in res) return (res as any).data;
    return res;
  },

  // POST /barbershops  (requires auth) — NÃO envie owner_id: backend usa req.user.id
  create: async (payload: CreateBarbershopPayload): Promise<Barbershop> => {
    const res = await api.post("/barbershops", payload);
    if (res && typeof res === "object" && "data" in res) return (res as any).data;
    return res;
  },

  // PATCH /barbershops/:id  (requires auth)
  update: async (id: number | string, payload: Partial<CreateBarbershopPayload>): Promise<Barbershop> => {
    const res = await api.patch(`/barbershops/${id}`, payload);
    if (res && typeof res === "object" && "data" in res) return (res as any).data;
    return res;
  },
};
