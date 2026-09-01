import { IsNotEmpty, IsString } from "class-validator";

export class CreateProjectTypeDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    description: string;
}
