## Many to Many
The key difference from One-to-Many is that neither users nor skills directly stores the other table's foreign key. Instead, we use a junction table user_skills.

## User ↔ Skill — Many-to-Many
Let's go through Many-to-Many using your User and Skill example because this is one of the most important TypeORM relationship concepts.
The real-world relationship:
One user can have many skills.
One skill can belong to many users.
    User
        |
        | N
        |
    user_skills
        |
        | N
        |
    Skill
User N ---------------- N Skill

# For example:
John
 ├── Angular
 ├── Vue
 └── NestJS

David
 ├── Angular
 └── React

 ## @ManyToMany()
 Therefore, we need a third table:
    users
    skills
    user_skills
 The third table is called a: Junction table / Join table

## Database Structure
    users
user_id | name
--------|--------
1       | John
2       | David

    skills
id | name
---|----------
1  | Angular
2  | Vue
3  | NestJS
4  | React

    user_skills
user_id | skill_id
--------|---------
1       | 1
1       | 2
1       | 3
2       | 1
2       | 4

## User Entity
import { Address } from "src/api/users/entities/address.entity";
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Education } from "./education.entity";
import { Skill } from "src/api/skill/entities/skill.entity";

@Entity('users')  // IMPORTANT: table name from the PostgreSQL
export class User {

    @PrimaryGeneratedColumn()
    user_id: number;
    
    @Column()
    title: string;

    @Column({name: 'first_name'})
    firstName: string;

    @Column({name: 'last_name'})
    lastName: string;

    @ManyToMany(
        () => Skill,
        skill => skill.users, 
        {cascade: true}
    )
    @JoinTable({
        name: 'user_skills',
        joinColumn: { name: 'userId', referencedColumnName: 'user_id'},
        inverseJoinColumn: { name: 'skillId', referencedColumnName: 'id'}
    })
    skills: Skill[]
}

## Skill Entity
import {
  Column,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { User } from "src/api/users/entities/user.entity";
import { Column, CreateDateColumn, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('skills')
export class Skill {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    category: string;

    @Column()
    icon: string;

    @Column({name: 'created_at'})
    createdAt: Date;

    @Column()
    description: string;

    @ManyToMany(
        ()=> User,
        user => user.skills
    )
    users: User[]
}

## PostgreSQL
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);
CREATE TABLE skills (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);
CREATE TABLE user_skills (
    user_id INTEGER NOT NULL,
    skill_id INTEGER NOT NULL,

    PRIMARY KEY (user_id, skill_id),

    FOREIGN KEY (user_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE,

    FOREIGN KEY (skill_id)
        REFERENCES skills(id)
        ON DELETE CASCADE
);

## User service 
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { In, Repository } from 'typeorm';
import { Address } from './entities/address.entity';
import { Education } from './entities/education.entity';
import { CreateCertificateDto } from './dto/create-certificate.dto';
import { Certificate } from './entities/certificate.entity';
import { Skill } from '../skill/entities/skill.entity';
import { CreateEducationDto } from './dto/create-education.dto';

@Injectable()
export class UsersService {

  //decorator that tells NestJS to inject the TypeORM repository for the Category entity into your service.
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>, //NestJS injects a Repository<User> instead of HttpClient similar to Angular (constructor(private http: HttpClient) {})

    @InjectRepository(Address)
    private readonly addressRepository: Repository<Address>,

    @InjectRepository(Education)
    private readonly educationRepository: Repository<Education>,

    @InjectRepository(Certificate)
    private readonly certificateRepository: Repository<Certificate>,

    @InjectRepository(Skill) private readonly skillRepository: Repository<Skill>
  ){}

  private async resolveSkills(skills: {skillId: number} []) {
    const skillIds = skills.map((sk) => sk.skillId);
    const skillData = await this.skillRepository.findBy({id: In(skillIds)});
    if(skillData.length !== skills.length) {
      throw new BadRequestException(`One or more skill id values do not exist.`);
    }
    return skillData;
  }

  private async resolveEducation(educations: CreateEducationDto[]) {
    const educationsData = await educations?.map((education) => ({
      ...education,
      certificates: education?.certificates?.map((certificate) => ({
        ...certificate
      }))
    }));
    return educationsData;
  }

  /**
   *  Create entity -> Save to database
   *  create(): Create entity object
   *  save(): Insert/update database
   * @param body 
   * @returns 
   */
  async create(body: CreateUserDto) {
    const skills = await this.resolveSkills(body.skills);
    const educations = await this.resolveEducation(body?.educations);
    const bodyUser:any = {
      ...body,
      address: body.address,
      educations,
      skills
    }
    const user = await this.userRepository.create(bodyUser); 
    return await this.userRepository.save(user);
  }

  async findAll() {
    const users = await this.userRepository.find({relations: {
      educations: {
        
      },
      skills: true
    }});
    const total = users.length;
    return {
      total: total,
      data: users
    };
  }

  async findOne(id: number) {
    const user = await this.userRepository.findOne({
      where: { user_id: id },
      relations: {
        address: true,
        educations: {
          certificates: true
        },
        skills: true
      }
    });
    if(!user) {
      throw new NotFoundException(`User ${id} not found.`);
    }
    return user;
  }

  async update(id: number, body: UpdateUserDto) {
    const user = await this.findOne(id);

    //Keep address out of Object.assign()
    const {address, educations, skills, ...userData} = body;

    //Update user
    Object.assign(user, userData);

    //Update existing address
    if (address) {
      Object.assign(user.address, address);
    }

    //Update Skills
    if(skills) {
      const skillData = await  this.resolveSkills(skills);
      user.skills = skillData;
    }else {
      user.skills = [];
    }

    let newEducations: Education[] = [];
    for (const eduDto of educations ?? []) {
    // for (const eduDto of educations ?? []) {
      const { certificates, ...educationData } = eduDto;
      if (eduDto?.id) {
        const exitingEdu = user?.educations?.find(edu => edu.id === eduDto.id);
        if (!exitingEdu) {
          throw new NotFoundException(`Education ${eduDto.id} not found.`);
        }
        Object.assign(exitingEdu, educationData);
        // Update certificate
        if (certificates) {
          await this.updateCertificate(exitingEdu, certificates);
        }
        newEducations.push(exitingEdu);
      } else {
        const newEdu: any = this.educationRepository.create({ ...educationData, user });
        // Create certificate
        if (certificates) {
          await this.updateCertificate(newEdu, certificates);
        }
        newEducations.push(newEdu);
      }
    }

    const removeEdu = user?.educations?.filter((oldEdu) => {
      return !educations?.some(newEdu => newEdu.id === oldEdu.id);
    });
    if(removeEdu?.length) {
      await this.educationRepository.remove(removeEdu);
    }

    user.educations = newEducations;
    await this.userRepository.save(user);
    return this.findOne(id);
  }

  private async updateCertificate(exitingEdu: Education, certificates: CreateCertificateDto[]) {
    const newCertificates: Certificate[] = [];
    certificates?.forEach(certiDto => {
      if(certiDto.id) {
        const exitingCerti = exitingEdu?.certificates?.find(oldCerti => oldCerti.id === certiDto.id);
        if(!exitingCerti) {
          throw new NotFoundException(`Certificate ${certiDto.id} not found.`);
        }
        Object.assign(exitingCerti, certiDto);
        newCertificates.push(exitingCerti);
      }else {
        const createCerti = this.certificateRepository.create({...certiDto, education: exitingEdu});
        newCertificates.push(createCerti);
      }
    });

    const removeCertificates: Certificate[] = exitingEdu?.certificates?.filter(oldCerti => {
      return !certificates?.some(newCerti => newCerti.id  === oldCerti.id);
    })
    if(removeCertificates?.length){
      await  this.certificateRepository.remove(removeCertificates);
    }

    exitingEdu.certificates = newCertificates;
  }

  async remove(id: number) {
    const user = await this.findOne(id);
    return this.userRepository.remove(user);
  }
}
