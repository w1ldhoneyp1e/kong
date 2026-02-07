import {type MedusaRequest, type MedusaResponse} from '@medusajs/framework'
import {Modules} from '@medusajs/framework/utils'

const GET = async (req: MedusaRequest, res: MedusaResponse): Promise<void> => {
	const {id} = req.params
	const productService = req.scope.resolve(Modules.PRODUCT)
	const product = await productService.retrieveProduct(id).catch(() => null)
	if (!product) {
		res.status(404).json({error: 'Product not found'})
		return
	}
	res.json({product})
}

const PUT = async (req: MedusaRequest, res: MedusaResponse): Promise<void> => {
	const {id} = req.params
	const productService = req.scope.resolve(Modules.PRODUCT)
	const body = req.body as Record<string, unknown>
	const updated = await productService.updateProducts(id, body as never)
	res.json({product: updated})
}

const DELETE = async (req: MedusaRequest, res: MedusaResponse): Promise<void> => {
	const {id} = req.params
	const productService = req.scope.resolve(Modules.PRODUCT)
	const existing = await productService.retrieveProduct(id).catch(() => null)
	if (!existing) {
		res.status(404).json({error: 'Product not found'})
		return
	}
	await productService.deleteProducts([id])
	res.status(204).send()
}

export {
	DELETE, GET, PUT,
}
