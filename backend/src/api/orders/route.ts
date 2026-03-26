import {type MedusaRequest, type MedusaResponse} from '@medusajs/framework'
import {Modules} from '@medusajs/framework/utils'
import {requirePermission} from '../_shared/staffAuth'

export const GET = async (req: MedusaRequest, res: MedusaResponse): Promise<void> => {
	const actor = requirePermission(req, res, 'orders:manage')
	if (!actor) {
		return
	}

	const orderService = req.scope.resolve(Modules.ORDER)
	const data = await orderService.listOrders({}, {take: 100})
	res.json({orders: data})
}
