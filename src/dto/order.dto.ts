import { IsString ,IsNotEmpty, IsUUID, IsPhoneNumber } from "class-validator";
 
 export class CreateOrderDto {
    @IsUUID()
    userId : string ;


}

export class UpdateOrderDto {
    @IsString()
    name ?: string;

    @IsString()
    address?: string;

    @IsPhoneNumber()
    phone ?: string ;
}
