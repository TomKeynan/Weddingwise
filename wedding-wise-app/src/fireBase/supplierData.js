// supplierStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Define the Zustand store for managing a single supplier
export const useSupplierData = create(
  persist(
    (set) => ({
      // Initial state for the supplier
      relevantSupplier: {},

      // Method to set the supplier data
      setRelevantSupplier: (supplierData) => set({ relevantSupplier: supplierData }),

      // Method to clear the supplier data
      clearRelevantSupplier: () => set({ relevantSupplier: {} }),
    }),
    {
      name: 'relevant-supplier-storage', // Name of the item in session storage
      getStorage: () => sessionStorage,  // Use sessionStorage instead of localStorage
    }
  )
);
