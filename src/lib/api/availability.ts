import { api } from "./index";

export interface AvailabilityPayload {
  day_of_week: number;
  start_time: string;
  end_time: string;
  exceptions?: Record<string, any>;
}

export interface AvailabilityResponse {
  id?: number;
  barber_id: number;
  day_of_week: number;
  start_time: string;
  end_time: string;
  exceptions: Record<string, any>;
  created_at?: string;
  updated_at?: string;
}

export const availabilityApi = {
  // Criar/editar disponibilidade
  set: (
    barbershopId: number,
    barberId: number,
    data: AvailabilityPayload
  ): Promise<AvailabilityResponse> => {
    return api.post(
      `/availability/${barbershopId}/barber/${barberId}`,
      data
    );
  },

  // Buscar disponibilidade do barbeiro
  get: (
    barbershopId: number,
    barberId: number
  ): Promise<AvailabilityResponse | null> => {
    return api.get(`/availability/${barbershopId}/barber/${barberId}`);
  },
};
