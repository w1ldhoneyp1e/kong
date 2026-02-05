import {type MedusaRequest, type MedusaResponse} from '@medusajs/framework'
import {Modules} from '@medusajs/framework/utils'

const GET = async (req: MedusaRequest, res: MedusaResponse): Promise<void> => {
	const cartService = req.scope.resolve(Modules.CART)
	const data = await cartService.listCarts({}, {take: 100})
	res.json({carts: data})
}

const POST = async (req: MedusaRequest, res: MedusaResponse): Promise<void> => {
	const cartService = req.scope.resolve(Modules.CART)
	const body = req.body as Record<string, unknown> | Record<string, unknown>[]
	const data = Array.isArray(body)
		? body
		: [body]
	const created = await cartService.createCarts(data as never)
	res.status(201).json(created.length === 1
		? {cart: created[0]}
		: {carts: created})
}

export {GET, POST}
