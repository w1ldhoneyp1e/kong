import {type MedusaRequest, type MedusaResponse} from '@medusajs/framework'
import {Modules} from '@medusajs/framework/utils'
import {requirePermission} from '../_shared/staffAuth'

const GET = async (req: MedusaRequest, res: MedusaResponse): Promise<void> => {
	const actor = await requirePermission(req, res, 'catalog:manage')
	if (!actor) {
		return
	}

	const productService = req.scope.resolve(Modules.PRODUCT) as {
		listProductTags?: (filters?: Record<string, unknown>, config?: Record<string, unknown>) => Promise<unknown[]>,
	}
	const tags = await productService.listProductTags?.({}, {take: 200}) ?? []

	res.json({tags})
}

export {GET}
