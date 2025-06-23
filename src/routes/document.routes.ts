import { NextFunction, Request, Response, Router } from "express";
import * as multer from "multer";
import { AppDataSource } from "../data-source";
import { DocumentController } from "../controllers/document.controller";
import { upload } from '../middlewares/uplode.middleware'; 
const router = Router();


router.post('/upload', upload.single('document'), DocumentController.uploadFile);


export default router;
