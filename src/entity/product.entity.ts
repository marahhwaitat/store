import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  DeleteDateColumn,
  CreateDateColumn,
} from "typeorm";
import { Category } from "./category.entity";
import { Document } from "./document.entity";
import { CartProduct } from "./cartProduct.entity";

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: string;
  @Column()
  name: string;

  @Column()
  price: number;

  @Column()
  quantity: number;

  @ManyToOne(() => Category, (category) => category.products)
  category: Category;

  @OneToMany(() => Document, (doc) => doc.product)
  documents: Document[];

  @OneToMany(() => CartProduct, (cartProduct) => cartProduct.product)
  cartProducts: CartProduct[];

  @CreateDateColumn()
  createdAt: Date;
  
  @DeleteDateColumn()
  deletedAt: Date;
}
