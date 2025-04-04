import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Message } from '../../message/entities/message.entity';

@Entity()
export class Apartment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  number: string;

  @Column({ nullable: true })
  floor: string;

  @Column({ nullable: true })
  block: string;

  @Column({ nullable: true })
  description: string;

  @Column({ default: true })
  isOccupied: boolean;

  @OneToMany(() => User, user => user.apartment)
  residents: User[];

  @OneToMany(() => Message, message => message.apartment)
  messages: Message[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 