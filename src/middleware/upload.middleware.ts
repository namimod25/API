import multer from "multer";
import type { FileFilterCallback } from "multer";
import path from "path";
import type {Request} from 'express';

const storage = multer.memoryStorage();

const fileFilter = ( _req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (ext === ".jpg" || ext === ".jpeg" || ext === ".png") {
    cb(null, true); 
  } else {
    cb(new Error("Format file tidak didukung(.jpeg .jpg .png)"));
  }
}

const upload = multer({storage,fileFilter });


export default upload

