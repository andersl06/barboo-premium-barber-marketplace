import { api } from "./index";

export interface Service {
  id: number;
  barbershop_id: number;
  name: string;
  description: string | null;
  price: number;
  duration_minutes: number;
  category_id: number | null;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface CreateServicePayload {
  name: string;
  description?: string;
  price: number;
  duration_minutes: number;
  category_id?: number | null;
}

export interface UpdateServicePayload {
  name?: string;
  description?: string;
  price?: number;
  duration_minutes?: number;
  category_id?: number | null;
}

export const servicesApi = {
  // Criar serviço (OWNER)
  create: (
    barbershopId: number,
    payload: CreateServicePayload
  ): Promise<Service> => {
    return api.post(`/services/${barbershopId}`, payload);
  },

  // Atualizar serviço (OWNER)
  update: (
    serviceId: number,
    payload: UpdateServicePayload
  ): Promise<Service> => {
    return api.patch(`/services/update/${serviceId}`, payload);
  },

  // Ativar ou desativar (OWNER)
  toggleStatus: (
    serviceId: number,
    is_active: boolean
  ): Promise<Service> => {
    return api.patch(`/services/status/${serviceId}`, {
      is_active
    });
  },

  // Listar serviços (PÚBLICO)
  list: (barbershopId: number): Promise<Service[]> => {
    return api.get(`/services/${barbershopId}`);
  }
};
