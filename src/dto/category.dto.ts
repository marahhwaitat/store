import { IsNotEmpty,IsString ,Length ,IsOptional } from "class-validator";

export class CreateCategoryDto{
    @IsString()
    @IsNotEmpty()
    @Length(2 ,50)
    name : string;

}

export class UpdateCategoryDto {
    @IsString()
    @IsNotEmpty()
    @Length(2,50)
    name : string;

}