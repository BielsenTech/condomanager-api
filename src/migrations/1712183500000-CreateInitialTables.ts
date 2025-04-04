import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateInitialTables1712183500000 implements MigrationInterface {
    name = 'CreateInitialTables1712183500000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Create user table
        await queryRunner.query(`
            CREATE TYPE "public"."user_role_enum" AS ENUM('resident', 'concierge', 'admin')
        `);
        
        await queryRunner.query(`
            CREATE TABLE "user" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "email" character varying NOT NULL,
                "password" character varying,
                "name" character varying,
                "googleId" character varying,
                "discordId" character varying,
                "avatarUrl" character varying,
                "phoneNumber" character varying,
                "role" "public"."user_role_enum" NOT NULL DEFAULT 'resident',
                "isActive" boolean NOT NULL DEFAULT true,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                "apartmentId" uuid,
                CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"),
                CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id")
            )
        `);
        
        // Create apartment table
        await queryRunner.query(`
            CREATE TABLE "apartment" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "number" character varying NOT NULL,
                "floor" character varying,
                "block" character varying,
                "description" character varying,
                "isOccupied" boolean NOT NULL DEFAULT true,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_c3d874d9924bf542eba718a6653" PRIMARY KEY ("id")
            )
        `);
        
        // Create message table
        await queryRunner.query(`
            CREATE TYPE "public"."message_type_enum" AS ENUM('direct', 'apartment', 'building')
        `);
        
        await queryRunner.query(`
            CREATE TABLE "message" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "content" character varying NOT NULL,
                "type" "public"."message_type_enum" NOT NULL DEFAULT 'direct',
                "isRead" boolean NOT NULL DEFAULT false,
                "attachmentUrl" character varying,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "senderId" uuid,
                "recipientId" uuid,
                "apartmentId" uuid,
                CONSTRAINT "PK_ba01f0a3e0123651915008bc578" PRIMARY KEY ("id")
            )
        `);
        
        // Create notification table
        await queryRunner.query(`
            CREATE TYPE "public"."notification_type_enum" AS ENUM('message', 'call', 'announcement', 'event')
        `);
        
        await queryRunner.query(`
            CREATE TABLE "notification" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "title" character varying NOT NULL,
                "content" character varying NOT NULL,
                "type" "public"."notification_type_enum" NOT NULL,
                "isRead" boolean NOT NULL DEFAULT false,
                "linkedEntityId" character varying,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "userId" uuid,
                CONSTRAINT "PK_705b6c7cdf9b2c2ff7ac7872cb7" PRIMARY KEY ("id")
            )
        `);
        
        // Add foreign keys
        await queryRunner.query(`
            ALTER TABLE "user" ADD CONSTRAINT "FK_user_apartment" 
            FOREIGN KEY ("apartmentId") REFERENCES "apartment"("id") ON DELETE SET NULL ON UPDATE NO ACTION
        `);
        
        await queryRunner.query(`
            ALTER TABLE "message" ADD CONSTRAINT "FK_message_sender" 
            FOREIGN KEY ("senderId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE NO ACTION
        `);
        
        await queryRunner.query(`
            ALTER TABLE "message" ADD CONSTRAINT "FK_message_recipient" 
            FOREIGN KEY ("recipientId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE NO ACTION
        `);
        
        await queryRunner.query(`
            ALTER TABLE "message" ADD CONSTRAINT "FK_message_apartment" 
            FOREIGN KEY ("apartmentId") REFERENCES "apartment"("id") ON DELETE SET NULL ON UPDATE NO ACTION
        `);
        
        await queryRunner.query(`
            ALTER TABLE "notification" ADD CONSTRAINT "FK_notification_user" 
            FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
        
        // Add extension for UUID generation if it doesn't exist
        await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop foreign keys
        await queryRunner.query(`ALTER TABLE "notification" DROP CONSTRAINT "FK_notification_user"`);
        await queryRunner.query(`ALTER TABLE "message" DROP CONSTRAINT "FK_message_apartment"`);
        await queryRunner.query(`ALTER TABLE "message" DROP CONSTRAINT "FK_message_recipient"`);
        await queryRunner.query(`ALTER TABLE "message" DROP CONSTRAINT "FK_message_sender"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_user_apartment"`);
        
        // Drop tables
        await queryRunner.query(`DROP TABLE "notification"`);
        await queryRunner.query(`DROP TABLE "message"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "apartment"`);
        
        // Drop enums
        await queryRunner.query(`DROP TYPE "public"."notification_type_enum"`);
        await queryRunner.query(`DROP TYPE "public"."message_type_enum"`);
        await queryRunner.query(`DROP TYPE "public"."user_role_enum"`);
    }
} 