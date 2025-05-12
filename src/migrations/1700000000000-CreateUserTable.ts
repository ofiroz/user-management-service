import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUserTable1700000000000 implements MigrationInterface {
    name = 'CreateUserTable1700000000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TYPE "public"."user_city_enum" AS ENUM('MAALE_ADUMIM', 'NEW_YORK', 'LONDON', 'PARIS', 'TOKYO', 'BERLIN')
        `);
        
        await queryRunner.query(`
            CREATE TABLE "user" (
                "id" SERIAL NOT NULL,
                "first_name" character varying NOT NULL,
                "last_name" character varying NOT NULL,
                "birth_date" TIMESTAMP NOT NULL,
                "city" "public"."user_city_enum" NOT NULL,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_user" PRIMARY KEY ("id")
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TYPE "public"."user_city_enum"`);
    }
} 