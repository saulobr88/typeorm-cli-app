import { MigrationInterface, QueryRunner } from "typeorm";

export class Initial1750165302905 implements MigrationInterface {
    name = 'Initial1750165302905'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "profile" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "firstName" varchar NOT NULL, "lastName" varchar NOT NULL, "bio" varchar)`);
        await queryRunner.query(`CREATE TABLE "category" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL)`);
        await queryRunner.query(`CREATE TABLE "tag" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL)`);
        await queryRunner.query(`CREATE TABLE "comment" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "content" varchar NOT NULL, "postId" integer, "parentId" integer)`);
        await queryRunner.query(`CREATE TABLE "post" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "title" varchar NOT NULL, "content" text NOT NULL, "userId" integer, "categoryId" integer)`);
        await queryRunner.query(`CREATE TABLE "user" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "username" varchar NOT NULL, "email" varchar NOT NULL, "profileId" integer, CONSTRAINT "REL_9466682df91534dd95e4dbaa61" UNIQUE ("profileId"))`);
        await queryRunner.query(`CREATE TABLE "post_tags_tag" ("postId" integer NOT NULL, "tagId" integer NOT NULL, PRIMARY KEY ("postId", "tagId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_b651178cc41334544a7a9601c4" ON "post_tags_tag" ("postId") `);
        await queryRunner.query(`CREATE INDEX "IDX_41e7626b9cc03c5c65812ae55e" ON "post_tags_tag" ("tagId") `);
        await queryRunner.query(`CREATE TABLE "temporary_comment" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "content" varchar NOT NULL, "postId" integer, "parentId" integer, CONSTRAINT "FK_94a85bb16d24033a2afdd5df060" FOREIGN KEY ("postId") REFERENCES "post" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_e3aebe2bd1c53467a07109be596" FOREIGN KEY ("parentId") REFERENCES "comment" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_comment"("id", "content", "postId", "parentId") SELECT "id", "content", "postId", "parentId" FROM "comment"`);
        await queryRunner.query(`DROP TABLE "comment"`);
        await queryRunner.query(`ALTER TABLE "temporary_comment" RENAME TO "comment"`);
        await queryRunner.query(`CREATE TABLE "temporary_post" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "title" varchar NOT NULL, "content" text NOT NULL, "userId" integer, "categoryId" integer, CONSTRAINT "FK_5c1cf55c308037b5aca1038a131" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_1077d47e0112cad3c16bbcea6cd" FOREIGN KEY ("categoryId") REFERENCES "category" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_post"("id", "title", "content", "userId", "categoryId") SELECT "id", "title", "content", "userId", "categoryId" FROM "post"`);
        await queryRunner.query(`DROP TABLE "post"`);
        await queryRunner.query(`ALTER TABLE "temporary_post" RENAME TO "post"`);
        await queryRunner.query(`CREATE TABLE "temporary_user" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "username" varchar NOT NULL, "email" varchar NOT NULL, "profileId" integer, CONSTRAINT "REL_9466682df91534dd95e4dbaa61" UNIQUE ("profileId"), CONSTRAINT "FK_9466682df91534dd95e4dbaa616" FOREIGN KEY ("profileId") REFERENCES "profile" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_user"("id", "username", "email", "profileId") SELECT "id", "username", "email", "profileId" FROM "user"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`ALTER TABLE "temporary_user" RENAME TO "user"`);
        await queryRunner.query(`DROP INDEX "IDX_b651178cc41334544a7a9601c4"`);
        await queryRunner.query(`DROP INDEX "IDX_41e7626b9cc03c5c65812ae55e"`);
        await queryRunner.query(`CREATE TABLE "temporary_post_tags_tag" ("postId" integer NOT NULL, "tagId" integer NOT NULL, CONSTRAINT "FK_b651178cc41334544a7a9601c45" FOREIGN KEY ("postId") REFERENCES "post" ("id") ON DELETE CASCADE ON UPDATE CASCADE, CONSTRAINT "FK_41e7626b9cc03c5c65812ae55e8" FOREIGN KEY ("tagId") REFERENCES "tag" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, PRIMARY KEY ("postId", "tagId"))`);
        await queryRunner.query(`INSERT INTO "temporary_post_tags_tag"("postId", "tagId") SELECT "postId", "tagId" FROM "post_tags_tag"`);
        await queryRunner.query(`DROP TABLE "post_tags_tag"`);
        await queryRunner.query(`ALTER TABLE "temporary_post_tags_tag" RENAME TO "post_tags_tag"`);
        await queryRunner.query(`CREATE INDEX "IDX_b651178cc41334544a7a9601c4" ON "post_tags_tag" ("postId") `);
        await queryRunner.query(`CREATE INDEX "IDX_41e7626b9cc03c5c65812ae55e" ON "post_tags_tag" ("tagId") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "IDX_41e7626b9cc03c5c65812ae55e"`);
        await queryRunner.query(`DROP INDEX "IDX_b651178cc41334544a7a9601c4"`);
        await queryRunner.query(`ALTER TABLE "post_tags_tag" RENAME TO "temporary_post_tags_tag"`);
        await queryRunner.query(`CREATE TABLE "post_tags_tag" ("postId" integer NOT NULL, "tagId" integer NOT NULL, PRIMARY KEY ("postId", "tagId"))`);
        await queryRunner.query(`INSERT INTO "post_tags_tag"("postId", "tagId") SELECT "postId", "tagId" FROM "temporary_post_tags_tag"`);
        await queryRunner.query(`DROP TABLE "temporary_post_tags_tag"`);
        await queryRunner.query(`CREATE INDEX "IDX_41e7626b9cc03c5c65812ae55e" ON "post_tags_tag" ("tagId") `);
        await queryRunner.query(`CREATE INDEX "IDX_b651178cc41334544a7a9601c4" ON "post_tags_tag" ("postId") `);
        await queryRunner.query(`ALTER TABLE "user" RENAME TO "temporary_user"`);
        await queryRunner.query(`CREATE TABLE "user" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "username" varchar NOT NULL, "email" varchar NOT NULL, "profileId" integer, CONSTRAINT "REL_9466682df91534dd95e4dbaa61" UNIQUE ("profileId"))`);
        await queryRunner.query(`INSERT INTO "user"("id", "username", "email", "profileId") SELECT "id", "username", "email", "profileId" FROM "temporary_user"`);
        await queryRunner.query(`DROP TABLE "temporary_user"`);
        await queryRunner.query(`ALTER TABLE "post" RENAME TO "temporary_post"`);
        await queryRunner.query(`CREATE TABLE "post" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "title" varchar NOT NULL, "content" text NOT NULL, "userId" integer, "categoryId" integer)`);
        await queryRunner.query(`INSERT INTO "post"("id", "title", "content", "userId", "categoryId") SELECT "id", "title", "content", "userId", "categoryId" FROM "temporary_post"`);
        await queryRunner.query(`DROP TABLE "temporary_post"`);
        await queryRunner.query(`ALTER TABLE "comment" RENAME TO "temporary_comment"`);
        await queryRunner.query(`CREATE TABLE "comment" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "content" varchar NOT NULL, "postId" integer, "parentId" integer)`);
        await queryRunner.query(`INSERT INTO "comment"("id", "content", "postId", "parentId") SELECT "id", "content", "postId", "parentId" FROM "temporary_comment"`);
        await queryRunner.query(`DROP TABLE "temporary_comment"`);
        await queryRunner.query(`DROP INDEX "IDX_41e7626b9cc03c5c65812ae55e"`);
        await queryRunner.query(`DROP INDEX "IDX_b651178cc41334544a7a9601c4"`);
        await queryRunner.query(`DROP TABLE "post_tags_tag"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "post"`);
        await queryRunner.query(`DROP TABLE "comment"`);
        await queryRunner.query(`DROP TABLE "tag"`);
        await queryRunner.query(`DROP TABLE "category"`);
        await queryRunner.query(`DROP TABLE "profile"`);
    }

}
