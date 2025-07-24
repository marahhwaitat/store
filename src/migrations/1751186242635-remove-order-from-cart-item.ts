import { MigrationInterface, QueryRunner } from "typeorm";

export class RemoveOrderFromCartItem1751186242635 implements MigrationInterface {
    name = 'RemoveOrderFromCartItem1751186242635'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`cart_product\` DROP FOREIGN KEY \`FK_466e3296b78f4f85078d83dd775\``);
        await queryRunner.query(`ALTER TABLE \`cart_product\` DROP COLUMN \`orderId\``);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`cart_product\` ADD \`orderId\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`cart_product\` ADD CONSTRAINT \`FK_466e3296b78f4f85078d83dd775\` FOREIGN KEY (\`orderId\`) REFERENCES \`order\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
