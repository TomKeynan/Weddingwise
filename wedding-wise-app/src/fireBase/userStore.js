import { doc, getDoc } from "firebase/firestore";
import { create } from "zustand";
import { db } from "./firebase";

// Define the Zustand store for managing user state
export const useUserStore = create((set) => ({
  // Initial state
  currentUser: null,  // Stores the current user information
  loadingUserFirebase: true,    // Indicates whether the user information is being loaded

  // Method to fetch user information from Firestore based on user ID (uid)
  fetchUserInfo: async (uid) => {
    if (!uid) {
      // If UID is null, set currentUser to null and isLoading to false
      return set({ currentUser: null, isLoading: false });
    }

    try {
      // Reference to the user document in Firestore
      const docRef = doc(db, "users", uid);
      // Fetch the document snapshot from Firestore
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        // If the document exists, update currentUser with the fetched data
        set({ currentUser: docSnap.data(), isLoading: false });
      } else {
        // If the document does not exist, set currentUser to null
        set({ currentUser: null, isLoading: false });
      }
    } catch (err) {
      // Log any error and set currentUser to null
      console.log(err);
      set({ currentUser: null, isLoading: false });
    }
  },

  // Method to handle user logout
  logout: () => set({ currentUser: null, isLoading: false }),
  setLoading: (loading) => set({ loadingUserFirebase: loading }), 
}));
