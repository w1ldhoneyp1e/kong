import {Migration} from '@medusajs/framework/mikro-orm/migrations'

export class Migration20260325200500 extends Migration {
	override async up(): Promise<void> {
		this.addSql(`
			create table if not exists "staff_user" (
				"id" text not null,
				"email" text not null,
				"password_hash" text not null,
				"created_at" timestamptz not null default now(),
				"updated_at" timestamptz not null default now(),
				"deleted_at" timestamptz null,
				constraint "staff_user_pkey" primary key ("id")
			);
		`)

		this.addSql(`create unique index if not exists "IDX_staff_user_email" on "staff_user" ("email");`)
	}

	override async down(): Promise<void> {
		this.addSql(`drop table if exists "staff_user" cascade;`)
	}
}

