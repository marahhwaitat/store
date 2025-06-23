import { IsUUID , IsInt ,Min, IsNotEmpty } from "class-validator";
 

export class AddProductToCartDto{

   

    @IsNotEmpty()
    productId : string;

    @IsInt()
    @Min(1)
    quantity : number ;
    

}