import {type MedusaRequest, type MedusaResponse} from '@medusajs/framework'
import {Modules} from '@medusajs/framework/utils'

export const GET = async (req: MedusaRequest, res: MedusaResponse): Promise<void> => {
	const {id} = req.params
	const productService = req.scope.resolve(Modules.PRODUCT)
	const product = await productService.retrieveProduct(id).catch(() => null)
	if (!product) {
		res.status(404).json({error: 'Product not found'})
		return
	}
	res.json({product})
}
