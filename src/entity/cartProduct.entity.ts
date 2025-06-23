import { Entity, Column, ManyToOne, PrimaryColumn } from 'typeorm';
import { Cart } from './cart.entity';
import { Product } from './product.entity';

@Entity()
export class CartProduct {
    @PrimaryColumn()
    cartId :String;

    @PrimaryColumn()
    productId : string;

    @Column()
    quantity:number;

    @ManyToOne(() => Cart ,(cart)=> cart.cartProducts)
    cart:Cart;

    @ManyToOne(()=> Product,(Product)=> Product.cartProducts)
    product : Product;
}