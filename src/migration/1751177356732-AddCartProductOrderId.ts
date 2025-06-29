import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCartProductOrderId1751177356732 implements MigrationInterface {
    name = 'AddCartProductOrderId1751177356732'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`order\` DROP COLUMN \`name\``);
        await queryRunner.query(`ALTER TABLE \`order\` DROP COLUMN \`address\``);
        await queryRunner.query(`ALTER TABLE \`order\` DROP COLUMN \`phone\``);
        await queryRunner.query(`ALTER TABLE \`order\` ADD \`amount\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`order\` ADD \`status\` enum ('Paid', 'failed') NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`cart_product\` ADD \`orderId\` varchar(36) NULL`);
        await queryRunner.query(`ALTER TABLE \`cart_product\` ADD CONSTRAINT \`FK_466e3296b78f4f85078d83dd775\` FOREIGN KEY (\`orderId\`) REFERENCES \`order\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`cart_product\` DROP FOREIGN KEY \`FK_466e3296b78f4f85078d83dd775\``);
        await queryRunner.query(`ALTER TABLE \`cart_product\` DROP COLUMN \`orderId\``);
        await queryRunner.query(`ALTER TABLE \`order\` DROP COLUMN \`status\``);
        await queryRunner.query(`ALTER TABLE \`order\` DROP COLUMN \`amount\``);
        await queryRunner.query(`ALTER TABLE \`order\` ADD \`phone\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`order\` ADD \`address\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`order\` ADD \`name\` varchar(255) NOT NULL`);
    }

}
