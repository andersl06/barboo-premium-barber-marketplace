// Reviews API - Official Endpoints
import { api } from "./index";

export interface Review {
  id: number;
  client_id: number;
  barbershop_id: number;
  barber_id?: number;
  booking_id?: number;
  rating: number;
  comment?: string;
  created_at?: string;
}

export const reviewsApi = {
  create: (data: { barbershop_id: number; barber_id?: number; booking_id?: number; rating: number; comment?: string }) =>
    api.post("/api/reviews", data),

  list: (barbershopId: number | string) =>
    api.get(`/api/reviews?barbershop_id=${barbershopId}`),
};
