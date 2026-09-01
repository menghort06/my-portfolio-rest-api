import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateCustomerDto {

    @IsString()
    @IsNotEmpty()
    customer_name: string;
    
    @IsString()
    @IsNotEmpty()
    contact_name: string;

    @IsString()
    @IsNotEmpty()
    address: string;

    @IsOptional()
    @IsString()
    city: string;

    @IsString()
    @IsOptional()
    postal_code: string;

    @IsString()
    @IsOptional()
    country: string;
}
