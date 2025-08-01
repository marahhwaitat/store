import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Cart } from "../entity/cart.entity";
import { CartProduct } from "../entity/cartProduct.entity";
import { Product } from "../entity/product.entity";
import { User } from "../entity/user.entity";
import { plainToInstance } from "class-transformer";
import { validate, Validate } from "class-validator";
import { AddProductToCartDto } from "../dto/cart.dto";
import { authMiddleware } from "../middlewares/auth.middleware.";
interface AuthRequest extends Request {
  user?: { userId: string };
}

const cartRepo = AppDataSource.getRepository(Cart);
const userRepo = AppDataSource.getRepository(User);
const productRepo = AppDataSource.getRepository(Product);
const cartProductRepo = AppDataSource.getRepository(CartProduct);

export class CartController {
  // add product
  static async addProduct(req: AuthRequest, res: Response) {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const { productId, quantity } = req.body;
    if (!productId || !quantity) {
      res.status(400).json({ message: "productId and quantity are required" });
      return;
    }

    let cart = await cartRepo.findOne({
      where: {
        user: { id: userId },
        isActive: true,
      },
      relations: ["user"],
    });

    if (!cart) {
      const user = await userRepo.findOneBy({ id: req.params.userId });
      if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
      }

      cart = cartRepo.create({ user, isActive: true });
      await cartRepo.save(cart);
    }

    const product = await productRepo.findOneBy({ id: productId });
    if (!product) {
      res.status(404).json({ message: "Product not found" });
      return;
    }

    const existing = await cartProductRepo.findOne({
      where: {
        cart: { id: cart.id },
        product: { id: productId },
      },
      relations: ["cart", "product"],
    });

    if (existing) {
      existing.quantity += quantity;
      await cartProductRepo.save(existing);
      res.json(existing);
      return;
    }

    const newItem = cartProductRepo.create({
      cart,
      product,
      quantity: parseInt(quantity as string, 10),
    });

    await cartProductRepo.save(newItem);

    res.status(201).json(newItem);
    return;
  }
  // get cart contents
  static async getCartContents(req: AuthRequest, res: Response) {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const cart = await cartRepo.findOne({
      where: { id: req.params.id },
      relations: ["cartProducts", "cartProducts.product", "user"],
    });

    if (!cart) {
      res.status(404).json({ message: "Cart not found" });
      return;
    }

    res.json(cart);
    return;
  }

  // remove Product
  static async removeProduct(req: AuthRequest, res: Response) {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const { cartId, productId } = req.params;

    const cart = await cartRepo.findOne({
      where: { id: cartId },
      relations: ["user"],
    });

    if (!cart) {
      res.status(404).json({ message: "Cart not found" });
      return;
    }

    const item = await cartProductRepo.findOne({
      where: {
        cart: { id: cart.id },
        product: { id: productId },
      },
      relations: ["cart", "product"],
    });
    if (!item) {
      res.status(404).json({ message: "Item not found in cart" });
      return;
    }

    await cartProductRepo.remove(item);
    res.json({ message: "Product removed from cart" });
    return;
  }
}
