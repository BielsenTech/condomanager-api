import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';
import { User } from '../modules/user/entities/user.entity';
import { Apartment } from '../modules/apartment/entities/apartment.entity';
import { Message } from '../modules/message/entities/message.entity';
import { Notification } from '../modules/notification/entities/notification.entity';

// Load environment variables
const environment = process.env.NODE_ENV || 'development';
const envFilePath = path.resolve(process.cwd(), `.env${environment === 'production' ? '.production' : ''}`);

if (fs.existsSync(envFilePath)) {
  dotenv.config({ path: envFilePath });
} else {
  dotenv.config();
}

// TypeORM requires a single default export of DataSource
export default new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'condomanager',
  entities: [User, Apartment, Message, Notification],
  migrations: [__dirname + '/../migrations/*{.ts,.js}'],
  synchronize: false,
  logging: process.env.NODE_ENV !== 'production',
}); 