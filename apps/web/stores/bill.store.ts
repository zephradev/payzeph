import { create } from "zustand";

type BillType = "airtime" | "data" | "electricity" | "cable-tv";

interface BillState {
  selectedNetwork: string;
  selectedProvider: string;
  currentBillType: BillType | null;
  setSelectedNetwork: (network: string) => void;
  setSelectedProvider: (provider: string) => void;
  setCurrentBillType: (type: BillType | null) => void;
  reset: () => void;
}

export const useBillStore = create<BillState>()((set) => ({
  selectedNetwork: "",
  selectedProvider: "",
  currentBillType: null,
  setSelectedNetwork: (selectedNetwork) => set({ selectedNetwork }),
  setSelectedProvider: (selectedProvider) => set({ selectedProvider }),
  setCurrentBillType: (currentBillType) => set({ currentBillType }),
  reset: () =>
    set({ selectedNetwork: "", selectedProvider: "", currentBillType: null }),
}));
