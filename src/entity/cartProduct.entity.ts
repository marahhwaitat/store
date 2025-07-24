import {
  Entity,
  Column,
  ManyToOne,
  PrimaryColumn,
  JoinColumn,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Cart } from "./cart.entity";
import { Product } from "./product.entity";
import { Order } from "./order.entity";

@Entity()
export class CartProduct {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  cartId: number;

  @Column()
  productId: number;

  @Column()
  quantity: number;



  @ManyToOne(() => Cart, (cart) => cart.cartProducts)
  @JoinColumn({ name: "cartId" })
  cart: Cart;

  @ManyToOne(() => Product, (product) => product.cartProducts)
  @JoinColumn({ name: "productId" })
  product: Product;

 
}
