// This component manages the user state using Zustand and fetches user information from Firestore.

import { doc, getDoc } from "firebase/firestore";
import { create } from "zustand";
import { db } from "./firebase";

// Define the Zustand store for managing user state
export const useUserStore = create((set) => ({
  // Initial state
  currentUser: null,  // Stores the current user information
  isLoading: true,    // Indicates whether the user information is being loaded
  // Method to fetch user information from Firestore based on user ID (uid)
  fetchUserInfo: async (uid) => {
    if (!uid) {
      // If im logged out uid will be null!
      return set({ currentUser: null, isLoading: false });
    }

    try {
      debugger;
      // Reference to the user document in Firestore
      const docRef = doc(db, "users", uid);
      // Fetch the document snapshot from Firestore
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        // If the document exists, update currentUser with the fetched data and set isLoading to false
        set({ currentUser: docSnap.data(), isLoading: false });
      } else {
        // If the document does not exist, set currentUser to null and isLoading to false
        set({ currentUser: null, isLoading: false });
      }
    } catch (err) {
      // If there is an error, log it and set currentUser to null and isLoading to false
      console.log(err);
      return set({ currentUser: null, isLoading: false });
    }
  },

}));
