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
