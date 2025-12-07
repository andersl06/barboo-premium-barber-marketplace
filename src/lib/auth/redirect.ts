import { barbershopsApi } from "@/lib/api/barbershops";

export async function redirectByRole(user: any, navigate: any) {
  if (user.role === "client") return navigate("/client/home");

  if (user.role === "barber") return navigate("/barber/agenda");

  if (user.role === "owner") {
    try {
      const shop = await barbershopsApi.getMine();
      if (shop?.id) return navigate("/owner/dashboard");
    } catch (err) {
      console.log("Owner ainda não tem barbearia.");
    }
    return navigate("/owner/onboarding");
  }

  return navigate("/client/home");
}
