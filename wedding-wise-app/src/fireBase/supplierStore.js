import { create } from 'zustand';
import { db } from '../fireBase/firebase';
import { doc, getDocs, onSnapshot, query, where, collection } from "firebase/firestore";

const useSupplierStore = create((set) => ({
  suppliers: {},
  loadingFirebaseSupplier: false,
  currentSupplierEmail: '',

  // Method to set loading state
  setLoading: (isLoading) => set({ loadingFirebaseSupplier: isLoading }),

  // Method to set current supplier email
  setCurrentSupplierEmail: (email) => set({ currentSupplierEmail: email }),

  fetchSupplierData: async (supplierEmail) => {
    set({ loadingFirebaseSupplier: true }); // Start loading

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
        const commentsRef = doc(db, "supplierComments", querySnapshot.docs[0].id);
        const unSub = onSnapshot(
          commentsRef,
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
                loadingFirebaseSupplier: false, // Stop loading
              }));
            } else {
              set((state) => ({
                suppliers: {
                  ...state.suppliers,
                  [supplierEmail]: { ...supplier, comments: [] },
                },
                loadingFirebaseSupplier: false, // Stop loading
              }));
            }
          },
          (error) => {
            console.error("Error fetching comments: ", error);
            set({ loadingFirebaseSupplier: false }); // Stop loading on error
          }
        );

        // Cleanup function
        return () => {
          unSub(); // Ensure cleanup
        };
      } else {
        set({ loadingFirebaseSupplier: false }); // Stop loading if no supplier found
      }
    } catch (error) {
      console.error("Error fetching supplier data: ", error);
      set({ loadingFirebaseSupplier: false }); // Stop loading on error
    }
  },
}));

export default useSupplierStore;
