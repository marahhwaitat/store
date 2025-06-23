import { Router } from 'express';
import { CartController } from '../controllers/cart.controller';
import { AddProductToCartDto} from '../dto/cart.dto';
import { validationMiddleWare } from '../middlewares/validation.middleware';
import { authMiddleware } from '../middlewares/auth.middleware.';
const router = Router();

router.post('/add', authMiddleware, validationMiddleWare(AddProductToCartDto), CartController.addProduct);

router.get('/:id',authMiddleware , CartController.getCartContents);
router.delete('/:id',authMiddleware ,CartController.removeProduct);

export default router;
