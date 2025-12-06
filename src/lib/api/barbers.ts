import { api } from "./index";

export interface BarberUserPayload {
  name: string;
  email: string;
  phone: string;
  cpf: string;
  gender: string;
}

export interface BarberProfilePayload {
  [key: string]: any; // flexível porque o backend não especifica campos fixos
}

export interface CreateBarberPayload {
  user: BarberUserPayload;
  profile: BarberProfilePayload;
}

export interface BarberLink {
  id: number;
  barbershop_id: number;
  user_id: number;
  is_owner: boolean;
  is_active: boolean;
}

export const barbersApi = {
  // Criar barbeiro
  create: (
    barbershopId: number,
    data: CreateBarberPayload
  ) => {
    return api.post(`/barbers/${barbershopId}/barbers`, data);
  },

  // Listar barbeiros (vínculos)
  list: (barbershopId: number): Promise<BarberLink[]> => {
    return api.get(`/barbers/${barbershopId}/barbers`);
  },

  // Atualizar barbeiro (owner)
  update: (
    barbershopId: number,
    userId: number,
    updates: Record<string, any>
  ) => {
    return api.patch(
      `/barbers/${barbershopId}/barbers/${userId}`,
      updates
    );
  },

  // Owner vira também barbeiro
  linkOwner: (barbershopId: number) => {
    return api.post(`/barbers/${barbershopId}/link-owner`, {});
  }
};
