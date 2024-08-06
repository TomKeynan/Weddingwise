
import { create } from 'zustand';


export const useSupplierData = create((set) => ({

  supplierData: {},

  setSupplier: (supplierData) => set({ supplierData }),

  clearSupplier: () => set({ supplierData: {} }),
}));
