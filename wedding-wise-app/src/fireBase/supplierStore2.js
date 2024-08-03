// supplierStore.js
import { create } from 'zustand';

// Define the Zustand store for managing a single supplier
export const useSupplierStore2 = create((set) => ({
  // Initial state for the supplier
  supplier: null,

  // Method to set the supplier data
  setSupplier: (supplierData) => set({ supplier: supplierData }),

  // Method to clear the supplier data
  clearSupplier: () => set({ supplier: null }),
}));