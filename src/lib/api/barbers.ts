import { api } from "./index";

export interface CreateBarberUser {
  name: string;
  email: string;
  phone: string;
  cpf: string;
  gender: string;
  password: string;
}

export interface CreateBarberProfile {
  bio?: string; // apenas bio, conforme seu pedido
}

export interface CreateBarberPayload {
  user: CreateBarberUser;
  profile: CreateBarberProfile;
}

export const barbersApi = {
  /** Criar barbeiro */
  create: (barbershopId: number, payload: CreateBarberPayload) =>
    api.post(`/barbers/${barbershopId}/barbers`, payload),

  /** Listar vínculos */
  list: (barbershopId: number) =>
    api.get(`/barbers/${barbershopId}/barbers`),

  /** Update */
  update: (barbershopId: number, userId: number, updates: any) =>
    api.patch(`/barbers/${barbershopId}/barbers/${userId}`, updates),

  /** Owner vira barbeiro */
  linkOwner: (barbershopId: number, payload?: any) =>
    api.post(`/barbers/${barbershopId}/link-owner`, payload || {}),
};
