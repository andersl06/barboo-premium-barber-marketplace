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
  // Cliente vê taxa final no checkout
  preview: (service_price: number) =>
    api.get(`/commission/preview?service_price=${service_price}`),

  // Owner busca invoice (mês atual)
  getInvoice: (barbershopId: number) =>
    api.get(`/commission/invoice/${barbershopId}`),
};
