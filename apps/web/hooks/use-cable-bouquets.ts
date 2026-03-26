import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";

export function useCableBouquets(provider: string) {
  return useQuery({
    queryKey: ["cable-bouquets", provider],
    queryFn: async () => {
      const { data } = await api.get("/bills/cable-tv/bouquets", {
        params: { provider },
      });
      return data as any[];
    },
    enabled: !!provider,
  });
}
