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

const uploadImage = async (file, folder) => {
  try {
    let imageFile = file.originalname;
    imageFile = imageFile.replace(/\s+/g, "");

    const storageRef = ref(storage, `${folder}/${imageFile}`);

    const metaData = {
      contentType: file.mimetype,
    };
    const snapshot = await uploadBytesResumable(
      storageRef,
      file.buffer,
      metaData
    );
    const downloadURL = await getDownloadURL(snapshot.ref);

    // Return all download URLs
    return downloadURL;
  } catch (err) {
    console.log("Caught error on upload-image js : ", err.message);
    return null;
  }
};

module.exports = uploadImage;
