import { IsUUID , IsInt ,Min, IsNotEmpty } from "class-validator";
import { PrimaryGeneratedColumn } from "typeorm";
 

export class AddProductToCartDto{

   @PrimaryGeneratedColumn()
   id : string;

    @IsNotEmpty()
    productId : string;

    @IsInt()
    @Min(1)
    quantity : number ;
    

}