import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
import { User } from '../modules/user/entities/user.entity';
import { Apartment } from '../modules/apartment/entities/apartment.entity';
import { Message } from '../modules/message/entities/message.entity';
import { Notification } from '../modules/notification/entities/notification.entity';

dotenv.config();

// NOTE: This is separate from the typeorm.config.ts file which is used for CLI commands
// NestJS needs its own configuration
export const databaseConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'condomanager',
  entities: [User, Apartment, Message, Notification],
  synchronize: process.env.NODE_ENV !== 'production',
  logging: process.env.NODE_ENV !== 'production',
  migrationsRun: process.env.NODE_ENV === 'production', // Run migrations automatically in production
  ssl: {
    rejectUnauthorized: false, // Important for Aiven PostgreSQL
  },
};
