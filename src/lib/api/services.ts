// Services API - Official Endpoints
import { api } from "./index";

export interface Service {
  id: number;
  name: string;
  description?: string;
  price: number;
  duration: number; // in minutes
  barbershop_id: number;
  category_id?: number;
  created_at?: string;
}

export const servicesApi = {
  create: (data: Partial<Service>) =>
    api.post("/api/services", data),

  list: (barbershopId: number | string) =>
    api.get(`/api/services?barbershop_id=${barbershopId}`),

  getById: (id: number | string) =>
    api.get(`/api/services/${id}`),

  update: (id: number | string, data: Partial<Service>) =>
    api.patch(`/api/services/${id}`, data),
};
