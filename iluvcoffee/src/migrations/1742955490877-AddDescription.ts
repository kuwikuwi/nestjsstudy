// src/migrations/1742955490877-AddDescription.ts
import { MigrationInterface, QueryRunner } from "typeorm";

export class AddDescription1742955490877 implements MigrationInterface {
    name = 'AddDescription1742955490877';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "event" ("id" SERIAL NOT NULL, "type" character varying NOT NULL, "name" character varying NOT NULL, "payload" json NOT NULL, CONSTRAINT "PK_30c2f3bbaf6d34a55f8ae6e4614" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_b535fbe8ec6d832dde22065ebd" ON "event" ("name")`);
        await queryRunner.query(`CREATE INDEX "IDX_6e1de41532ad6af403d3ceb4f2" ON "event" ("name", "type")`);

        // --- Start Coffee Table Changes ---
        // 1. Add 'name' column as nullable first
        await queryRunner.query(`ALTER TABLE "coffee" ADD "name" character varying NULL`);

        // 2. Populate the new 'name' column from the old 'title' column for existing rows
        //    (Assuming you want to transfer the data)
        await queryRunner.query(`UPDATE "coffee" SET "name" = "title"`);

        // 3. Now that existing rows have a 'name', make the column NOT NULL
        await queryRunner.query(`ALTER TABLE "coffee" ALTER COLUMN "name" SET NOT NULL`);

        // 4. Drop the old 'title' column
        await queryRunner.query(`ALTER TABLE "coffee" DROP COLUMN "title"`);

        // 5. Add other columns (these were likely fine)
        await queryRunner.query(`ALTER TABLE "coffee" ADD "description" character varying`); // Assuming description can be NULL
        await queryRunner.query(`ALTER TABLE "coffee" ADD "recommendations" integer NOT NULL DEFAULT '0'`);
        // --- End Coffee Table Changes ---
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Revert changes in reverse order
        await queryRunner.query(`ALTER TABLE "coffee" DROP COLUMN "recommendations"`);
        await queryRunner.query(`ALTER TABLE "coffee" DROP COLUMN "description"`);

        // Need to re-add title, potentially copy name back, then drop name
        await queryRunner.query(`ALTER TABLE "coffee" ADD "title" character varying NULL`);
        await queryRunner.query(`UPDATE "coffee" SET "title" = "name"`);
        await queryRunner.query(`ALTER TABLE "coffee" ALTER COLUMN "title" SET NOT NULL`); // Assuming title was NOT NULL before
        await queryRunner.query(`ALTER TABLE "coffee" DROP COLUMN "name"`);


        await queryRunner.query(`DROP INDEX "public"."IDX_6e1de41532ad6af403d3ceb4f2"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_b535fbe8ec6d832dde22065ebd"`);
        await queryRunner.query(`DROP TABLE "event"`);
    }
}