import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Apartment } from '../../apartment/entities/apartment.entity';

export enum MessageType {
  DIRECT = 'direct',
  APARTMENT = 'apartment',
  BUILDING = 'building',
}

@Entity()
export class Message {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  content: string;

  @Column({ 
    type: 'enum', 
    enum: MessageType, 
    default: MessageType.DIRECT 
  })
  type: MessageType;

  @Column({ default: false })
  isRead: boolean;

  @ManyToOne(() => User, user => user.sentMessages)
  @JoinColumn()
  sender: User;

  @ManyToOne(() => User, user => user.receivedMessages, { nullable: true })
  @JoinColumn()
  recipient: User;

  @ManyToOne(() => Apartment, apartment => apartment.messages, { nullable: true })
  @JoinColumn()
  apartment: Apartment;

  @Column({ nullable: true })
  attachmentUrl: string;

  @CreateDateColumn()
  createdAt: Date;
} 