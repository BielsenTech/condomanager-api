import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { User } from './src/modules/user/entities/user.entity';
import { Apartment } from './src/modules/apartment/entities/apartment.entity';
import { Message } from './src/modules/message/entities/message.entity';
import { Notification } from './src/modules/notification/entities/notification.entity';

// Load environment variables
dotenv.config();

// TypeORM DataSource instance for CLI
const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'condomanager',
  entities: [User, Apartment, Message, Notification],
  migrations: ['src/migrations/*.ts'],
  synchronize: false,
  logging: process.env.NODE_ENV !== 'production',
  ssl: {
    rejectUnauthorized: false, // Important for Aiven PostgreSQL
  },
});

export default dataSource; 