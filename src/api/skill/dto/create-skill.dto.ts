import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateSkillDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    category: string;

    @IsString()
    @IsNotEmpty()
    icon: string;

    @IsString()
    @IsOptional()
    description?: string;
}
