import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateCategoryDto {

    @IsString()
    @IsNotEmpty()
    category_name: string;

    @IsOptional()
    @IsString()
    description: string;
}
