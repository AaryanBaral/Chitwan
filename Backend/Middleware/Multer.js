import multer from "multer";

// Use memory storage so files can be handled manually (e.g., save locally or to cloud)
const storage = multer.memoryStorage();

const multerUpload = multer({
    storage,
    limits: {
        fileSize: 1024 * 1024 * 5 // 5MB
    }
});

const singleFile = multerUpload.single('single');
const multipleFiles = multerUpload.array('files', 10);

export { singleFile, multerUpload, multipleFiles };