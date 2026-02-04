import {type MedusaRequest, type MedusaResponse} from '@medusajs/framework'
import {Modules} from '@medusajs/framework/utils'

export const GET = async (req: MedusaRequest, res: MedusaResponse): Promise<void> => {
	const {id} = req.params
	const cartService = req.scope.resolve(Modules.CART)
	const cart = await cartService.retrieveCart(id).catch(() => null)
	if (!cart) {
		res.status(404).json({error: 'Cart not found'})
		return
	}
	res.json({cart})
}
