import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Cart } from "../entity/cart.entity";
import { CartProduct } from "../entity/cartProduct.entity";
import { Product } from "../entity/product.entity";
import { User } from "../entity/user.entity";
import { plainToInstance } from "class-transformer";
import { validate, Validate } from "class-validator";
import { AddProductToCartDto } from "../dto/cart.dto";
import {authMiddleware} from "../middlewares/auth.middleware.";
interface AuthRequest extends Request {
  user?: { userId: number };
}

const cartRepo = AppDataSource.getRepository(Cart);
const userRepo = AppDataSource.getRepository(User);
const productRepo = AppDataSource.getRepository(Product);
const cartProductRepo = AppDataSource.getRepository(CartProduct);

export class CartController {

  
// add product
static async addProduct(req: AuthRequest, res: Response): Promise<any> {
  const userId = req.user?.userId;
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { productId, quantity } = req.body;
  if (!productId || !quantity) {
    return res.status(400).json({ message: "productId and quantity are required" });
  } 
 
  let cart = await cartRepo.findOne({
    where: {
      user: { id: req.params.userId },
      isActive: true,
    },
    relations: ['user'],
  });

 
  if (!cart) {
    const user = await userRepo.findOneBy({ id: req.params.userId });
    if (!user) return res.status(404).json({ message: "User not found" });

    cart = cartRepo.create({ user, isActive: true });
    await cartRepo.save(cart);
  }


  const product = await productRepo.findOneBy({ id: productId });
  if (!product) return res.status(404).json({ message: "Product not found" });

 
  const existing = await cartProductRepo.findOneBy({
    cartId: cart.id,
    productId,
  });

  if (existing) {
    existing.quantity += parseInt(quantity as string, 10);
    await cartProductRepo.save(existing);
    return res.json(existing);
  }

  
  const newItem = cartProductRepo.create({
    cart,
    product,
    quantity: parseInt(quantity as string, 10),
  });

  await cartProductRepo.save(newItem);

  return res.status(201).json(newItem);
}
  // get cart contents 
static async getCartContents(req: AuthRequest, res: Response): Promise<any> {
  const userId = req.user?.userId;
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const cart = await cartRepo.findOne({
    where: { id: req.params.id },
    relations: ["cartProducts", "cartProducts.product", "user"],
  });

  if (!cart) return res.status(404).json({ message: "Cart not found" });

  
 

  return res.json(cart);
}



  // remove Product
static async removeProduct(req: AuthRequest, res: Response): Promise<any> {
  const userId = req.user?.userId;
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { cartId, productId } = req.params;

  
  const cart = await cartRepo.findOne({
    where: { id: cartId },
    relations: ['user'],
  });

  if (!cart) {
    return res.status(404).json({ message: "Cart not found" });
  }

  
 
 
  const item = await cartProductRepo.findOneBy({ cartId, productId });
  if (!item) {
    return res.status(404).json({ message: "Item not found in cart" });
  }

 
  await cartProductRepo.remove(item);
  return res.json({ message: "Product removed from cart" });
}
}