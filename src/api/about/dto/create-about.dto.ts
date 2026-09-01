import { Type } from "class-transformer";
import { IsArray, IsNotEmpty, IsOptional, IsString, ValidateNested } from "class-validator";
import { CreateAboutExpertiseDto } from "./create-about-expertise.dto";
import { isatty } from "tty";

export class CreateAboutDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsOptional()
    subtitle: string;

    @IsString()
    @IsOptional()
    shortDescription: string;

    @IsString()
    @IsOptional()
    description: string;

    @IsArray()
    @ValidateNested({each: true})
    @Type(() => CreateAboutExpertiseDto)
    expertises: CreateAboutExpertiseDto[]

}

/**
 * Validates that expertises is actually an array.
 * @IsArray()
 * {
 *      "expertises": []
 * }
 */

/**
 * NestJS validates every item in the array.
 * @ValidateNested({ each: true })
 */

/**
 * "Every item in this array should be treated as CreateAboutExpertiseDto."
 * @Type(() => CreateAboutExpertiseDto)
 */
