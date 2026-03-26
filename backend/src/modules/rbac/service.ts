import {MedusaService} from '@medusajs/framework/utils'
import {ActorRole} from './models/actor-role'
import {Permission} from './models/permission'
import {Role} from './models/role'
import {RolePermission} from './models/role-permission'

class RbacModuleService extends MedusaService({
	Role,
	Permission,
	RolePermission,
	ActorRole,
}) {}

export {RbacModuleService}

export default RbacModuleService

