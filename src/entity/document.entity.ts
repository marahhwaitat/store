import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Product } from "./product.entity";

@Entity()
export class Document {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @Column()
  url: string;

  @ManyToOne(() => Product, (product) => product.documents, {
    onDelete: "CASCADE",
    nullable: true,
  })
  product: Product;
}
