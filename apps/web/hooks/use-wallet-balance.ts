import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";

export function useWalletBalance() {
  return useQuery({
    queryKey: ["wallet-balance"],
    queryFn: async () => {
      const { data } = await api.get("/wallet/balance");
      return data.balance as number;
    },
  });
}
