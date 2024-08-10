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

      // Method to clear the supplier data and session storage
      clearRelevantSupplier: () => {
        set({ relevantSupplier: {} });
        sessionStorage.removeItem('relevant-supplier-storage'); // Clear the session storage
      },
    }),
    {
      name: 'relevant-supplier-storage', // Name of the item in session storage
      storage: sessionStorage,  // Use sessionStorage instead of localStorage
    }
  )
);
