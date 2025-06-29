import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Order } from "../entity/order.entity";
import { User } from "../entity/user.entity";
import { CartProduct } from "../entity/cartProduct.entity";
import axios from "axios";
import { Status } from "../enums/status";
import { calculateTotalAmount } from "../utils/calculateAmount";
import { Cart } from "../entity/cart.entity";
import {initiatePayment} from "../services/payment";
const orderRepo = AppDataSource.getRepository(Order);
const userRepo = AppDataSource.getRepository(User);
const cartProductRepo = AppDataSource.getRepository(CartProduct);
const cartRepo = AppDataSource.getRepository(Cart);

// getall
export class OrderController {
  static async getAll(req: Request, res: Response) {
    const orders = await orderRepo.find({ relations: ["user"] });
    res.json(orders);
  }

  static async getById(req: Request, res: Response) {
    const order = await orderRepo.findOne({
      where: { id: req.params.id },
      relations: ["user"],
    });

    if (!order) {
      res.status(404).json({ message: "Order not found" });
      return;
    }
    res.json(order);
  }
   // create 
  static async create(req: Request, res: Response) {
  try {
  const result = await initiatePayment(req, res);
  res.status(200).json({
    message: "payment initiated successfully",
    paymentUrl: result.paymentUrl,
    cartId: result.cartId,
    amount: result.amount
  });
} catch (error) {
  res.status(500).json({ message: "payment initiation failed", error });
}
  }

   static async paymentCallback ( req  :Request ,res :Response){
    const paymentData = req.body;
    const cartId =paymentData.cartId;

    const cart = await cartRepo.findOne({
  where: { user: { id: req.params.id } },
  relations: ['cartProducts'],
});
   
    if (!cart){
      res.status(404).json ({ message : "Cart not found "});
    }
    const amount = calculateTotalAmount(cart.cartProducts);
    const paymentSuccess = paymentData.payment_result?.response_status === "A";

    const order = orderRepo.create ({
      user : cart.user ,
      amount,
      status : paymentSuccess ? Status.PAID : Status.FAILED,
      cartProducts :cart.cartProducts,
    });
    await orderRepo.save(order);

    for (const item of cart.cartProducts){
      item.order =order;
      await cartProductRepo.save(item);
    }

    cart.isActive = false;
    await cartRepo.save(cart);

    res.status(200).json({
      message: paymentSuccess
        ? "Payment successful. Order created."
        : "Payment failed. Order saved with FAILED status.",
    });
    return;

   }


  static async update(req: Request, res: Response) {
    const order = await orderRepo.findOneBy({ id: req.params.id });
    if (!order) {
      res.status(404).json({ message: "Order not found" });
      return;
    }

    orderRepo.merge(order, req.body);
    const result = await orderRepo.save(order);
    res.json(result);
  }

  static async delete(req: Request, res: Response) {
    const order = await orderRepo.findOneBy({ id: req.params.id });
    if (!order) {
      res.status(404).json({ message: "Order not found" });
      return;
    }

    await orderRepo.remove(order);
    res.json({ message: "Order deleted successfully" });
  
  }
}
