import {type MedusaRequest, type MedusaResponse} from '@medusajs/framework'
import {Modules} from '@medusajs/framework/utils'
import {requirePermission} from '../../_shared/staffAuth'

const GET = async (req: MedusaRequest, res: MedusaResponse): Promise<void> => {
	const actor = await requirePermission(req, res, 'carts:manage')
	if (!actor) {
		return
	}

	const {id} = req.params
	const cartService = req.scope.resolve(Modules.CART)
	const cart = await cartService.retrieveCart(id).catch(() => null)
	if (!cart) {
		res.status(404).json({error: 'Cart not found'})
		return
	}
	res.json({cart})
}

const PUT = async (req: MedusaRequest, res: MedusaResponse): Promise<void> => {
	const actor = await requirePermission(req, res, 'carts:manage')
	if (!actor) {
		return
	}

	const {id} = req.params
	const cartService = req.scope.resolve(Modules.CART)
	const body = req.body as Record<string, unknown>
	const [updated] = await cartService.updateCarts([{
		id,
		...body,
	}] as never)
	res.json({cart: updated})
}

const DELETE = async (req: MedusaRequest, res: MedusaResponse): Promise<void> => {
	const actor = await requirePermission(req, res, 'carts:manage')
	if (!actor) {
		return
	}

	const {id} = req.params
	const cartService = req.scope.resolve(Modules.CART)
	const existing = await cartService.retrieveCart(id).catch(() => null)
	if (!existing) {
		res.status(404).json({error: 'Cart not found'})
		return
	}
	await cartService.deleteCarts([id])
	res.status(204).send()
}

export {
	DELETE, GET, PUT,
}
