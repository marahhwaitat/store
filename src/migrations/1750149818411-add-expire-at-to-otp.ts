import { MigrationInterface, QueryRunner } from "typeorm";

export class AddExpireAtToOtp1750149818411 implements MigrationInterface {
    name = 'AddExpireAtToOtp1750149818411'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`otp\` ADD \`expireAt\` datetime NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`otp\` DROP COLUMN \`expireAt\``);
    }

}
