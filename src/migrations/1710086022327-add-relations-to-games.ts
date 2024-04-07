import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddRelationsToGames1710086022327 implements MigrationInterface {
  name = 'AddRelationsToGames1710086022327';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "games" ADD CONSTRAINT "FK_ebae547ce8a600ff8b9f35a6e79" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "games" ADD CONSTRAINT "FK_b959438d1d78251d044a426d8f8" FOREIGN KEY ("member_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "games" DROP CONSTRAINT "FK_b959438d1d78251d044a426d8f8"`);
    await queryRunner.query(`ALTER TABLE "games" DROP CONSTRAINT "FK_ebae547ce8a600ff8b9f35a6e79"`);
  }
}
