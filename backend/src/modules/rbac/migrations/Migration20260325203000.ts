import {Migration} from '@medusajs/framework/mikro-orm/migrations'

export class Migration20260325203000 extends Migration {
	override async up(): Promise<void> {
		const permissions = [
			['catalog:manage', 'Manage catalog'],
			['customers:manage', 'Manage customers'],
			['orders:manage', 'Manage orders'],
			['store:update', 'Update store'],
			['inventory:manage', 'Manage inventory'],
			['pricing:manage', 'Manage pricing'],
			['geo:manage', 'Manage geography'],
			['carts:manage', 'Manage carts'],
		] as const

		for (const [key, name] of permissions) {
			this.addSql(`
				insert into "rbac_permission" ("id", "key", "name")
				select 'perm_${key.replace(/[^a-zA-Z0-9]+/g, '_')}', '${key}', '${name}'
				where not exists (select 1 from "rbac_permission" where "key" = '${key}');
			`)
		}

		const roleIds = {
			owner: 'role_owner',
			admin: 'role_admin',
			manager: 'role_manager',
		}

		const mkPermId = (permKey: string) => `perm_${permKey.replace(/[^a-zA-Z0-9]+/g, '_')}`

		for (const [permKey] of permissions) {
			const permId = mkPermId(permKey)

			this.addSql(`
				insert into "rbac_role_permission" ("id", "role_id", "permission_id")
				select 'rp_owner_${permKey.replace(/[^a-zA-Z0-9]+/g, '_')}', '${roleIds.owner}', '${permId}'
				where not exists (
					select 1 from "rbac_role_permission"
					where "id" = 'rp_owner_${permKey.replace(/[^a-zA-Z0-9]+/g, '_')}'
				);
			`)

			this.addSql(`
				insert into "rbac_role_permission" ("id", "role_id", "permission_id")
				select 'rp_admin_${permKey.replace(/[^a-zA-Z0-9]+/g, '_')}', '${roleIds.admin}', '${permId}'
				where not exists (
					select 1 from "rbac_role_permission"
					where "id" = 'rp_admin_${permKey.replace(/[^a-zA-Z0-9]+/g, '_')}'
				);
			`)

			this.addSql(`
				insert into "rbac_role_permission" ("id", "role_id", "permission_id")
				select 'rp_manager_${permKey.replace(/[^a-zA-Z0-9]+/g, '_')}', '${roleIds.manager}', '${permId}'
				where not exists (
					select 1 from "rbac_role_permission"
					where "id" = 'rp_manager_${permKey.replace(/[^a-zA-Z0-9]+/g, '_')}'
				);
			`)
		}
	}

	override async down(): Promise<void> {
		const permissionKeys = [
			'catalog:manage',
			'customers:manage',
			'orders:manage',
			'store:update',
			'inventory:manage',
			'pricing:manage',
			'geo:manage',
			'carts:manage',
		]

		for (const key of permissionKeys) {
			const permId = `perm_${key.replace(/[^a-zA-Z0-9]+/g, '_')}`
			this.addSql(`delete from "rbac_role_permission" where "permission_id" = '${permId}';`)
			this.addSql(`delete from "rbac_permission" where "id" = '${permId}';`)
		}
	}
}

