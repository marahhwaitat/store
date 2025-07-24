import { MigrationInterface, QueryRunner } from "typeorm";

export class AddDeleteColumnToProducts1751277747398 implements MigrationInterface {
    name = 'AddDeleteColumnToProducts1751277747398'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`product\` ADD \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`product\` ADD \`deletedAt\` datetime(6) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`product\` DROP COLUMN \`deletedAt\``);
        await queryRunner.query(`ALTER TABLE \`product\` DROP COLUMN \`createdAt\``);
    }

}
