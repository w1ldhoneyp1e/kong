import {model} from '@medusajs/framework/utils'
import {Permission} from './permission'
import {Role} from './role'

const RolePermission = model
	.define('rbac_role_permission', {
		id: model.id().primaryKey(),

		role: model.belongsTo(() => Role, {mappedBy: 'role_permissions'}),
		permission: model.belongsTo(() => Permission, {mappedBy: 'role_permissions'}),
	})

export {RolePermission}

