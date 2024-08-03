import { db } from '../fireBase/firebase';
import { doc, getDoc, getDocs, query, where, collection } from "firebase/firestore";

export const fetchSupplierData = async (supplierEmail) => {
  try {
    const userRef = collection(db, "users");
    const q = query(userRef, where("email", "==", supplierEmail));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      console.log('No supplier found with this email.');
      return null;
    }

    const supplier = querySnapshot.docs[0].data();
    const supplierId = querySnapshot.docs[0].id;
    const commentsRef = doc(db, "supplierComments", supplierId);
    const commentsSnapshot = await getDoc(commentsRef);

    const commentsData = commentsSnapshot.exists()
      ? commentsSnapshot.data().comments || []
      : [];
    const commentsWithDate = commentsData.map((comment) => ({
      ...comment,
      commentDate: comment.commentTime
        ? comment.commentTime.toDate().toLocaleDateString("en-GB")
        : "",
    }));
    commentsWithDate.sort((a, b) => (b.commentTime || 0) - (a.commentTime || 0));

    return {
      ...supplier,
      comments: commentsWithDate,
    };
  } catch (error) {
    console.error("Error fetching supplier data: ", error);
    throw error; // Re-throw error to be handled by the caller
  }
};
