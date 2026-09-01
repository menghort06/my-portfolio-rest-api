import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateHomeDto } from './dto/create-home.dto';
import { UpdateHomeDto } from './dto/update-home.dto';
import { Home } from './entities/home.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class HomeService {

  constructor(
    @InjectRepository(Home)
    private readonly homeRepository: Repository<Home>
  ){}

  async create(body: CreateHomeDto) {
    const home = await this.homeRepository.create(body);
    return this.homeRepository.save(home);
  }

  async findAll() {
    return await this.homeRepository.find();
  }

  async findOne(id: number) {
    const home = await this.homeRepository.findOne({
      where: {id: id}
    });
    if(!home) {
      throw new NotFoundException(`Home ${id} not found.`);
    }
    return home;
  }

  async update(id: number, body: UpdateHomeDto) {
    const home = await this.findOne(id);
    Object.assign(home, body);
    return this.homeRepository.save(home);
  }

  async remove(id: number) {
    const home = await this.findOne(id);
    return this.homeRepository.remove(home);
  }
}
