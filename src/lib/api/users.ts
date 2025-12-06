import { api } from "./index";

export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  cpf: string;
  gender: string;
  role: string;
  avatar_url?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface UpdateUserPayload {
  name?: string;
  email?: string;
  phone?: string;
  cpf?: string;
  gender?: string;
  avatar_url?: string | null;
}

export const usersApi = {
  // Buscar dados do usuário logado
  me: (): Promise<User> => {
    return api.get("/users/me");
  },

  // Atualizar dados do usuário logado
  updateMe: (payload: UpdateUserPayload): Promise<User> => {
    return api.patch("/users/me", payload);
  },
};
