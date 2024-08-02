// supplierStore.js
import {create} from 'zustand';

const useSupplierEma = create((set) => ({
  supplierEmail: '',
  setSupplierEmail: (email) => set({ supplierEmail: email }),
}));

export default useSupplierStore;
