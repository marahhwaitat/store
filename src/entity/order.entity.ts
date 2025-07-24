import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  OneToOne,
} from "typeorm";
import { User } from "./user.entity";
import { Cart } from "./cart.entity";
import { Status } from "../enums/status";
import { CartProduct } from "./cartProduct.entity";

@Entity()
export class Order {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  amount: number;

  @Column({ type: "enum", enum: Status })
  status: Status;

  @ManyToOne(() => User, (user) => user.orders, { eager: false })
  user: User;

  @OneToOne(() => Cart, (cart) => cart.order)
  cart: Cart;

  //@TODO
  /**
   * amount
   * status [ENUM]
   */
}
