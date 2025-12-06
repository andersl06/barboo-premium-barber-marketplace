// src/lib/api/audit.ts
import { api } from "./index";

export interface AuditLog {
  id: number;
  user_id: number;
  action: string;
  payload: any;
  created_at: string;
}

export const auditApi = {
  list: async (): Promise<AuditLog[]> => {
    return api.get("/audit");
  },
};
