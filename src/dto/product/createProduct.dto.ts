import { IsNotEmpty,IsString ,IsInt,Min ,IsUUID  } from "class-validator";
 export class CreateProductDto {
    @IsNotEmpty()
    @IsString()
    name : string ;


    @IsInt()
    @Min(0)
    price:number;

    @IsInt()
    @Min(0)
    quantity:number;

    @IsUUID()
    @IsNotEmpty()
    categoryId : string;
    
   @IsUUID()
   @IsNotEmpty()
   documentId : string;

 }