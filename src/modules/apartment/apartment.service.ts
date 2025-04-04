import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Apartment } from './entities/apartment.entity';

@Injectable()
export class ApartmentService {
  constructor(
    @InjectRepository(Apartment)
    private apartmentRepository: Repository<Apartment>,
  ) {}

  async findAll(): Promise<Apartment[]> {
    return this.apartmentRepository.find({ relations: ['residents'] });
  }

  async findById(id: string): Promise<Apartment> {
    const apartment = await this.apartmentRepository.findOne({ 
      where: { id },
      relations: ['residents'] 
    });
    
    if (!apartment) {
      throw new NotFoundException(`Apartment with ID "${id}" not found`);
    }
    
    return apartment;
  }

  async findByNumber(number: string): Promise<Apartment | null> {
    return this.apartmentRepository.findOne({ 
      where: { number },
      relations: ['residents'] 
    });
  }

  async create(apartmentData: Partial<Apartment>): Promise<Apartment> {
    const apartment = this.apartmentRepository.create(apartmentData);
    return this.apartmentRepository.save(apartment);
  }

  async update(id: string, apartmentData: Partial<Apartment>): Promise<Apartment> {
    const apartment = await this.findById(id);
    Object.assign(apartment, apartmentData);
    return this.apartmentRepository.save(apartment);
  }

  async remove(id: string): Promise<void> {
    const result = await this.apartmentRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Apartment with ID "${id}" not found`);
    }
  }
} 