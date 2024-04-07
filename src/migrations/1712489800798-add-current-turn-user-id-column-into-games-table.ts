import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCurrentTurnUserIdColumnIntoGamesTable1712489800798 implements MigrationInterface {
  name = 'AddCurrentTurnUserIdColumnIntoGamesTable1712489800798';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "games" ADD "current_turn_user_id" uuid`);
    await queryRunner.query(
      `ALTER TABLE "games" ADD CONSTRAINT "FK_37a2890f433dbb1858ea3f53eeb" FOREIGN KEY ("current_turn_user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "games" DROP CONSTRAINT "FK_37a2890f433dbb1858ea3f53eeb"`);
    await queryRunner.query(`ALTER TABLE "games" DROP COLUMN "current_turn_user_id"`);
  }
}
