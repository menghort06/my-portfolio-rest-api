import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateCertificateDto {
    @IsOptional()
    @IsNumber()
    id?: number;

    @IsNotEmpty()
    @IsString()
    photo: string;
}