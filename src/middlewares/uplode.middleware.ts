import * as multer from 'multer';
import * as path from 'path';
import { Request } from 'express';
import { FileFilterCallback } from 'multer'



const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); 
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (
  req: Request,
  file: multer.File,
  cb: FileFilterCallback
) => {
  const allowedExt = ['.jpeg', '.jpg', '.png', ];
  const allowedMime = ['image/jpeg', 'image/jpg', 'image/png'];

  const ext = path.extname(file.originalname).toLowerCase();
  const mime = file.mimetype.toLowerCase();

  if (allowedExt.includes(ext) && allowedMime.includes(mime)) {
    cb(null, true);
  } else {
    cb(new Error('Only .jpeg, .jpg, .png, and .pdf files are allowed'), false);
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB limit
});
