import {type MedusaRequest, type MedusaResponse} from '@medusajs/framework'
import {Modules} from '@medusajs/framework/utils'

export const GET = async (req: MedusaRequest, res: MedusaResponse): Promise<void> => {
	const {id} = req.params
	const orderService = req.scope.resolve(Modules.ORDER)
	const order = await orderService.retrieveOrder(id).catch(() => null)
	if (!order) {
		res.status(404).json({error: 'Order not found'})
		return
	}
	res.json({order})
}

export const PUT = async (req: MedusaRequest, res: MedusaResponse): Promise<void> => {
	const {id} = req.params
	const orderService = req.scope.resolve(Modules.ORDER)
	const body = req.body as Record<string, unknown>
	const [updated] = await orderService.updateOrders([{
		id,
		...body,
	}] as never)
	res.json({order: updated})
}

export const DELETE = async (req: MedusaRequest, res: MedusaResponse): Promise<void> => {
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
