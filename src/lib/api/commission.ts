import { api } from "./index";

export interface CommissionPreview {
  service_price: number;
  app_fee: number;
  percent: number;
  total_price: number;
}

export interface Invoice {
  id: number;
  barbershop_id: number;
  month: string;
  total_commission: number;
  discount_applied: boolean;
  discount_reason: string | null;
  status: string;
  created_at?: string;
}

export const commissionApi = {
  // CLIENTE VÊ TAXA NO CHECKOUT
  preview: async (service_price: number): Promise<CommissionPreview> => {
    return api.get(`/commission/preview?service_price=${service_price}`);
  },

  // OWNER/ADMIN GERA INVOICE
  generateInvoice: async (
    barbershopId: number,
    month?: string
  ): Promise<Invoice> => {
    const query = month ? `?month=${month}` : "";
    return api.get(`/commission/invoice/${barbershopId}${query}`);
  },

  // (Opcional — só se você quiser expor a função de ciclo)
  runCycle: async (barbershopId: number) => {
    return api.get(`/commission/cycle/${barbershopId}`);
  }
};
