import { Entity, PrimaryGeneratedColumn, ManyToOne, OneToMany, Column,JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { CartProduct } from './cartProduct.entity';
 

@Entity()
export class Cart {

    @PrimaryGeneratedColumn('uuid')
    id : string;

    @Column()
    isActive: boolean

     @ManyToOne(() => User, (user) => user.carts)
     @JoinColumn({ name: 'userId' })
     user: User;
    @OneToMany(()=> CartProduct , (cartProduct)=> cartProduct.cart)
    cartProducts : CartProduct[];

}