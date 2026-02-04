import {type MedusaRequest, type MedusaResponse} from '@medusajs/framework'
import {Modules} from '@medusajs/framework/utils'

export const GET = async (req: MedusaRequest, res: MedusaResponse): Promise<void> => {
	const productService = req.scope.resolve(Modules.PRODUCT)
	const data = await productService.listProducts({}, {take: 50})
	res.json({products: data})
}

export const POST = async (req: MedusaRequest, res: MedusaResponse): Promise<void> => {
	const productService = req.scope.resolve(Modules.PRODUCT)
	const body = req.body as Record<string, unknown> | Record<string, unknown>[]
	const data = Array.isArray(body) ? body : [body]
	const created = await productService.createProducts(data as never)
	res.status(201).json(created.length === 1 ? {product: created[0]} : {products: created})
}
