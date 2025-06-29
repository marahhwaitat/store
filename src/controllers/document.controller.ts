import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Document } from "../entity/document.entity";
import path = require("path");

export class DocumentController {
  static async uploadFile(req: Request, res: Response) {
    try {
      const file = (req as any).file;

      if (!file) {
       res.status(400).json({ message: "No file uploaded" });
        return ;
      }

      const document = new Document();
      document.name = file.filename;
      document.url = `/upload/${file.filename}`;
      const saved = await AppDataSource.getRepository(Document).save(document);
       res.status(201).json(saved);
       return;
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
       return ;
    }
  }
}
