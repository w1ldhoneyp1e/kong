import {type MedusaRequest, type MedusaResponse} from '@medusajs/framework'
import {Modules} from '@medusajs/framework/utils'
import {attachProductsToDefaultSalesChannel} from '../_shared/productSalesChannel'
import {requirePermission} from '../_shared/staffAuth'

const GET = async (req: MedusaRequest, res: MedusaResponse): Promise<void> => {
	const actor = await requirePermission(req, res, 'catalog:manage')
	if (!actor) {
		return
	}

	const productService = req.scope.resolve(Modules.PRODUCT)
	const data = await productService.listProducts({}, {
		take: 50,
		relations: ['variants', 'options', 'images', 'tags', 'categories'],
	})
	res.json({products: data})
}

const POST = async (req: MedusaRequest, res: MedusaResponse): Promise<void> => {
	const actor = await requirePermission(req, res, 'catalog:manage')
	if (!actor) {
		return
	}

	const productService = req.scope.resolve(Modules.PRODUCT)
	const body = req.body as Record<string, unknown> | Record<string, unknown>[]
	const data = Array.isArray(body)
		? body
		: [body]
	const created = await productService.createProducts(data as never)
	await attachProductsToDefaultSalesChannel(
		req,
		created
			.map((product: {id?: string}) => product.id)
			.filter((id: string | undefined): id is string => typeof id === 'string'),
	)
	res.status(201).json(created.length === 1
		? {product: created[0]}
		: {products: created})
}

export {GET, POST}
