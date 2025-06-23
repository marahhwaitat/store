import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Document } from "../entity/document.entity";
import * as multer from "multer";
import path = require("path");

export class DocumentController {
  static async uploadFile(req: Request, res: Response): Promise<any> {
    try {
      const file = (req as any).file;

      if (!file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const document = new Document();
      document.name = file.filename;
      document.url = `/upload/${file.filename}`;
      const saved = await AppDataSource.getRepository(Document).save(document);
      return res.status(201).json(saved);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Server error" });
    }
  }
}
