import {Migration} from '@medusajs/framework/mikro-orm/migrations'

export class Migration20260325190000 extends Migration {
	override async up(): Promise<void> {
		this.addSql(`create table if not exists "rbac_role" ("id" text not null, "code" text not null, "name" text not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "rbac_role_pkey" primary key ("id"));`)
		this.addSql(`create unique index if not exists "IDX_rbac_role_code" on "rbac_role" ("code");`)

		this.addSql(`create table if not exists "rbac_permission" ("id" text not null, "key" text not null, "name" text not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "rbac_permission_pkey" primary key ("id"));`)
		this.addSql(`create unique index if not exists "IDX_rbac_permission_key" on "rbac_permission" ("key");`)

		this.addSql(`create table if not exists "rbac_role_permission" ("id" text not null, "role_id" text not null, "permission_id" text not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "rbac_role_permission_pkey" primary key ("id"));`)

		this.addSql(`create index if not exists "IDX_rbac_role_permission_role_id" on "rbac_role_permission" ("role_id");`)
		this.addSql(`create index if not exists "IDX_rbac_role_permission_permission_id" on "rbac_role_permission" ("permission_id");`)

		this.addSql(`alter table if exists "rbac_role_permission" add constraint "rbac_role_permission_role_id_foreign" foreign key ("role_id") references "rbac_role" ("id") on update cascade on delete cascade;`)
		this.addSql(`alter table if exists "rbac_role_permission" add constraint "rbac_role_permission_permission_id_foreign" foreign key ("permission_id") references "rbac_permission" ("id") on update cascade on delete cascade;`)

		this.addSql(`create table if not exists "rbac_actor_role" ("id" text not null, "actor_type" text not null, "actor_id" text not null, "role_id" text not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "rbac_actor_role_pkey" primary key ("id"));`)

		this.addSql(`create unique index if not exists "IDX_rbac_actor_role_unique" on "rbac_actor_role" ("actor_type", "actor_id", "role_id");`)
		this.addSql(`create index if not exists "IDX_rbac_actor_role_actor_type_actor_id" on "rbac_actor_role" ("actor_type", "actor_id");`)

		this.addSql(`alter table if exists "rbac_actor_role" add constraint "rbac_actor_role_role_id_foreign" foreign key ("role_id") references "rbac_role" ("id") on update cascade on delete cascade;`)

		this.addSql(`
			insert into "rbac_role" ("id", "code", "name")
			select 'role_owner', 'owner', 'Owner'
			where not exists (select 1 from "rbac_role" where "code" = 'owner');
		`)
		this.addSql(`
			insert into "rbac_role" ("id", "code", "name")
			select 'role_admin', 'admin', 'Admin'
			where not exists (select 1 from "rbac_role" where "code" = 'admin');
		`)
		this.addSql(`
			insert into "rbac_role" ("id", "code", "name")
			select 'role_manager', 'manager', 'Manager'
			where not exists (select 1 from "rbac_role" where "code" = 'manager');
		`)
		this.addSql(`
			insert into "rbac_role" ("id", "code", "name")
			select 'role_customer', 'customer', 'Customer'
			where not exists (select 1 from "rbac_role" where "code" = 'customer');
		`)
		this.addSql(`
			insert into "rbac_role" ("id", "code", "name")
			select 'role_guest', 'guest', 'Guest'
			where not exists (select 1 from "rbac_role" where "code" = 'guest');
		`)

		this.addSql(`
			insert into "rbac_permission" ("id", "key", "name")
			select 'perm_staff_manage', 'staff:manage', 'Manage staff'
			where not exists (select 1 from "rbac_permission" where "key" = 'staff:manage');
		`)
		this.addSql(`
			insert into "rbac_permission" ("id", "key", "name")
			select 'perm_roles_manage', 'roles:manage', 'Manage roles'
			where not exists (select 1 from "rbac_permission" where "key" = 'roles:manage');
		`)

		this.addSql(`
			insert into "rbac_role_permission" ("id", "role_id", "permission_id")
			select 'rp_owner_staff_manage', 'role_owner', 'perm_staff_manage'
			where not exists (
				select 1 from "rbac_role_permission"
				where "id" = 'rp_owner_staff_manage'
			);
		`)
		this.addSql(`
			insert into "rbac_role_permission" ("id", "role_id", "permission_id")
			select 'rp_owner_roles_manage', 'role_owner', 'perm_roles_manage'
			where not exists (
				select 1 from "rbac_role_permission"
				where "id" = 'rp_owner_roles_manage'
			);
		`)
		this.addSql(`
			insert into "rbac_role_permission" ("id", "role_id", "permission_id")
			select 'rp_admin_staff_manage', 'role_admin', 'perm_staff_manage'
			where not exists (
				select 1 from "rbac_role_permission"
				where "id" = 'rp_admin_staff_manage'
			);
		`)
		this.addSql(`
			insert into "rbac_role_permission" ("id", "role_id", "permission_id")
			select 'rp_admin_roles_manage', 'role_admin', 'perm_roles_manage'
			where not exists (
				select 1 from "rbac_role_permission"
				where "id" = 'rp_admin_roles_manage'
			);
		`)
	}

	override async down(): Promise<void> {
		this.addSql(`drop table if exists "rbac_actor_role" cascade;`)
		this.addSql(`drop table if exists "rbac_role_permission" cascade;`)
		this.addSql(`drop table if exists "rbac_permission" cascade;`)
		this.addSql(`drop table if exists "rbac_role" cascade;`)
	}
}

