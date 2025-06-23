import { IsNotEmpty , IsString, IsUUID, IsUrl, isURL } from "class-validator";

 export class CreateDocumentDto {
     @IsString()
    @IsNotEmpty()
    name :string;
    

    @IsUrl()
    @IsNotEmpty()
    ulr:string;

    
    @IsUUID()
    product :string;




}
 export class UpdateDocumentDto{
    @IsString()
    name ?: string;

    @IsUrl()
    url ?: string;

    


 }