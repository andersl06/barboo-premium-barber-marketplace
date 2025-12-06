import { api } from "./index";

export interface Notification {
  id: number;
  user_id: number;
  schedule_id?: number | null;
  type: string;
  message: string;
  status: "read" | "unread";
  created_at?: string;
}

export const notificationsApi = {
  // Listar notificações do usuário
  list: (): Promise<Notification[]> => {
    return api.get("/notifications");
  },

  // Marcar uma notificação como lida
  markAsRead: (notificationId: number): Promise<{ success: boolean }> => {
    return api.patch(`/notifications/${notificationId}`);
  },
};
