// src/lib/auth/session.ts
export function saveAuthSession(res: any) {
  if (!res) return;

  if (res.must_change_password) {
    // backend deve enviar temp_token (ou token que é do tipo limited)
    if (res.temp_token) {
      localStorage.setItem("barboo_temp_token", res.temp_token);
    } else if (res.token) {
      // alguns backends só colocam token + must_change_password flag
      localStorage.setItem("barboo_temp_token", res.token);
    }
    // NÃO salva barboo_token normal nem user ainda
  } else {
    if (res.token) localStorage.setItem("barboo_token", res.token);
    if (res.user) localStorage.setItem("barboo_user", JSON.stringify(res.user));
    localStorage.removeItem("barboo_temp_token");
  }
}
