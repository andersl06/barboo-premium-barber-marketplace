import { api } from "./index";

export interface Category {
  id: number;
  barbershop_id: number;
  name: string;
  created_at?: string;
  updated_at?: string;
}

export interface CreateCategoryPayload {
  name: string;
}

export interface UpdateCategoryPayload {
  name?: string;
}

export const categoriesApi = {
  // Criar categoria (owner)
  create: (
    barbershopId: number,
    payload: CreateCategoryPayload
  ): Promise<Category> => {
    return api.post(`/categories/${barbershopId}`, payload);
  },

  // Listar categorias (público)
  list: (barbershopId: number): Promise<Category[]> => {
    return api.get(`/categories/${barbershopId}`);
  },

  // Atualizar categoria (owner)
  update: (
    barbershopId: number,
    categoryId: number,
    payload: UpdateCategoryPayload
  ): Promise<Category> => {
    return api.patch(
      `/categories/${barbershopId}/${categoryId}`,
      payload
    );
  },
};
