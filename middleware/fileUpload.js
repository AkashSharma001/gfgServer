const { v1: uuidv1 } = require("uuid");
const { diskStorage } = require("multer");
const multer = require("multer");
const { ref, uploadBytes, listAll, deleteObject } = require("firebase/storage");
const storage = require("../firestore/firebase");

const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpeg",
  "image/jpg": "jpg",
};



const memoStorage = multer.memoryStorage();
const upload = multer({ memoStorage });

const fileUpload = async (req, res) => {
  const file = req.file;
  const ext = MIME_TYPE_MAP[file.mimetype];
  const fileName = uuidv1() + "." + ext;
  console.log(fileName);
  const imageRef = ref(storage, fileName);
  const metatype = { contentType: file.mimetype, name: file.originalname };
  await uploadBytes(imageRef, file.buffer, metatype)
    .then((snapshot) => {})
    .catch((error) => console.log(error.message));
  return fileName;
};

const fileDelete = async (req) => {
  console.log(req);
  const filePath = req;
  const deleteRef = ref(storage, filePath);
  await deleteObject(deleteRef).catch((error) => console.log(error.message));
};

// module.exports = fileUpload;
exports.upload = upload;
exports.fileUpload = fileUpload;
exports.fileDelete = fileDelete;
