import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Category } from "../entity/category.entity";
import { CreateCategoryDto, UpdateCategoryDto } from "../dto/category.dto";
import { plainToInstance } from "class-transformer";
import { validate, Validate } from "class-validator";
import { Product } from "../entity/product.entity";
import { error } from "console";
import { Otp } from "../entity/otp.entity";

const categoryRepo = AppDataSource.getRepository(Category);

export class CategoryController {
  // get all category
  static async getAll(req: Request, res: Response)  {
    try {
      const categories = await categoryRepo.find({ relations: ["products"] });
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  }
  /// get category
  static async getById(req: Request, res: Response)   {
    try {
      const category = await categoryRepo.findOne({
        where: { id: req.params.id },
        relations: ["products"],
      });

      if (!category) {
        res.status(404).json({ message: "Category not found" });
        return;
      }
      res.json(category);
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  }
  ////create category
  static async create(req: Request, res: Response)  {
    const dto = plainToInstance(CreateCategoryDto, req.body);
    const errors = await validate(dto);
    if (errors.length > 0) {
       res.status(400).json({ message: "Validation failed", errors });
       return;
    }

    try {
      const category = categoryRepo.create(dto);
      const result = await categoryRepo.save(category);
      res.status(201).json(result);
    } catch (error) {
      res.status(400).json({ message: "Error creating category", error });
    }
  }
  // updata category
  static async update(req: Request, res: Response)   {
    const dto = plainToInstance(UpdateCategoryDto, req.body);
    const errors = await validate(dto);

    if (errors.length > 0) {
       res.status(400).json({ message: "Validation failed", errors });
     return;
    }
    
    try {
      const category = await categoryRepo.findOneBy({ id: req.params.id });
      if (!category)
      {  res.status(404).json({ message: "Category not found" });
       return;}

     await categoryRepo.update(category.id, dto);
     await category.reload()
      res.json(category);
    } catch (error) {
      res.status(400).json({ message: "Error updating category", error });
      return;
    }
  
  }
  // delete a category
  static async delete(req: Request, res: Response)  {
    try {
      const category = await categoryRepo.findOneBy({ id: req.params.id });
      if (!category)
         res.status(404).json({ message: "Category not found" });
        return;

      await categoryRepo.remove(category);
      res.json({ message: "Category deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  }
}

export default CategoryController;
