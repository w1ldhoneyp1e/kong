import {type MedusaRequest, type MedusaResponse} from '@medusajs/framework'
import {Modules} from '@medusajs/framework/utils'

export const GET = async (req: MedusaRequest, res: MedusaResponse): Promise<void> => {
	const {id} = req.params
	const taxService = req.scope.resolve(Modules.TAX)
	const taxRate = await taxService.retrieveTaxRate(id).catch(() => null)
	if (!taxRate) {
		res.status(404).json({error: 'Tax rate not found'})
		return
	}
	res.json({tax_rate: taxRate})
}
