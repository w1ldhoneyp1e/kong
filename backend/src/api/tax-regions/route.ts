import {type MedusaRequest, type MedusaResponse} from '@medusajs/framework'
import {Modules} from '@medusajs/framework/utils'

export const GET = async (req: MedusaRequest, res: MedusaResponse): Promise<void> => {
	const taxService = req.scope.resolve(Modules.TAX)
	const {data} = await taxService.listTaxRegions({}, {take: 100})
	res.json({tax_regions: data})
}
