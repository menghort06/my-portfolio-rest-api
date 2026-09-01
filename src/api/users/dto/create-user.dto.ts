import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { CreateAddressDto } from './create-address.dto';
import { CreateEducationDto } from './create-education.dto';
import { SkillDetailDto } from './create-skill-detail.dto';
import { Skill } from 'src/api/skill/entities/skill.entity';

export class CreateUserDto {

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  gender: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  dateOfBirth?: Date;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  maritalStatus?: string;

  @IsOptional()
  @IsString()
  nationality?: string;

  @IsOptional()
  @IsString()
  photoUrl?: string;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => CreateAddressDto)
  address: CreateAddressDto;

  @IsArray()
  @ValidateNested({each: true})
  @Type(() => CreateEducationDto)
  educations: CreateEducationDto[];

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({each: true})
  @Type(() => SkillDetailDto)
  skills: SkillDetailDto[]
}