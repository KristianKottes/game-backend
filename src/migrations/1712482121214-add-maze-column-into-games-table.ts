import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddMazeColumnIntoGamesTable1712482121214 implements MigrationInterface {
  name = 'AddMazeColumnIntoGamesTable1712482121214';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "games" ADD "maze" integer array NOT NULL DEFAULT '{}'`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "games" DROP COLUMN "maze"`);
  }
}
