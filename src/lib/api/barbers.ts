// src/lib/api/barbers.ts
import { api } from "./index";

export const barbersApi = {
  // GET /barbers/barbershop/:id
  listByBarbershop: (barbershopId: number | string) =>
    api.get(`barbers/barbershop/${barbershopId}`),

  // POST /barbers/barbershop/:id
  create: (barbershopId: number | string, data: any) =>
    api.post(`barbers/barbershop/${barbershopId}`, data),

  // PATCH /barbers/barbershop/:id/:userId
  update: (barbershopId: number | string, userId: number | string, data: any) =>
    api.patch(`barbers/barbershop/${barbershopId}/${userId}`, data),

  // POST /barbers/barbershop/:id/owner
  linkOwner: (barbershopId: number | string) =>
    api.post(`barbers/barbershop/${barbershopId}/owner`),
};
