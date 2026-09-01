import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Address } from './entities/address.entity';
import { Education } from './entities/education.entity';
import { Certificate } from './entities/certificate.entity';
import { Skill } from '../skill/entities/skill.entity';

@Module({
  imports: [
    //forFeature() makes specific entity repositories (such as User) available within a module.
    TypeOrmModule.forFeature([User, Address, Education, Certificate, Skill]), 
  ],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
