import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateInitialSchema1769796374872 implements MigrationInterface {
    name = 'CreateInitialSchema1769796374872'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "users" ("id" varchar PRIMARY KEY NOT NULL, "username" varchar NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')))`);
        await queryRunner.query(`CREATE TABLE "promotions" ("id" varchar PRIMARY KEY NOT NULL, "title" varchar NOT NULL, "merchant" varchar NOT NULL, "rewardAmount" decimal NOT NULL, "rewardCurrency" varchar NOT NULL, "description" text NOT NULL, "terms" text NOT NULL, "thumbnailUrl" varchar NOT NULL, "expiresAt" datetime NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')))`);
        await queryRunner.query(`CREATE INDEX "IDX_353cd78dcad77393c543b7546e" ON "promotions" ("expiresAt") `);
        await queryRunner.query(`CREATE INDEX "IDX_be31c5e45be0f05efbc9e475dc" ON "promotions" ("merchant") `);
        await queryRunner.query(`CREATE INDEX "IDX_3243efaabeff8c2a7ea262169b" ON "promotions" ("title") `);
        await queryRunner.query(`CREATE TABLE "favorites" ("id" varchar PRIMARY KEY NOT NULL, "userId" varchar NOT NULL, "promotionId" varchar NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), CONSTRAINT "UQ_17957422afffdd03153c02200df" UNIQUE ("userId", "promotionId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_d2d86946b141fbad353bf3100a" ON "favorites" ("promotionId") `);
        await queryRunner.query(`CREATE INDEX "IDX_e747534006c6e3c2f09939da60" ON "favorites" ("userId") `);
        await queryRunner.query(`CREATE TABLE "audit_events" ("id" varchar PRIMARY KEY NOT NULL, "userId" varchar NOT NULL, "promotionId" varchar NOT NULL, "action" varchar NOT NULL, "timestamp" datetime NOT NULL DEFAULT (datetime('now')))`);
        await queryRunner.query(`CREATE INDEX "IDX_eb146ea40af54a3564a45dbce7" ON "audit_events" ("timestamp") `);
        await queryRunner.query(`CREATE INDEX "IDX_6648016e6e3596e3613bffe927" ON "audit_events" ("promotionId") `);
        await queryRunner.query(`CREATE INDEX "IDX_ca95e8c5e5130e53ea849bbe18" ON "audit_events" ("userId") `);
        await queryRunner.query(`DROP INDEX "IDX_d2d86946b141fbad353bf3100a"`);
        await queryRunner.query(`DROP INDEX "IDX_e747534006c6e3c2f09939da60"`);
        await queryRunner.query(`CREATE TABLE "temporary_favorites" ("id" varchar PRIMARY KEY NOT NULL, "userId" varchar NOT NULL, "promotionId" varchar NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), CONSTRAINT "UQ_17957422afffdd03153c02200df" UNIQUE ("userId", "promotionId"), CONSTRAINT "FK_e747534006c6e3c2f09939da60f" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_d2d86946b141fbad353bf3100ac" FOREIGN KEY ("promotionId") REFERENCES "promotions" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_favorites"("id", "userId", "promotionId", "createdAt") SELECT "id", "userId", "promotionId", "createdAt" FROM "favorites"`);
        await queryRunner.query(`DROP TABLE "favorites"`);
        await queryRunner.query(`ALTER TABLE "temporary_favorites" RENAME TO "favorites"`);
        await queryRunner.query(`CREATE INDEX "IDX_d2d86946b141fbad353bf3100a" ON "favorites" ("promotionId") `);
        await queryRunner.query(`CREATE INDEX "IDX_e747534006c6e3c2f09939da60" ON "favorites" ("userId") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "IDX_e747534006c6e3c2f09939da60"`);
        await queryRunner.query(`DROP INDEX "IDX_d2d86946b141fbad353bf3100a"`);
        await queryRunner.query(`ALTER TABLE "favorites" RENAME TO "temporary_favorites"`);
        await queryRunner.query(`CREATE TABLE "favorites" ("id" varchar PRIMARY KEY NOT NULL, "userId" varchar NOT NULL, "promotionId" varchar NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), CONSTRAINT "UQ_17957422afffdd03153c02200df" UNIQUE ("userId", "promotionId"))`);
        await queryRunner.query(`INSERT INTO "favorites"("id", "userId", "promotionId", "createdAt") SELECT "id", "userId", "promotionId", "createdAt" FROM "temporary_favorites"`);
        await queryRunner.query(`DROP TABLE "temporary_favorites"`);
        await queryRunner.query(`CREATE INDEX "IDX_e747534006c6e3c2f09939da60" ON "favorites" ("userId") `);
        await queryRunner.query(`CREATE INDEX "IDX_d2d86946b141fbad353bf3100a" ON "favorites" ("promotionId") `);
        await queryRunner.query(`DROP INDEX "IDX_ca95e8c5e5130e53ea849bbe18"`);
        await queryRunner.query(`DROP INDEX "IDX_6648016e6e3596e3613bffe927"`);
        await queryRunner.query(`DROP INDEX "IDX_eb146ea40af54a3564a45dbce7"`);
        await queryRunner.query(`DROP TABLE "audit_events"`);
        await queryRunner.query(`DROP INDEX "IDX_e747534006c6e3c2f09939da60"`);
        await queryRunner.query(`DROP INDEX "IDX_d2d86946b141fbad353bf3100a"`);
        await queryRunner.query(`DROP TABLE "favorites"`);
        await queryRunner.query(`DROP INDEX "IDX_3243efaabeff8c2a7ea262169b"`);
        await queryRunner.query(`DROP INDEX "IDX_be31c5e45be0f05efbc9e475dc"`);
        await queryRunner.query(`DROP INDEX "IDX_353cd78dcad77393c543b7546e"`);
        await queryRunner.query(`DROP TABLE "promotions"`);
        await queryRunner.query(`DROP TABLE "users"`);
    }

}
