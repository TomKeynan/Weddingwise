import { create } from 'zustand';
import { db } from '../fireBase/firebase';
import { doc, getDocs, onSnapshot, query, where, collection } from "firebase/firestore";

const useSupplierStore = create((set) => ({
  suppliers: {},
  loading: false,
  fetchSupplierData: async (supplierEmail) => {
  
    set({ loading: true });
    try {
      // Fetch supplier details
      const userRef = collection(db, "users");
      const q = query(userRef, where("email", "==", supplierEmail));
      const querySnapshot = await getDocs(q);
      let supplier = null;
      if (!querySnapshot.empty) {
        supplier = querySnapshot.docs[0].data();
      }

      if (supplier) {
        // Fetch supplier comments
        const unSub = onSnapshot(
          doc(db, "supplierComments", querySnapshot.docs[0].id),
          (docSnapshot) => {
            if (docSnapshot.exists()) {
              const commentsData = docSnapshot.data().comments || [];
              const commentsWithDate = commentsData.map((comment) => ({
                ...comment,
                commentDate: comment.commentTime
                  ? comment.commentTime.toDate().toLocaleDateString("en-GB")
                  : "",
              }));
              commentsWithDate.sort((a, b) => (b.commentTime || 0) - (a.commentTime || 0));
              set((state) => ({
                suppliers: {
                  ...state.suppliers,
                  [supplierEmail]: {
                    ...supplier,
                    comments: commentsWithDate,
                  },
                },
                loading: false,
              }));
            } else {
              set((state) => ({
                suppliers: {
                  ...state.suppliers,
                  [supplierEmail]: { ...supplier, comments: [] },
                },
                loading: false,
              }));
            }
          },
          (error) => {
            console.error("Error fetching comments: ", error);
            set({ loading: false });
          }
        );

        // Cleanup function
        return () => {
          unSub();
        };
      }
    } catch (error) {
      console.error("Error fetching supplier data: ", error);
      set({ loading: false });
    }
  },
}));

export default useSupplierStore;
