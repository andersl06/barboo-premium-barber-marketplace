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
    api.post("/auth/register/client", data),

  registerOwner: (data: RegisterOwnerPayload) =>
    api.post("/auth/register/owner", data),

  registerBarber: async (data: RegisterBarberPayload) => {
    const res = await api.post("/auth/register/barber", data);

    // backend retorna tempPassword - importante para o owner
    return res;
  },

  login: async (data: LoginPayload) => {
    const res = await api.post("/auth/login", data);

    if (!res?.token) {
      throw new Error("Token inválido.");
    }

    // 1) Se precisa trocar senha → salva somente o TEMP TOKEN
    if (res.must_change_password) {
      localStorage.setItem("barboo_temp_token", res.token);
      localStorage.removeItem("barboo_token"); // evita conflito
      return { must_change_password: true };
    }

    // 2) Fluxo normal
    localStorage.setItem("barboo_token", res.token);
    localStorage.setItem("barboo_user", JSON.stringify(res.user));

    return res;
  },

  changePassword: async (newPassword: string) => {
    const tempToken = localStorage.getItem("barboo_temp_token");
    if (!tempToken) throw new Error("Token de verificação ausente.");

    // Faz a troca de senha usando o temp token no header (já ajustamos no api/index.ts)
    const res = await api.patch("/auth/change-password", { newPassword });

    // Limpa após uso
    localStorage.removeItem("barboo_temp_token");

    return res;
  },

  logout: () => {
    localStorage.removeItem("barboo_token");
    localStorage.removeItem("barboo_user");
    localStorage.removeItem("barboo_temp_token");
  },
};
