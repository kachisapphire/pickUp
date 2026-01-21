import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUserTable1758615434203 implements MigrationInterface {
  name = 'CreateUserTable1758615434203';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."user_role_enum" AS ENUM('user', 'admin')`,
    );
    await queryRunner.query(
      `CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "firstName" character varying, "lastName" character varying, "phone" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying, "role" "public"."user_role_enum" NOT NULL DEFAULT 'user', "isEmailVerified" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "category" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "description" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_23c05c292c439d77b0de816b500" UNIQUE ("name"), CONSTRAINT "PK_9c4e4a89e3674fc9f382d733f03" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "product" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "description" character varying NOT NULL, "image" character varying NOT NULL, "price" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_bebc9158e480b949565b4dc7a82" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "product_category_category" ("productId" uuid NOT NULL, "categoryId" uuid NOT NULL, CONSTRAINT "PK_f4340e51cf15d253111ae3bc5da" PRIMARY KEY ("productId", "categoryId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_7345bf754167ef603701fca9e6" ON "product_category_category" ("productId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_9f6058f88651acb9c6fd62e589" ON "product_category_category" ("categoryId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "product_category_category" ADD CONSTRAINT "FK_7345bf754167ef603701fca9e6e" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_category_category" ADD CONSTRAINT "FK_9f6058f88651acb9c6fd62e5890" FOREIGN KEY ("categoryId") REFERENCES "category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "product_category_category" DROP CONSTRAINT "FK_9f6058f88651acb9c6fd62e5890"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_category_category" DROP CONSTRAINT "FK_7345bf754167ef603701fca9e6e"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_9f6058f88651acb9c6fd62e589"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_7345bf754167ef603701fca9e6"`,
    );
    await queryRunner.query(`DROP TABLE "product_category_category"`);
    await queryRunner.query(`DROP TABLE "product"`);
    await queryRunner.query(`DROP TABLE "category"`);
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(`DROP TYPE "public"."user_role_enum"`);
  }
}
