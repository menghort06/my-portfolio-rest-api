import { Type } from "class-transformer";
import { IsArray, IsNotEmpty, IsNumber, isNumber, IsOptional, IsString, IsUrl, ValidateNested } from "class-validator";
import { CreateCertificateDto } from "./create-certificate.dto";

export class CreateEducationDto {
    @IsOptional()
    @IsNumber()
    id?: number

    @IsString()
    @IsNotEmpty()
    degree: string;

    @IsString()
    @IsNotEmpty()
    school: string;

    @IsString()
    @IsNotEmpty()
    period: string;

    @IsOptional()
    @IsUrl()
    url?: string;

    @IsString()
    @IsNotEmpty()
    description: string;

    @IsArray()
    @ValidateNested({each: true})
    @Type(() => CreateCertificateDto)
    certificates: CreateCertificateDto[]

}