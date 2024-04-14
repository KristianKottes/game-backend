import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddTimestampColumnsIntoMessagesTable1713095624573 implements MigrationInterface {
  name = 'AddTimestampColumnsIntoMessagesTable1713095624573';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "messages" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "messages" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "messages" DROP COLUMN "updated_at"`);
    await queryRunner.query(`ALTER TABLE "messages" DROP COLUMN "created_at"`);
  }
}
