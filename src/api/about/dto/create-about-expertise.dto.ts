import { IsString, IsOptional, IsNumber } from 'class-validator';

export class CreateAboutExpertiseDto {
  @IsOptional()
  @IsString()
  icon?: string;

  @IsString()
  title: string;

  @IsString()
  description: string;
}