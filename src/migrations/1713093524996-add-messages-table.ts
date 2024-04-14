import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddMessagesTable1713093524996 implements MigrationInterface {
  name = 'AddMessagesTable1713093524996';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "messages" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "sender_id" uuid NOT NULL, "recipient_id" uuid NOT NULL, "game_id" uuid NOT NULL, "text" character varying NOT NULL, CONSTRAINT "REL_22133395bd13b970ccd0c34ab2" UNIQUE ("sender_id"), CONSTRAINT "REL_566c3d68184e83d4307b86f85a" UNIQUE ("recipient_id"), CONSTRAINT "REL_48bbf8e77a7b1e109af55e2b41" UNIQUE ("game_id"), CONSTRAINT "PK_18325f38ae6de43878487eff986" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "messages" ADD CONSTRAINT "FK_22133395bd13b970ccd0c34ab22" FOREIGN KEY ("sender_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "messages" ADD CONSTRAINT "FK_566c3d68184e83d4307b86f85ab" FOREIGN KEY ("recipient_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "messages" ADD CONSTRAINT "FK_48bbf8e77a7b1e109af55e2b419" FOREIGN KEY ("game_id") REFERENCES "games"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "messages" DROP CONSTRAINT "FK_48bbf8e77a7b1e109af55e2b419"`,
    );
    await queryRunner.query(
      `ALTER TABLE "messages" DROP CONSTRAINT "FK_566c3d68184e83d4307b86f85ab"`,
    );
    await queryRunner.query(
      `ALTER TABLE "messages" DROP CONSTRAINT "FK_22133395bd13b970ccd0c34ab22"`,
    );
    await queryRunner.query(`DROP TABLE "messages"`);
  }
}
