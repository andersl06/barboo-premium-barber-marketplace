// src/lib/api/commission.ts
import { api } from "./index";

export const commissionApi = {
  getByBarbershop: (barbershopId: string | number) =>
    api.get(`commission/barbershop/${barbershopId}`),

  getByBooking: (bookingId: string | number) =>
    api.get(`commission/booking/${bookingId}`),
};
