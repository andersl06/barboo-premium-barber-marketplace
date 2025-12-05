// src/lib/api/categories.ts
import { api } from "./index";

export const categoriesApi = {
  list: () => api.get("categories"),

  create: (data: any) =>
    api.post("categories", data),

  update: (id: number | string, data: any) =>
    api.patch(`categories/${id}`, data),

  delete: (id: number | string) =>
    api.delete(`categories/${id}`)
};
