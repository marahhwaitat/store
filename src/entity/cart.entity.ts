import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  Column,
  JoinColumn,
} from "typeorm";
import { User } from "./user.entity";
import { CartProduct } from "./cartProduct.entity";
import { Order } from "./order.entity";
import { Product } from "./product.entity";

@Entity()
export class Cart {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  isActive: boolean;

  @ManyToOne(() => User, (user) => user.carts)
  @JoinColumn({ name: "userId" })
  user: User;

  @OneToMany(() => CartProduct, (cartProduct) => cartProduct.cart)
  cartProducts: CartProduct[];

  @OneToMany(() => Order, (order) => order.cart)
  order: Order[];
}
