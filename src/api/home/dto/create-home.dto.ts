import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateHomeDto {

    @IsString()
    @IsNotEmpty()
    title: string;


    @IsString()
    @IsOptional()
    description: string;
}
