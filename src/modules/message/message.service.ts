import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './entities/message.entity';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,
  ) {}

  async findAll(): Promise<Message[]> {
    return this.messageRepository.find({
      relations: ['sender', 'recipient', 'apartment'],
    });
  }

  async findById(id: string): Promise<Message> {
    const message = await this.messageRepository.findOne({
      where: { id },
      relations: ['sender', 'recipient', 'apartment'],
    });
    
    if (!message) {
      throw new NotFoundException(`Message with ID "${id}" not found`);
    }
    
    return message;
  }

  async findBySender(senderId: string): Promise<Message[]> {
    return this.messageRepository.find({
      where: { sender: { id: senderId } },
      relations: ['sender', 'recipient', 'apartment'],
    });
  }

  async findByRecipient(recipientId: string): Promise<Message[]> {
    return this.messageRepository.find({
      where: { recipient: { id: recipientId } },
      relations: ['sender', 'recipient', 'apartment'],
    });
  }

  async findByApartment(apartmentId: string): Promise<Message[]> {
    return this.messageRepository.find({
      where: { apartment: { id: apartmentId } },
      relations: ['sender', 'recipient', 'apartment'],
    });
  }

  async create(messageData: Partial<Message>): Promise<Message> {
    const message = this.messageRepository.create(messageData);
    return this.messageRepository.save(message);
  }

  async markAsRead(id: string): Promise<Message> {
    const message = await this.findById(id);
    message.isRead = true;
    return this.messageRepository.save(message);
  }

  async remove(id: string): Promise<void> {
    const result = await this.messageRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Message with ID "${id}" not found`);
    }
  }
} 