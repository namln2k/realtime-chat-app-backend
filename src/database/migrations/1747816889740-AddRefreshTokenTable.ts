import { MigrationInterface, QueryRunner } from "typeorm";

export class AddRefreshTokenTable1747816889740 implements MigrationInterface {
    name = 'AddRefreshTokenTable1747816889740'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "temporary_role" ("id" varchar PRIMARY KEY NOT NULL, "name" varchar NOT NULL)`);
        await queryRunner.query(`INSERT INTO "temporary_role"("id", "name") SELECT "id", "name" FROM "role"`);
        await queryRunner.query(`DROP TABLE "role"`);
        await queryRunner.query(`ALTER TABLE "temporary_role" RENAME TO "role"`);
        await queryRunner.query(`CREATE TABLE "refresh_token" ("id" varchar PRIMARY KEY NOT NULL, "value" varchar NOT NULL, "userId" varchar NOT NULL, "isActive" boolean NOT NULL DEFAULT (1), "expiresAt" integer NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')))`);
        await queryRunner.query(`CREATE TABLE "temporary_role" ("id" varchar PRIMARY KEY NOT NULL, "name" varchar NOT NULL, CONSTRAINT "UQ_d430b72bf1eaebce7f87068a431" UNIQUE ("name"))`);
        await queryRunner.query(`INSERT INTO "temporary_role"("id", "name") SELECT "id", "name" FROM "role"`);
        await queryRunner.query(`DROP TABLE "role"`);
        await queryRunner.query(`ALTER TABLE "temporary_role" RENAME TO "role"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "role" RENAME TO "temporary_role"`);
        await queryRunner.query(`CREATE TABLE "role" ("id" varchar PRIMARY KEY NOT NULL, "name" varchar NOT NULL)`);
        await queryRunner.query(`INSERT INTO "role"("id", "name") SELECT "id", "name" FROM "temporary_role"`);
        await queryRunner.query(`DROP TABLE "temporary_role"`);
        await queryRunner.query(`DROP TABLE "refresh_token"`);
        await queryRunner.query(`ALTER TABLE "role" RENAME TO "temporary_role"`);
        await queryRunner.query(`CREATE TABLE "role" ("id" varchar PRIMARY KEY NOT NULL, "name" varchar NOT NULL)`);
        await queryRunner.query(`INSERT INTO "role"("id", "name") SELECT "id", "name" FROM "temporary_role"`);
        await queryRunner.query(`DROP TABLE "temporary_role"`);
    }

}
