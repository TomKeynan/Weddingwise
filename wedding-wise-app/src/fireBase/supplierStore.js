import { create } from 'zustand';
import { db } from '../fireBase/firebase';
import { doc, getDocs, onSnapshot, query, where, collection } from "firebase/firestore";

const useSupplierStore = create((set) => ({
  supplierFirebase: null,
  loadingFirebaseSupplier: false,

  setLoading: (isLoading) => set({ loadingFirebaseSupplier: isLoading }),

  fetchSupplierData: async (supplierEmail) => {
    set({ loadingFirebaseSupplier: true });

    try {
      const userRef = collection(db, "users");
      const q = query(userRef, where("email", "==", supplierEmail));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        set({ loadingFirebaseSupplier: false });
        return;
      }

      const supplier = querySnapshot.docs[0].data();
      const commentsRef = doc(db, "supplierComments", querySnapshot.docs[0].id);
      const unSub = onSnapshot(commentsRef, (docSnapshot) => {
        const commentsData = docSnapshot.exists()
          ? docSnapshot.data().comments || []
          : [];
        const commentsWithDate = commentsData.map((comment) => ({
          ...comment,
          commentDate: comment.commentTime
            ? comment.commentTime.toDate().toLocaleDateString("en-GB")
            : "",
        }));
        commentsWithDate.sort((a, b) => (b.commentTime || 0) - (a.commentTime || 0));

        set({
          supplierFirestore: { ...supplier, comments: commentsWithDate },
          loadingFirebaseSupplier: false,
        });
      }, (error) => {
        console.error("Error fetching comments: ", error);
        set({ loadingFirebaseSupplier: false });
      });

      return () => {
        unSub();
      };
    } catch (error) {
      console.error("Error fetching supplier data: ", error);
      set({ loadingFirebaseSupplier: false });
    }
  },
}));

export default useSupplierStore;
