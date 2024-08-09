import { create } from "zustand";

export const useGlobalStore = create((set) => ({
  globalLoading: false,
  setGlobalLoading: (loading) => set({ globalLoading: loading }),
}));