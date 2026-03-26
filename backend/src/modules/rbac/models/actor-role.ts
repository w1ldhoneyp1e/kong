import {model} from '@medusajs/framework/utils'
import {Role} from './role'

const ActorRole = model
	.define('rbac_actor_role', {
		id: model.id().primaryKey(),

		actor_type: model.text(),
		actor_id: model.text(),

		role: model.belongsTo(() => Role, {mappedBy: 'actor_roles'}),
	})

export {ActorRole}

