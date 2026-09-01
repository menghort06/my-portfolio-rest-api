import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAboutDto } from './dto/create-about.dto';
import { UpdateAboutDto } from './dto/update-about.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { About } from './entities/about.entity';
import { Repository } from 'typeorm';
import { AboutExpertise } from './entities/about-expertise.entity';

@Injectable()
export class AboutService {

  constructor(
    @InjectRepository(About)
    private readonly aboutRepository: Repository<About>,

    @InjectRepository(AboutExpertise)
    private readonly aboutExpertiseRepository: Repository<AboutExpertise>
  ){}

  async create(body: CreateAboutDto) {
    const about = await this.aboutRepository.create(body);
    return this.aboutRepository.save(about);
  }

  async findAll() {
    return await this.aboutRepository.find();
  }

  async findOne(id: number) {
    const about = await this.aboutRepository.findOne({
      where: { id },
      relations: {
        expertises: true //expertises: AboutExpertise[]
      }
    });

    if(!about) {
      throw new NotFoundException(`About ${id} not found.`);
    }

    return about;
  }

  async update(id: number, body: UpdateAboutDto) {
    const about = await this.findOne(id);
    Object.assign(about, body);
    return this.aboutRepository.save(about);
  }

  async remove(id: number) {
    const about = await this.findOne(id);
    return this.aboutRepository.remove(about);
  }
}
