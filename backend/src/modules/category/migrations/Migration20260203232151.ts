import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260203232151 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table if not exists "category" ("id" text not null, "name" text not null, "slug" text not null, "parent_id" text null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "category_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_category_parent_id" ON "category" ("parent_id") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_category_deleted_at" ON "category" ("deleted_at") WHERE deleted_at IS NULL;`);

    this.addSql(`alter table if exists "category" add constraint "category_parent_id_foreign" foreign key ("parent_id") references "category" ("id") on update cascade on delete cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table if exists "category" drop constraint if exists "category_parent_id_foreign";`);

    this.addSql(`drop table if exists "category" cascade;`);
  }

}
