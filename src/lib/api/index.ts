const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

function authHeaders() {
  // Aqui está a lógica correta:
  // 1) Se existir token TEMPORÁRIO → usa ele
  // 2) Senão → usa o token normal
  const tempToken = localStorage.getItem("barboo_temp_token");
  const normalToken = localStorage.getItem("barboo_token");

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  const tokenToUse = tempToken || normalToken;

  if (tokenToUse) {
    headers.Authorization = `Bearer ${tokenToUse}`;
  }

  return headers;
}

function buildUrl(endpoint: string) {
  if (!endpoint.startsWith("/")) endpoint = "/" + endpoint;
  return `${API_URL}${endpoint}`;
}

async function handleResponse(res: Response) {
  let json = null;

  try {
    json = await res.json();
  } catch (err) {
    throw new Error("Resposta inválida da API.");
  }

  if (!res.ok) throw new Error(json.message || "Erro na requisição");
  return json;
}

export const api = {
  get: async (endpoint: string) => {
    const res = await fetch(buildUrl(endpoint), {
      headers: authHeaders(),
    });
    return handleResponse(res);
  },

  post: async (endpoint: string, data?: any) => {
    const res = await fetch(buildUrl(endpoint), {
      method: "POST",
      headers: authHeaders(),
      body: data ? JSON.stringify(data) : undefined,
    });
    return handleResponse(res);
  },

  patch: async (endpoint: string, data?: any) => {
    const res = await fetch(buildUrl(endpoint), {
      method: "PATCH",
      headers: authHeaders(),
      body: data ? JSON.stringify(data) : undefined,
    });
    return handleResponse(res);
  },

  delete: async (endpoint: string) => {
    const res = await fetch(buildUrl(endpoint), {
      method: "DELETE",
      headers: authHeaders(),
    });
    return handleResponse(res);
  },
};
