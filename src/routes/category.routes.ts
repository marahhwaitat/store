import { Router}from 'express';
import CategoryController from '../controllers/category.controller';
console.log(typeof CategoryController.getById); // should print: function

const router = Router();
router.get ("/" ,CategoryController.getAll);
router.get("/:id",CategoryController.getById);
router.post("/",CategoryController.create);
router.put("/",CategoryController.update);
router.delete("/:id" ,CategoryController.delete);

export default router ;