
import { CartProduct } from "../entity/cartProduct.entity";

export function calculateTotalAmount(cartItems: CartProduct[]): number {
  return cartItems.reduce((sum, item) => {
    return sum + (item.product.price * item.quantity);
  }, 0);
}