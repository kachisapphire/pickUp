import { MigrationInterface, QueryRunner } from "typeorm";

export class AddOrderEntityToPaymetTable1769019303957 implements MigrationInterface {
    name = 'AddOrderEntityToPaymetTable1769019303957'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TYPE "public"."order_status_enum" RENAME TO "order_status_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."order_status_enum" AS ENUM('PAYMENT_PENDING', 'PAID', 'PROCESSING', 'OUT_FOR_DELIVERY', 'COMPLETED', 'CANCELLED')`);
        await queryRunner.query(`ALTER TABLE "order" ALTER COLUMN "status" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "order" ALTER COLUMN "status" TYPE "public"."order_status_enum" USING "status"::"text"::"public"."order_status_enum"`);
        await queryRunner.query(`ALTER TABLE "order" ALTER COLUMN "status" SET DEFAULT 'PAYMENT_PENDING'`);
        await queryRunner.query(`DROP TYPE "public"."order_status_enum_old"`);
        await queryRunner.query(`ALTER TABLE "payment_transaction" DROP COLUMN "orderId"`);
        await queryRunner.query(`ALTER TABLE "payment_transaction" ADD "orderId" uuid`);
        await queryRunner.query(`ALTER TABLE "payment_transaction" ADD CONSTRAINT "UQ_eec1bdc9c06ce2fcd67cd79082b" UNIQUE ("orderId")`);
        await queryRunner.query(`ALTER TABLE "payment_transaction" ADD CONSTRAINT "FK_eec1bdc9c06ce2fcd67cd79082b" FOREIGN KEY ("orderId") REFERENCES "order"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "payment_transaction" DROP CONSTRAINT "FK_eec1bdc9c06ce2fcd67cd79082b"`);
        await queryRunner.query(`ALTER TABLE "payment_transaction" DROP CONSTRAINT "UQ_eec1bdc9c06ce2fcd67cd79082b"`);
        await queryRunner.query(`ALTER TABLE "payment_transaction" DROP COLUMN "orderId"`);
        await queryRunner.query(`ALTER TABLE "payment_transaction" ADD "orderId" character varying`);
        await queryRunner.query(`CREATE TYPE "public"."order_status_enum_old" AS ENUM('PAYMENT_PENDING', 'PROCESSING', 'OUT_FOR_DELIVERY', 'COMPLETED', 'CANCELLED')`);
        await queryRunner.query(`ALTER TABLE "order" ALTER COLUMN "status" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "order" ALTER COLUMN "status" TYPE "public"."order_status_enum_old" USING "status"::"text"::"public"."order_status_enum_old"`);
        await queryRunner.query(`ALTER TABLE "order" ALTER COLUMN "status" SET DEFAULT 'PAYMENT_PENDING'`);
        await queryRunner.query(`DROP TYPE "public"."order_status_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."order_status_enum_old" RENAME TO "order_status_enum"`);
    }

}
