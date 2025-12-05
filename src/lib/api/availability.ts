// Availability API - Official Endpoints
import { api } from "./index";

export interface Availability {
  id: number;
  barber_id: number;
  day_of_week: number;   // 0-6 (Sunday–Saturday)
  start_time: string;
  end_time: string;
  created_at?: string;
}

export const availabilityApi = {

  // GET /availability/:barberId
  getByBarber: (barberId: number | string) =>
    api.get(`availability/${barberId}`),

  // POST /availability
  // (cria uma nova disponibilidade)
  create: (data: Partial<Availability>) =>
    api.post("availability", data),

  // DELETE /availability/:id
  remove: (id: number | string) =>
    api.delete(`availability/${id}`),
};
