import {type MedusaRequest, type MedusaResponse} from '@medusajs/framework'
import {Modules} from '@medusajs/framework/utils'
import {requirePermission} from '../../../_shared/staffAuth'

const GET = async (req: MedusaRequest, res: MedusaResponse): Promise<void> => {
	const actor = await requirePermission(req, res, 'customers:manage')
	if (!actor) {
		return
	}

	const {id} = req.params
	const orderService = req.scope.resolve(Modules.ORDER)
	const limitRaw = req.query['limit']
	const offsetRaw = req.query['offset']

	const limit = Math.min(
		Math.max(1, parseInt(String(limitRaw ?? '50'), 10) || 50),
		100,
	)
	const offset = Math.max(0, parseInt(String(offsetRaw ?? '0'), 10) || 0)

	const [orders, count] = await orderService.listAndCountOrders(
		{customer_id: id} as never,
		{
			take: limit,
			skip: offset,
			relations: ['items', 'summary'],
			order: {created_at: 'DESC'},
		},
	)

	res.json({
		orders,
		count,
	})
}

export {GET}
