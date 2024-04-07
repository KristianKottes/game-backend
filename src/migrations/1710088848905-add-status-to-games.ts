import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddStatusToGames1710088848905 implements MigrationInterface {
  name = 'AddStatusToGames1710088848905';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TYPE "public"."games_status_enum" AS ENUM('0', '1', '2', '3')`);
    await queryRunner.query(
      `ALTER TABLE "games" ADD "status" "public"."games_status_enum" NOT NULL DEFAULT '0'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "games" DROP COLUMN "status"`);
    await queryRunner.query(`DROP TYPE "public"."games_status_enum"`);
  }
}
