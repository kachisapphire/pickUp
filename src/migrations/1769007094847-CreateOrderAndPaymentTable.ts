import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateOrderAndPaymentTable1769007094847 implements MigrationInterface {
    name = 'CreateOrderAndPaymentTable1769007094847'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "order_item" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "quantity" integer NOT NULL, "orderItemPrice" numeric(10,2) NOT NULL, "orderItemTotalAmount" numeric(10,2) NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "productId" uuid, "orderId" uuid, CONSTRAINT "PK_d01158fe15b1ead5c26fd7f4e90" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."order_status_enum" AS ENUM('PAYMENT_PENDING', 'PROCESSING', 'OUT_FOR_DELIVERY', 'COMPLETED', 'CANCELLED')`);
        await queryRunner.query(`CREATE TABLE "order" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "orderNumber" character varying NOT NULL, "totalAmount" numeric(10,2) NOT NULL, "status" "public"."order_status_enum" NOT NULL DEFAULT 'PAYMENT_PENDING', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" uuid, CONSTRAINT "PK_1031171c13130102495201e3e20" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."payment_transaction_paymentstatus_enum" AS ENUM('pending', 'failed', 'refunded', 'initiated', 'successful', 'cancelled', 'timeout')`);
        await queryRunner.query(`CREATE TABLE "payment_transaction" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "paymentStatus" "public"."payment_transaction_paymentstatus_enum" NOT NULL DEFAULT 'pending', "amount" integer NOT NULL, "userId" character varying, "transactionReference" character varying NOT NULL, "orderId" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_82c3470854cf4642dfb0d7150cd" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "product" ADD "quantity" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "product" ADD "isAvailable" boolean NOT NULL DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "order_item" ADD CONSTRAINT "FK_904370c093ceea4369659a3c810" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order_item" ADD CONSTRAINT "FK_646bf9ece6f45dbe41c203e06e0" FOREIGN KEY ("orderId") REFERENCES "order"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order" ADD CONSTRAINT "FK_caabe91507b3379c7ba73637b84" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order" DROP CONSTRAINT "FK_caabe91507b3379c7ba73637b84"`);
        await queryRunner.query(`ALTER TABLE "order_item" DROP CONSTRAINT "FK_646bf9ece6f45dbe41c203e06e0"`);
        await queryRunner.query(`ALTER TABLE "order_item" DROP CONSTRAINT "FK_904370c093ceea4369659a3c810"`);
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "isAvailable"`);
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "quantity"`);
        await queryRunner.query(`DROP TABLE "payment_transaction"`);
        await queryRunner.query(`DROP TYPE "public"."payment_transaction_paymentstatus_enum"`);
        await queryRunner.query(`DROP TABLE "order"`);
        await queryRunner.query(`DROP TYPE "public"."order_status_enum"`);
        await queryRunner.query(`DROP TABLE "order_item"`);
    }

}
