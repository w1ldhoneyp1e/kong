import {type MedusaRequest, type MedusaResponse} from '@medusajs/framework'
import {Modules} from '@medusajs/framework/utils'

export const GET = async (req: MedusaRequest, res: MedusaResponse): Promise<void> => {
	const {id} = req.params
	const taxService = req.scope.resolve(Modules.TAX)
	const taxRegion = await taxService.retrieveTaxRegion(id).catch(() => null)
	if (!taxRegion) {
		res.status(404).json({error: 'Tax region not found'})
		return
	}
	res.json({tax_region: taxRegion})
}
