import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTraceIdToAuditEvents1769810150000 implements MigrationInterface {
    name = 'AddTraceIdToAuditEvents1769810150000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "audit_events" ADD COLUMN "traceId" varchar`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "temporary_audit_events" ("id" varchar PRIMARY KEY NOT NULL, "userId" varchar NOT NULL, "promotionId" varchar NOT NULL, "action" varchar NOT NULL, "timestamp" datetime NOT NULL DEFAULT (datetime('now')))`);
        await queryRunner.query(`INSERT INTO "temporary_audit_events"("id", "userId", "promotionId", "action", "timestamp") SELECT "id", "userId", "promotionId", "action", "timestamp" FROM "audit_events"`);
        await queryRunner.query(`DROP TABLE "audit_events"`);
        await queryRunner.query(`ALTER TABLE "temporary_audit_events" RENAME TO "audit_events"`);
    }
}
