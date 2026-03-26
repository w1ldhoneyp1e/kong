import {Module} from '@medusajs/framework/utils'
import StaffModuleService from './service'

const STAFF_MODULE = 'staff'

export {STAFF_MODULE}

export default Module(STAFF_MODULE, {
	service: StaffModuleService,
})

