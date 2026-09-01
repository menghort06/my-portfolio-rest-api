import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateProductDto {
    @IsString()
    @IsNotEmpty()
    product_name: string;
    
    @IsString()
    @IsNotEmpty()
    unit: string;
    
    @IsNumber()
    @IsNotEmpty()
    price: number;
   
    @IsNumber()
    @IsNotEmpty()
    category_id: number;
}
