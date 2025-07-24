import axios from "axios";
import { Request, Response } from "express";
import { Cart } from "../entity/cart.entity";
import { User } from "../entity/user.entity";
import { AppDataSource } from "../data-source";
import { calculateTotalAmount } from "../utils/calculateAmount";
import { CartProduct } from "../entity/cartProduct.entity";
interface AuthRequest extends Request {
  user?: { userId: string };
}
const userRepo = AppDataSource.getRepository(User);
const cartRepo = AppDataSource.getRepository(Cart);

export async function initiatePayment(req: AuthRequest, res: Response) {
  const user = await userRepo.findOneBy({ id: req.user.userId });

  if (!user) {
    res.status(404).json({ message: "User not found" });
    return;
  }
  const cart = await cartRepo.findOne({
    where: { user, id: req.body.cartId },
    relations: ["cartProducts", "cartProducts.product"],
  });
  console.log("++++++++++++++++++++++");
  console.log(cart);

  if (!cart || cart.cartProducts.length === 0) {
    res.status(404).json({ message: "Cart is empty or not found" });
    return;
  }

  const amount = calculateTotalAmount(cart.cartProducts);
  console.log(amount);
  const paytabsKey = process.env.PAYTABS_APT_KEY;

  if (!paytabsKey) {
    res.status(500).json({ message: "Payment key not configured" });
    return;
  }

  try {
    const paymentRes = await axios.post(
      "https://secure-jordan.paytabs.com/payment/request",
      {
        profile_id: 151514,
        tran_type: "sale",
        tran_class: "ecom",
        cart_id: cart.id,
        cart_description: `Purchase from ${user.firstName}'s cart`,
        cart_currency: "JOD",
        cart_amount: amount,
        callback:
          "https://dbba-82-212-125-102.ngrok-free.app/api/order/callback",
        customer_details: {
          name: `${user.firstName} ${user.lastName}`,
          email: user.email,
        },
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: paytabsKey,
        },
      }
    );

    return {
      paymentUrl: paymentRes.data.redirect_url,
      cartId: cart.id,
      amount,
    };
  } catch (error) {
    console.error(error);
  }
}
