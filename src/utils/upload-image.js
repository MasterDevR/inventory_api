const {
  getStorage,
  ref,
  getDownloadURL,
  uploadBytesResumable,
} = require("firebase/storage");
const { initializeApp } = require("firebase/app");
const config = require("../config/firebase.config");
initializeApp(config);
const storage = getStorage();

const uploadImage = async (files, folder) => {
  try {
    // Convert files object to an array of values
    const fileArray = Object.values(files);

    // Check if fileArray is not empty
    if (fileArray.length === 0) {
      throw new Error("No files to upload");
    }

    // Array to hold the download URLs
    const downloadURLs = [];

    for (let File of fileArray) {
      for (let file = 0; file < File.length; file++) {
        const storageRef = ref(storage, `${folder}/${File[file].originalname}`);

        const metaData = {
          contentType: File[file].mimetype,
        };
        const snapshot = await uploadBytesResumable(
          storageRef,
          File[file].buffer,
          metaData
        );
        const downloadURL = await getDownloadURL(snapshot.ref);

        downloadURLs.push(downloadURL);
      }
    }

    // Return all download URLs
    return downloadURLs;
  } catch (err) {
    console.log("Caught error on upload-image js : ", err.message);
    return null;
  }
};

module.exports = uploadImage;
