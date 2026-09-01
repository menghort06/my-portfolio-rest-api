import { Type } from "class-transformer";
import { ArrayNotEmpty, IsArray, IsNotEmpty, IsOptional, IsString, ValidateNested } from "class-validator";
import { CreateContactDetailDto } from "./create-contact-detail.dto";

export class CreateContactDto {

    @IsNotEmpty()
    @IsString()
    title: string;

    @IsOptional()
    @IsString()
    shortDescription?: string;

    @IsOptional()
    @IsString()
    description: string;

    @IsArray()
    @ArrayNotEmpty()
    @ValidateNested({each: true})
    @Type(() => CreateContactDetailDto)
    details: CreateContactDetailDto[]

}
