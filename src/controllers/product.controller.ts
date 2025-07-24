import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Product } from "../entity/product.entity";
import { Category } from "../entity/category.entity";
import { Document } from "../entity/document.entity";

const productRepo = AppDataSource.getRepository(Product);
const categoryRepo = AppDataSource.getRepository(Category);
const documentRepo = AppDataSource.getRepository(Document);

export class ProductController {
  //get all products
  static async getAll(req: Request, res: Response) {
    const products = await productRepo.find({ relations: ["category"] });
    res.json(products);
  }
  // get product
  static async getById(req: Request, res: Response) {
    const product = await productRepo.findOne({
      where: { id: req.params.id },
      relations: ["category"],
    });

    if (!product) {
      res.status(404).json({ message: "Product not found" });
      return;
    }
    res.json(product);
  }
  /// create product
  static async create(req: Request, res: Response) {
    try {
      const [category, document] = await Promise.all([
        categoryRepo.findOne({ where: { id: req.body.categoryId } }),
        documentRepo.findOne({ where: { id: req.body.documentId } }),
      ]);
      if (!category) {
        res.status(400).json({
          message: `Category with id ${req.body.categoryId} not found.`,
        });
        return;
      }

      if (!document) {
        res.status(400).json({
          message: `Document with id ${req.body.documentId} not found.`,
        });
        return;
      }

      const existingProduct = await productRepo.findOne({
        where: { documents: { id: req.body.documentId } },
        relations: ["documents"],
      });

      if (existingProduct) {
        res.status(400).json({
          message: `Document with id ${req.body.documentId} is already assigned to another product.`,
        });
        return;
      }

      const product = productRepo.create({
        name: req.body.name,
        price: req.body.price,
        quantity: req.body.quantity,
        category: { id: req.body.categoryId },
        documents: [document],
      });

      const result = await productRepo.save(product);
      res.status(201).json(result);
    } catch (error) {
      res.status(400).json({ message: "Error creating product", error });
    }
  }

  // update product
  static async update(req: Request, res: Response) {
    try {
      const product = await productRepo.findOne({
        where: { id: req.params.id },
        relations: ["documents"], // load related documents if needed
      });

      if (!product) {
        res.status(404).json({ message: "Product not found" });
        return;
      }

      if (req.body.name) product.name = req.body.name;
      if (req.body.price) product.price = req.body.price;
      if (req.body.quantity) product.quantity = req.body.quantity;
      if (req.body.categoryId)
        product.category = { id: req.body.categoryId } as any;

      if (req.body.documentId) {
        // Check if document exists
        const document = await documentRepo.findOne({
          where: { id: req.body.documentId },
        });
        if (!document) {
          res.status(400).json({
            message: `Document with id ${req.body.documentId} not found.`,
          });
          return;
        }

        // Check if the document is already used by another product
        const existingProduct = await productRepo.findOne({
          where: {
            documents: { id: req.body.documentId },
            id: product.id, // exclude the current product itself
          },
          relations: ["documents"],
        });

        if (existingProduct) {
          res.status(400).json({
            message: `Document with id ${req.body.documentId} is already assigned to another product.`,
          });
          return;
        }

        // Assign the new document to the product
        product.documents = [document];
      }

      const result = await productRepo.save(product);
      res.json(result);
    } catch (error) {
      res.status(400).json({ message: "Error updating product", error });
    }
  }

  //  delete product
  static async delete(req: Request, res: Response): Promise<any> {
    const {affected} = await productRepo.softDelete({ id: req.params.id });
    if (!affected) {
      res.status(404).json({ message: "Product not found" });
      return;
    }

   
    res.json({ message: "Product deleted successfully" });
  }
}
