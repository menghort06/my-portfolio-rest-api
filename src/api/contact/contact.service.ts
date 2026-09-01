import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Contact } from './entities/contact.entity';
import { Repository } from 'typeorm';
import { ContactDetail } from './entities/contact-detail.entity';
import { reduce } from 'rxjs';

@Injectable()
export class ContactService {

  constructor(
    @InjectRepository(Contact)
    private readonly contactRepository: Repository<Contact>,

    @InjectRepository(ContactDetail)
    private readonly contactDetailRepository: Repository<ContactDetail>
  ){}

  async create(body: CreateContactDto) {
    const contact = await this.contactRepository.create(body)
    return this.contactRepository.save(contact);
  }

  async findAll() {
    const data = await this.contactRepository.find({
      relations: { details: true}
    });
    return {total: data.length, data}
  }

  async findOne(id: number) {
    const contact = await this.contactRepository.findOne({
      where: {id},
      relations: {details: true}
    })
    if(!contact) {
      throw new NotFoundException(`Contact ${id} not found.`);
    }
    return contact;
  }

  async updateContact(id: number, body: UpdateContactDto) {
    const contact: Contact = await this.findOne(id);
    const {details, ...contactData} = body;
    Object.assign(contact, contactData);

    if(!details?.length) return;
    let updateDetails: ContactDetail[] = [];
    details.forEach(detailDto => {
        if(detailDto.id !== undefined) {
          const existingDetail = contact.details.find(oldCon => oldCon.id === detailDto.id);
          if(!existingDetail) {
            throw new NotFoundException(`Contact detail id ${detailDto.id} is not found.`);
          }
          Object.assign(existingDetail, detailDto);
          updateDetails.push(existingDetail);
        } else {
          const newDetail = this.contactDetailRepository.create({...detailDto, contact});
          console.log('New Details:')
          updateDetails.push(newDetail);
        }
      });
      console.log('Detail: ', contact);
      console.log('body: ', body)

    const deleteContact = contact.details.filter(oldCon => {
      return !details.some(con => con.id === oldCon.id);
    });
    if(deleteContact.length){
      await this.contactDetailRepository.remove(deleteContact);
    }

      contact.details = updateDetails;

    await this.contactRepository.save(contact);
    return this.findOne(id);

  }


  async update(id: number, body: UpdateContactDto) {
    const contact = await this.findOne(id);
    Object.assign(contact, {...body});
    if (body.details !== undefined) {
      let updatedDetails: ContactDetail[] = [];
      for (const detailDto of body.details) {
        // Existing detail
        if (detailDto.id !== undefined) {
          const detail = this.getContactDetail(contact.details, detailDto);
          updatedDetails.push(detail);
        }
        // New detail
        else {
          const newDetail = this.contactDetailRepository.create({
            ...detailDto,
            contact: contact // Relationship with contact
          });
          updatedDetails.push(newDetail);
        }
      }

      // Delete removed details
      const deletedDetails = contact.details.filter(
        existingDetail => 
          !body.details?.some(detail => detail.id === existingDetail.id)
      );
      if (deletedDetails.length > 0) {
        await this.contactDetailRepository.remove(deletedDetails);
      }
      // Replace Contact's details
      contact.details = updatedDetails;
    }
    console.log('body', contact);
    await this.contactRepository.save(contact);
    return this.findOne(id);
  }

  /**
   * Get and assign value to detail
   * @param details 
   * @param detailDto 
   * @returns 
   */
  private getContactDetail(details, detailDto) {
    const existingDetail = details.find(
      detail => detail.id === detailDto.id
    );
    // Detail does not belong to this Contact
    if (!existingDetail) {
      throw new NotFoundException(
        `Detail ${detailDto.id} does not belong to contact.`,
      );
    }
    // Update existing detail
    Object.assign(existingDetail, detailDto);
    return existingDetail;
         
  }

  async remove(id: number) {
    const contact = await this.findOne(id);
    return this.contactRepository.remove(contact);
  }

  
}
