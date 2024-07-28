const config = require("../config/firebase");

const { initializeApp } = require("firebase/app");
initializeApp(config);
const {
  getStorage,
  ref,
  getDownloadURL,
  uploadBytesResumable,
} = require("firebase/storage");

const storage = getStorage();

const uploadImage = async (file, path) => {
  try {
    const storageRef = ref(storage, `${path}/${file.originalname}`);

    const metadata = {
      contentType: file.mimetype,
    };

    const snapshot = await uploadBytesResumable(
      storageRef,
      file.buffer,
      metadata
    );

    const downloadURL = await getDownloadURL(snapshot.ref);

    return {
      success: true,
      message: "File uploaded successfully",
      downloadURL,
    };
  } catch (error) {
    return {
      success: false,
      message: "File upload failed",
      error: error.message,
    };
  }
};

module.exports = uploadImage;
