import multer from "multer";

const multerUpload = multer({
    limits:{
        fileSize: 1024*1024*5
    }
})

const singleFile = multerUpload.single('single')
const multipleFiles = multerUpload.array('files',10)
export {singleFile,multerUpload,multipleFiles}