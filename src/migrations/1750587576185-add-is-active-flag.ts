import { MigrationInterface, QueryRunner } from "typeorm";

export class AddIsActiveFlag1750587576185 implements MigrationInterface {
    name = 'AddIsActiveFlag1750587576185'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`cart\` ADD \`isActive\` tinyint NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`cart\` DROP COLUMN \`isActive\``);
    }

}
