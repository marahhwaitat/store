import { Router } from "express";
import { OrderController } from "../controllers/order.controller";
import { CreateOrderDto, UpdateOrderDto } from "../dto/order.dto";
import { validationMiddleWare } from "../middlewares/validation.middleware";
 
const router = Router();

router.get ('/:id',OrderController.getById);
router.get('/',OrderController.getAll);
router.post(
  '/',
  validationMiddleWare(CreateOrderDto),OrderController.create);
router.put ('/',validationMiddleWare(UpdateOrderDto),OrderController.update);
router.delete('/:id',OrderController.delete);

export default router;