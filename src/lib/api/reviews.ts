import { api } from "./index";

export interface ReviewUser {
  id: number;
  name: string;
  avatar_url: string | null;
}

export interface Review {
  id: number;
  client_id: number;
  barbershop_id: number;
  rating: number;
  comment?: string;
  reply?: string;
  created_at: string;
  users?: ReviewUser;
}

export interface BarberScheduleReview {
  id: number;
  service_id: number;
  client_id: number;
  barbershop_id: number;
  reviews: Review | null;
}

export const reviewsApi = {
  // Cliente cria review
  create: (payload: {
    barbershop_id: number;
    rating: number;
    comment?: string;
  }): Promise<Review> => {
    return api.post("/reviews", payload);
  },

  // Listar reviews da barbearia
  listByBarbershop: (
    barbershopId: number
  ): Promise<Review[]> => {
    return api.get(`/reviews/barbershop/${barbershopId}`);
  },

  // Listar reviews associadas a agendamentos de um barbeiro
  listByBarber: (
    barberId: number
  ): Promise<BarberScheduleReview[]> => {
    return api.get(`/reviews/barber/${barberId}`);
  },

  // Barber responde avaliação
  reply: (
    reviewId: number,
    reply: string
  ): Promise<Review> => {
    return api.patch(`/reviews/reply/${reviewId}`, { reply });
  }
};
