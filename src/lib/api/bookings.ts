import { api } from "./index";

export interface CreateBookingPayload {
  barber_id: number;
  service_id: number;
  starts_at: string; // ISO string
}

export interface Booking {
  id: number;
  barbershop_id: number;
  barber_id: number;
  client_id: number;
  service_id: number;
  starts_at: string;
  ends_at: string;
  status: string;
  created_at?: string;
  updated_at?: string;
}

export const bookingsApi = {
  // Listar bookings do cliente (CLIENTE)
  listByClient: (): Promise<Booking[]> => {
    return api.get("/bookings/my");
  },

  // Criar booking (CLIENTE)
  create: (
    barbershopId: number,
    payload: CreateBookingPayload
  ): Promise<Booking> => {
    return api.post(`/bookings/${barbershopId}`, payload);
  },

  // Listar bookings de um barbeiro (BARBER/OWNER)
  listByBarber: (
    barbershopId: number,
    barberId: number
  ): Promise<Booking[]> => {
    return api.get(`/bookings/${barbershopId}/barber/${barberId}`);
  },

  // Listar bookings da barbearia (OWNER/ADMIN)
  listByBarbershop: (
    barbershopId: number,
    filters?: { from?: string; to?: string }
  ): Promise<Booking[]> => {
    const params = new URLSearchParams();
    if (filters?.from) params.append("from", filters.from);
    if (filters?.to) params.append("to", filters.to);

    const queryString = params.toString() ? `?${params.toString()}` : "";
    return api.get(`/bookings/${barbershopId}${queryString}`);
  },

  // Cancelar (cliente/barber/owner)
  cancel: (
    barbershopId: number,
    bookingId: number
  ): Promise<Booking> => {
    return api.patch(`/bookings/${barbershopId}/cancel/${bookingId}`);
  },

  // Alterar status (barber/owner)
  updateStatus: (
    barbershopId: number,
    bookingId: number,
    status: "confirmed" | "completed" | "cancelled"
  ): Promise<Booking> => {
    return api.patch(
      `/bookings/${barbershopId}/status/${bookingId}`,
      { status }
    );
  },
};
