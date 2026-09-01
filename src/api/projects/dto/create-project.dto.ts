import { Type } from "class-transformer";
import { IsArray, IsInt, IsNotEmpty, IsOptional, IsString, ValidateNested } from "class-validator";
import { CreateProjectDetailDto } from "./create-project-detail.dto";

export class CreateProjectDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    description?: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateProjectDetailDto)
    projectDetails: CreateProjectDetailDto[];
}
