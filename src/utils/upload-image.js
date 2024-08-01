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
    const storageRef = ref(storage, `${folder}/${file.originalname}`);

    const metaData = {
      contentType: file.mimetype,
    };

    const snapshot = await uploadBytesResumable(
      storageRef,
      file.buffer,
      metaData
    );
    const downloadURL = await getDownloadURL(snapshot.ref);

    return downloadURL;
  } catch (err) {
    console.log("Caught error on upload-image js : ", err.message);
    return null;
  }
};

module.exports = uploadImage;
