import {model} from '@medusajs/framework/utils'
import {RolePermission} from './role-permission'

const Permission = model
	.define('rbac_permission', {
		id: model.id().primaryKey(),
		key: model.text(),
		name: model.text(),

		role_permissions: model.hasMany(() => RolePermission, {mappedBy: 'permission'}),
	})

export {Permission}

