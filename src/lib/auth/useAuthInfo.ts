import { useEffect, useState } from "react";
import { usersApi } from "@/lib/api/users";

export function useAuthInfo() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const me = await usersApi.me(); 
        setUser(me);
      } catch (err) {
        console.warn("Não foi possível carregar o usuário logado:", err);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  return { user, loading };
}
