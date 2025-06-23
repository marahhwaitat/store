import { Router } from "express";
import { ProductController } from "../controllers/product.controller";
import { validationMiddleWare } from "../middlewares/validation.middleware";
import { CreateProductDto } from "../dto/product/createProduct.dto";
import { UpdateProductDto } from "../dto/product/update-product.dto";

const router = Router();
router.get("/", ProductController.getAll);
router.get("/:id", ProductController.getById);
router.post(
  "/",
  validationMiddleWare(CreateProductDto),
  ProductController.create
);
router.put(
  "/:id",
  validationMiddleWare(UpdateProductDto),
  ProductController.update
);
router.delete("/:id", ProductController.delete);

export default router;
