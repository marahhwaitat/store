import { NextFunction, Request, Response, Router } from "express";
import { DocumentController } from "../controllers/document.controller";
import { upload } from '../middlewares/uplode.middleware'; 
const router = Router();


router.post('/upload', upload.single('document'), DocumentController.uploadFile);


export default router;
