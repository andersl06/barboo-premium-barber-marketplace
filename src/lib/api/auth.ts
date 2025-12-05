// src/lib/api/auth.ts
import { api } from "./index";

export interface RegisterClientPayload {
  name: string;
  email: string;
  phone: string;
  cpf: string;
  gender: string;
  password: string;
}

export interface RegisterOwnerPayload {
  name: string;
  email: string;
  phone: string;
  cpf: string;
  gender: string;
  password: string;
}

export interface RegisterBarberPayload {
  name: string;
  email: string;
  phone: string;
  cpf: string;
  gender: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export const authApi = {
  registerClient: (data: RegisterClientPayload) =>
    api.post("auth/register/client", data),

  registerOwner: (data: RegisterOwnerPayload) =>
    api.post("auth/register/owner", data),

  registerBarber: (data: RegisterBarberPayload) =>
    api.post("auth/register/barber", data), // precisa token owner

  login: async (data: LoginPayload) => {
    const res = await api.post("auth/login", data);

    if (!res?.token) throw new Error("Token inválido.");

    // Armazena sempre o token
    localStorage.setItem("barboo_token", res.token);

    // Se houver user, armazena
    if (res.user) {
      localStorage.setItem("barboo_user", JSON.stringify(res.user));
    }

    return res;
  },

  changePassword: (newPassword: string) =>
    api.patch("auth/change-password", { newPassword }),

  logout: () => {
    localStorage.removeItem("barboo_token");
    localStorage.removeItem("barboo_user");
  },
};
