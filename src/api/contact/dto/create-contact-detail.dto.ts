import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateContactDetailDto {

    @IsOptional()
    @IsNumber()
    id?: number; //Use id to validate when update, create or delete.
    
    @IsNotEmpty()
    @IsString()
    title: string;

    @IsNotEmpty()
    @IsString()
    icon: string;

    @IsNotEmpty()
    @IsString()
    text: string;

    @IsNotEmpty()
    @IsString()
    link: string;

    @IsOptional()
    @IsString()
    description?: string;

}