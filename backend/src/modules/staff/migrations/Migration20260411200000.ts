import {Migration} from '@medusajs/framework/mikro-orm/migrations'

export class Migration20260411200000 extends Migration {
	override async up(): Promise<void> {
		this.addSql(`
			alter table if exists "staff_user"
			add column if not exists "first_name" text null;
		`)
		this.addSql(`
			alter table if exists "staff_user"
			add column if not exists "last_name" text null;
		`)
	}

	override async down(): Promise<void> {
		this.addSql(`alter table if exists "staff_user" drop column if exists "first_name";`)
		this.addSql(`alter table if exists "staff_user" drop column if exists "last_name";`)
	}
}
