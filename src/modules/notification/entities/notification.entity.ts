import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../user/entities/user.entity';

export enum NotificationType {
  MESSAGE = 'message',
  CALL = 'call',
  ANNOUNCEMENT = 'announcement',
  EVENT = 'event',
}

@Entity()
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  content: string;

  @Column({ 
    type: 'enum', 
    enum: NotificationType
  })
  type: NotificationType;

  @Column({ default: false })
  isRead: boolean;

  @ManyToOne(() => User, user => user.notifications)
  @JoinColumn()
  user: User;

  @Column({ nullable: true })
  linkedEntityId: string;

  @CreateDateColumn()
  createdAt: Date;
} 