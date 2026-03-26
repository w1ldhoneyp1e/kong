import {model} from '@medusajs/framework/utils'
import {ActorRole} from './actor-role'
import {RolePermission} from './role-permission'

const Role = model
	.define('rbac_role', {
		id: model.id().primaryKey(),
		code: model.text(),
		name: model.text(),

		role_permissions: model.hasMany(() => RolePermission, {mappedBy: 'role'}),
		actor_roles: model.hasMany(() => ActorRole, {mappedBy: 'role'}),
	})

export {Role}

