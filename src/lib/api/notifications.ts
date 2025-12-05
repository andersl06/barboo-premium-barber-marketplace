// Notifications API
import { api } from "./index";

export interface Notification {
  id: number;
  user_id: number;
  title: string;
  message: string;
  is_read: boolean;
  created_at?: string;
}

export const notificationsApi = {
  list: () => api.get("notifications"),

  markAsRead: (id: number | string) =>
    api.patch(`notifications/${id}/read`),
};
