import {type MedusaRequest, type MedusaResponse} from '@medusajs/framework'
import {Modules} from '@medusajs/framework/utils'
import {requirePermission} from '../../_shared/staffAuth'

const GET = async (req: MedusaRequest, res: MedusaResponse): Promise<void> => {
	const actor = await requirePermission(req, res, 'orders:manage')
	if (!actor) {
		return
	}

	const {id} = req.params
	const orderService = req.scope.resolve(Modules.ORDER)
	const order = await orderService.retrieveOrder(id, {
		relations: [
			'items',
			'summary',
			'shipping_methods',
			'transactions',
			'shipping_address',
			'billing_address',
		],
	}).catch(() => null)
	if (!order) {
		res.status(404).json({error: 'Order not found'})
		return
	}
	res.json({order})
}

const PUT = async (req: MedusaRequest, res: MedusaResponse): Promise<void> => {
	const actor = await requirePermission(req, res, 'orders:manage')
	if (!actor) {
		return
	}

	const {id} = req.params
	const orderService = req.scope.resolve(Modules.ORDER)
	const body = req.body as Record<string, unknown>
	const [updated] = await orderService.updateOrders([{
		id,
		...body,
	}] as never)
	res.json({order: updated})
}

const DELETE = async (req: MedusaRequest, res: MedusaResponse): Promise<void> => {
	const actor = await requirePermission(req, res, 'orders:manage')
	if (!actor) {
		return
	}

	const {id} = req.params
	const orderService = req.scope.resolve(Modules.ORDER)
	const existing = await orderService.retrieveOrder(id).catch(() => null)
	if (!existing) {
		res.status(404).json({error: 'Order not found'})
		return
	}
	await orderService.deleteOrders([id])
	res.status(204).send()
}
