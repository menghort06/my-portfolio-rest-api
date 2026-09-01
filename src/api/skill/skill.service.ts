import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSkillDto } from './dto/create-skill.dto';
import { UpdateSkillDto } from './dto/update-skill.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Skill } from './entities/skill.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SkillService {

  constructor(
    @InjectRepository(Skill)
    private readonly skillRepository: Repository<Skill>
  ){}

  async create(body: CreateSkillDto) {
    const skill = this.skillRepository.create(body);
    return await this.skillRepository.save(skill);
  }

  async findAll() {
    const skills = await this.skillRepository.find();
    const total = skills?.length;
    return {data: skills, total}
  }

  async  findOne(id: number) {
    const skill = await this.skillRepository.findOne({
      where: {id}
    });
    if(!skill) {
      throw new NotFoundException(`Skill ${id} not found.`);
    }
    return skill;
  }

  async update(id: number, body: UpdateSkillDto) {
    const skill = await this.findOne(id);
    Object.assign(skill, body);
    return this.skillRepository.save(skill)
  }

  async remove(id: number) {
    const skill = await this.findOne(id);
    return this.skillRepository.remove(skill);
  }
}
