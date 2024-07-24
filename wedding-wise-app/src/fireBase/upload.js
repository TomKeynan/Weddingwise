
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";

import { storage } from "./firebase";

// Define an async function named 'upload' that takes a 'file' parameter
const upload = async (file) => {

  const date = new Date();
  // Create a reference to the storage location, appending the current date and the file name to ensure a unique path
  const storageRef = ref(storage, `images/${date + file.name}`);

  // Start the file upload task using the storage reference and the file
  const uploadTask = uploadBytesResumable(storageRef, file);

  // Return a new Promise to handle asynchronous upload operations
  return new Promise((resolve, reject) => {
    // Attach an event listener to the upload task
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // Calculate the upload progress as a percentage
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        // Log the upload progress to the console
        console.log("Upload is " + progress + "% done");
      },
      (error) => {
        // If an error occurs during the upload, reject the Promise with an error message
        reject("Something went wrong!" + error.code);
      },
      () => {
        // Once the upload is complete, get the download URL of the uploaded file
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          // Resolve the Promise with the download URL
          resolve(downloadURL);
        });
      }
    );
  });
};

// Export the 'upload' function as the default export of this module
export default upload;
