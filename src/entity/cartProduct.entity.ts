import {
  Entity,
  Column,
  ManyToOne,
  PrimaryColumn,
  JoinColumn,
} from "typeorm";
import { Cart } from "./cart.entity";
import { Product } from "./product.entity";
import { Order } from "./order.entity";

@Entity()
export class CartProduct {
  @PrimaryColumn()
  cartId: number;

  @PrimaryColumn()
  productId: number;

  @Column()
  quantity: number;

  @ManyToOne(() => Cart, (cart) => cart.cartProducts)
  @JoinColumn({ name: "cartId" })
  cart: Cart;

  @ManyToOne(() => Product, (product) => product.cartProducts)
  @JoinColumn({ name: "productId" })
  product: Product;

  @ManyToOne(() => Order, order => order.cartProducts, { nullable: true })
  @JoinColumn({ name: "orderId" }) 
  order: Order;
}