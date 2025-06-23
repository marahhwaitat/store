import { Entity, PrimaryGeneratedColumn, Column, OneToMany, BaseEntity } from 'typeorm';
import { Product } from './product.entity';

@Entity()
export class Category extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id:string;

    @Column()
    name:string;

    @OneToMany(() => Product, (product) => product.category)
  products: Product[];
}
