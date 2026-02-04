import {type MedusaRequest, type MedusaResponse} from '@medusajs/framework'
import {Modules} from '@medusajs/framework/utils'

export const GET = async (req: MedusaRequest, res: MedusaResponse): Promise<void> => {
	const {id} = req.params
	const customerService = req.scope.resolve(Modules.CUSTOMER)
	const customer = await customerService.retrieveCustomer(id).catch(() => null)
	if (!customer) {
		res.status(404).json({error: 'Customer not found'})
		return
	}
	res.json({customer})
}
