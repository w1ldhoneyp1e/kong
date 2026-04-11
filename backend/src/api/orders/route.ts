import {type MedusaRequest, type MedusaResponse} from '@medusajs/framework'
import {Modules} from '@medusajs/framework/utils'
import {requirePermission} from '../_shared/staffAuth'

const GET = async (req: MedusaRequest, res: MedusaResponse): Promise<void> => {
	const actor = await requirePermission(req, res, 'orders:manage')
	if (!actor) {
		return
	}

	const orderService = req.scope.resolve(Modules.ORDER)
	const q = typeof req.query['q'] === 'string'
		? req.query['q']
		: undefined
	const status = typeof req.query['status'] === 'string'
		? req.query['status']
		: undefined
	const customerId = typeof req.query['customer_id'] === 'string'
		? req.query['customer_id']
		: undefined
	const limitRaw = req.query['limit']
	const offsetRaw = req.query['offset']

	const limit = Math.min(
		Math.max(1, parseInt(String(limitRaw ?? '50'), 10) || 50),
		100,
	)
	const offset = Math.max(0, parseInt(String(offsetRaw ?? '0'), 10) || 0)

	const filters: Record<string, unknown> = {}

	if (status) {
		filters.status = status
	}

	if (customerId) {
		filters.customer_id = customerId
	}

	if (q?.trim()) {
		const qTrim = q.trim()
		const qNum = Number(qTrim)

		if (!Number.isNaN(qNum) && String(qNum) === qTrim) {
			filters.display_id = qNum
		}
		else {
			filters.email = {$ilike: `%${qTrim}%`}
		}
	}

	const [orders, count] = await orderService.listAndCountOrders(
		filters as never,
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
