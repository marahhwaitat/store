import { Router } from "express";
import { OrderController } from "../controllers/order.controller";
import { CreateOrderDto, UpdateOrderDto } from "../dto/order.dto";
import { validationMiddleWare } from "../middlewares/validation.middleware";
import { authMiddleware } from "../middlewares/auth.middleware.";
 
const router = Router();

router.get('/:id', OrderController.getById);
router.get('/', OrderController.getAll);
router.post('/',authMiddleware, OrderController.create);
router.post('/callback', OrderController.paymentCallback);
router.put('/:id', validationMiddleWare(UpdateOrderDto), OrderController.update);
router.delete('/:id', OrderController.delete);

export default router;