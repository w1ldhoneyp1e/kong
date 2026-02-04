import {MedusaService} from '@medusajs/framework/utils'
import Category from './models/category'

class CategoryModuleService extends MedusaService({
	Category,
}) {}

export default CategoryModuleService
