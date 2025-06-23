import { IsOptional,IsString,IsInt , Min ,IsUUID, min ,IsNotEmpty} from "class-validator";


export class UpdateProductDto {
    @IsOptional()
    @IsString()
    name ?: string;


    @IsOptional()
    
    @Min(0)
    price ?: number ;

    @IsOptional()
    @IsInt()
    @Min(0)
    quantity ?: number ;


    @IsOptional()
    @IsUUID()
    categoryId ?: string;


     @IsOptional()
    @IsUUID()
    @IsNotEmpty()
    documentId : string;
    

}