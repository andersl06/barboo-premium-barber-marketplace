import { api } from "./index";

export const barbershopsApi = {
  getMine: async () => {
    const res = await api.get("barbershops/mine");
    return res.data; // <-- CORREÇÃO AQUI
  },

  create: async (data: any) => {
    const res = await api.post("barbershops", data);
    return res.data; // idem
  },

  update: async (id: number | string, data: any) => {
    const res = await api.patch(`barbershops/${id}`, data);
    return res.data;
  },

  getById: async (id: number | string) => {
    const res = await api.get(`barbershops/${id}`);
    return res.data;
  },

  getBySlug: async (slug: string) => {
    const res = await api.get(`barbershops/slug/${slug}`);
    return res.data;
  },
};
