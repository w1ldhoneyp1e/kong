import {MedusaService} from '@medusajs/framework/utils'
import StaffUser from './models/staff-user'

class StaffModuleService extends MedusaService({
	StaffUser,
}) {}

export {StaffModuleService}

export default StaffModuleService

