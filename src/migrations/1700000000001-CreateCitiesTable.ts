import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateCitiesTable1700000000001 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // Create cities table
        await queryRunner.query(`
            CREATE TABLE "city" (
                "id" SERIAL NOT NULL,
                "name" character varying NOT NULL,
                CONSTRAINT "UQ_city_name" UNIQUE ("name"),
                CONSTRAINT "PK_city" PRIMARY KEY ("id")
            )
        `);

        // Insert initial cities
        await queryRunner.query(`
            INSERT INTO "city" ("name") VALUES
            ('MAALE_ADUMIM'),
            ('NEW_YORK'),
            ('LONDON'),
            ('PARIS'),
            ('TOKYO'),
            ('BERLIN')
        `);

        // Add city_id column to users table
        await queryRunner.query(`
            ALTER TABLE "user" 
            ADD COLUMN "city_id" integer NOT NULL DEFAULT 1,
            ADD CONSTRAINT "FK_user_city" 
            FOREIGN KEY ("city_id") 
            REFERENCES "city"("id") 
            ON DELETE NO ACTION 
            ON UPDATE NO ACTION
        `);

        // Remove the old city enum column
        await queryRunner.query(`
            ALTER TABLE "user" 
            DROP COLUMN "city"
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Add back the city enum column
        await queryRunner.query(`
            ALTER TABLE "user" 
            ADD COLUMN "city" character varying NOT NULL DEFAULT 'MAALE_ADUMIM'
        `);

        // Remove the city_id foreign key and column
        await queryRunner.query(`
            ALTER TABLE "user" 
            DROP CONSTRAINT "FK_user_city",
            DROP COLUMN "city_id"
        `);

        // Drop the cities table
        await queryRunner.query(`DROP TABLE "city"`);
    }
} 