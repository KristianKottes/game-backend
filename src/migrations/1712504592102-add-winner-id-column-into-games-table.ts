import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddWinnerIdColumnIntoGamesTable1712504592102 implements MigrationInterface {
  name = 'AddWinnerIdColumnIntoGamesTable1712504592102';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "games" ADD "winner_id" uuid`);
    await queryRunner.query(
      `ALTER TABLE "games" ADD CONSTRAINT "FK_947813e7527e8cde22542e33d36" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "games" DROP CONSTRAINT "FK_947813e7527e8cde22542e33d36"`);
    await queryRunner.query(`ALTER TABLE "games" DROP COLUMN "winner_id"`);
  }
}
