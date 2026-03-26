import { create } from "zustand";
import type { Transaction } from "@/lib/mock-data";

interface WalletState {
  balance: number;
  transactions: Transaction[];
  isLoading: boolean;
  setBalance: (balance: number) => void;
  setTransactions: (transactions: Transaction[]) => void;
  setLoading: (isLoading: boolean) => void;
}

export const useWalletStore = create<WalletState>()((set) => ({
  balance: 0,
  transactions: [],
  isLoading: false,
  setBalance: (balance) => set({ balance }),
  setTransactions: (transactions) => set({ transactions }),
  setLoading: (isLoading) => set({ isLoading }),
}));
