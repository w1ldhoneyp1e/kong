import {type MedusaRequest, type MedusaResponse} from '@medusajs/framework'
import {Modules} from '@medusajs/framework/utils'
import {attachProductsToDefaultSalesChannel} from '../_shared/productSalesChannel'
import {requirePermission} from '../_shared/staffAuth'
import {
	retrieveAdminProduct,
	splitProductPayload,
	syncSalesVariants,
} from './salesVariant'

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
	const entries = Array.isArray(body)
		? body
		: [body]
	const data = entries.map(entry => splitProductPayload(entry))
	const created = await productService.createProducts(data.map(entry => entry.productPayload) as never)

	await Promise.all(created.map(async (product: {id?: string}, index: number) => {
		if (typeof product.id !== 'string') {
			return
		}

		await syncSalesVariants(req, product.id, data[index]?.salesVariants ?? [])
	}))
	await attachProductsToDefaultSalesChannel(
		req,
		created
			.map((product: {id?: string}) => product.id)
			.filter((id: string | undefined): id is string => typeof id === 'string'),
	)
	const products = await Promise.all(created.map(async (product: {id?: string}) => {
		if (typeof product.id !== 'string') {
			return product
		}

		return await retrieveAdminProduct(req, product.id) ?? product
	}))
	res.status(201).json(created.length === 1
		? {product: products[0]}
		: {products})
}

export {GET, POST}
