import {type MedusaRequest, type MedusaResponse} from '@medusajs/framework'
import {Modules} from '@medusajs/framework/utils'

export const GET = async (req: MedusaRequest, res: MedusaResponse): Promise<void> => {
	const customerService = req.scope.resolve(Modules.CUSTOMER)
	const data = await customerService.listCustomers({}, {take: 100})
	res.json({customers: data})
}
