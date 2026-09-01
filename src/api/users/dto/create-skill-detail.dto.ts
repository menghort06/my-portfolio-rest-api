import { IsInt } from "class-validator";

export class SkillDetailDto {
    @IsInt()
    skillId: number;
}