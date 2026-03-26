import {Module} from '@medusajs/framework/utils'
import RbacModuleService from './service'

const RBAC_MODULE = 'rbac'

export {RBAC_MODULE}

export default Module(RBAC_MODULE, {
	service: RbacModuleService,
})

