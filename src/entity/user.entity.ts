import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Otp } from './otp.entity';
import {Cart} from './cart.entity';
import {Order} from './order.entity';
@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @OneToMany(() => Cart, (cart) => cart.user)
  carts: Cart[];

  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];

  @OneToMany(() => Otp, (otp) => otp.user)
  otp: Otp[];
}
