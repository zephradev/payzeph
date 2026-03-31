import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import type { Transaction } from "@/lib/mock-data";

interface UseTransactionsOptions {
  page?: number;
  perPage?: number;
}

export function useTransactions({ page = 1, perPage = 10 }: UseTransactionsOptions = {}) {
  return useQuery({
    queryKey: ["transactions", page, perPage],
    queryFn: async () => {
      const { data } = await api.get("/transactions", {
        params: { page, perPage },
      });
      return data as {
        data: Transaction[];
        total: number;
        page: number;
        perPage: number;
        totalPages: number;
      };
    },
  });
}
