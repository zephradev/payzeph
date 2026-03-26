import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";

export function useDataBundles(network: string) {
  return useQuery({
    queryKey: ["data-bundles", network],
    queryFn: async () => {
      const { data } = await api.get("/bills/data/bundles", {
        params: { network },
      });
      return data as any[];
    },
    enabled: !!network,
  });
}
