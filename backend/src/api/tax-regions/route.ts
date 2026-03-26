import {type MedusaRequest, type MedusaResponse} from '@medusajs/framework'
import {Modules} from '@medusajs/framework/utils'
import {requirePermission} from '../_shared/staffAuth'

export const GET = async (req: MedusaRequest, res: MedusaResponse): Promise<void> => {
	const actor = requirePermission(req, res, 'geo:manage')
	if (!actor) {
		return
	}

	const taxService = req.scope.resolve(Modules.TAX)
	const data = await taxService.listTaxRegions({}, {take: 100})
	res.json({tax_regions: data})
}
