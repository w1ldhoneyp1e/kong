import {type MedusaRequest, type MedusaResponse} from '@medusajs/framework'
import {Modules} from '@medusajs/framework/utils'
import {attachProductsToDefaultSalesChannel} from '../../_shared/productSalesChannel'
import {requirePermission} from '../../_shared/staffAuth'
import {
	retrieveAdminProduct,
	splitProductPayload,
	syncSalesVariants,
} from '../salesVariant'

const GET = async (req: MedusaRequest, res: MedusaResponse): Promise<void> => {
	const actor = await requirePermission(req, res, 'catalog:manage')
	if (!actor) {
		return
	}

	const {id} = req.params
	const product = await retrieveAdminProduct(req, id)
	if (!product) {
		res.status(404).json({error: 'Product not found'})
		return
	}
	res.json({product})
}

const PUT = async (req: MedusaRequest, res: MedusaResponse): Promise<void> => {
	const actor = await requirePermission(req, res, 'catalog:manage')
	if (!actor) {
		return
	}

	const {id} = req.params
	const productService = req.scope.resolve(Modules.PRODUCT)
	const body = req.body as Record<string, unknown>
	const {productPayload, salesVariants} = splitProductPayload(body)
	await productService.updateProducts(id, productPayload as never)
	await syncSalesVariants(req, id, salesVariants)
	await attachProductsToDefaultSalesChannel(req, [id])
	const product = await retrieveAdminProduct(req, id)
	res.json({product})
}

const DELETE = async (req: MedusaRequest, res: MedusaResponse): Promise<void> => {
	const actor = await requirePermission(req, res, 'catalog:manage')
	if (!actor) {
		return
	}

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
