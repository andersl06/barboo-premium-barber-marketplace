// Bookings API - Official Endpoints
import { api } from "./index";

export interface Booking {
  id: number;
  client_id: number;
  barber_id: number;
  barbershop_id: number;
  service_id: number;
  date: string;
  start_time: string;
  end_time: string;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  price: number;
  barboo_fee: number;
  total: number;
  created_at?: string;
}

export const bookingsApi = {
  create: (data: {
    barber_id: number;
    barbershop_id: number;
    service_id: number;
    date: string;
    start_time: string;
  }) => api.post("bookings", data),

  listByClient: (clientId: number | string) =>
    api.get(`bookings/client/${clientId}`),

  listByBarber: (barberId: number | string) =>
    api.get(`bookings/barber/${barberId}`),

  cancel: (id: number | string) =>
    api.patch(`bookings/${id}/cancel`),
};
