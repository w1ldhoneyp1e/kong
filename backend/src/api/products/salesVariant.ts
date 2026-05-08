import {type MedusaRequest} from '@medusajs/framework'
import {refetchEntity} from '@medusajs/framework/http'
import {Modules} from '@medusajs/framework/utils'
import {
	createProductVariantsWorkflow,
	updateProductVariantsWorkflow,
} from '@medusajs/medusa/core-flows'

const DEFAULT_OPTION_TITLE = 'Default option'
const DEFAULT_OPTION_VALUE = 'Default option value'

const ADMIN_PRODUCT_FIELDS = [
	'id',
	'title',
	'subtitle',
	'status',
	'external_id',
	'description',
	'handle',
	'is_giftcard',
	'discountable',
	'thumbnail',
	'collection_id',
	'type_id',
	'weight',
	'length',
	'height',
	'width',
	'hs_code',
	'origin_country',
	'mid_code',
	'material',
	'created_at',
	'updated_at',
	'deleted_at',
	'metadata',
	'*type',
	'*collection',
	'*options',
	'*options.values',
	'*tags',
	'*images',
	'*variants',
	'*variants.prices',
	'variants.prices.price_rules.value',
	'variants.prices.price_rules.attribute',
	'*variants.options',
	'*sales_channels',
]

type ProductService = {
	createProductOptions: (data: unknown) => Promise<unknown>,
	retrieveProduct: (id: string, config?: unknown) => Promise<unknown>,
}

type PriceInput = {
	amount?: unknown,
	currency_code?: unknown,
}

type SalesVariantInput = {
	id?: unknown,
	title?: unknown,
	sku?: unknown,
	metadata?: unknown,
	prices?: unknown,
}

type SplitProductPayload = {
	productPayload: Record<string, unknown>,
	salesVariants: SalesVariantInput[],
}

function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function toStringValue(value: unknown): string | undefined {
	return typeof value === 'string' && value.trim().length > 0
		? value.trim()
		: undefined
}

function toPriceInputs(value: unknown): PriceInput[] {
	return Array.isArray(value)
		? value.filter(isRecord)
		: []
}

function normalizePrices(value: unknown): Array<{amount: number, currency_code: string}> {
	return toPriceInputs(value)
		.map(price => {
			const amount = typeof price.amount === 'number'
				? price.amount
				: Number(price.amount)
			const currencyCode = toStringValue(price.currency_code)?.toLowerCase()

			return Number.isFinite(amount) && currencyCode
				? {
					amount,
					currency_code: currencyCode,
				}
				: null
		})
		.filter((price): price is {amount: number, currency_code: string} => price !== null)
}

function normalizeMetadata(value: unknown): Record<string, unknown> {
	return isRecord(value)
		? {...value}
		: {}
}

function splitProductPayload(body: Record<string, unknown>): SplitProductPayload {
	const {variants, ...productPayload} = body
	const salesVariants = Array.isArray(variants)
		? variants.filter(isRecord)
		: []

	return {
		productPayload,
		salesVariants,
	}
}

function normalizeSalesVariant(productId: string, variant: SalesVariantInput): Record<string, unknown> {
	const metadata = normalizeMetadata(variant.metadata)

	return {
		...(toStringValue(variant.id) ? {id: toStringValue(variant.id)} : {}),
		product_id: productId,
		title: toStringValue(variant.title) ?? 'Основной',
		sku: toStringValue(variant.sku),
		manage_inventory: false,
		allow_backorder: false,
		options: {
			[DEFAULT_OPTION_TITLE]: DEFAULT_OPTION_VALUE,
		},
		prices: normalizePrices(variant.prices),
		metadata: {
			...metadata,
			available: metadata.available !== false,
		},
	}
}

async function ensureDefaultOption(req: MedusaRequest, productId: string): Promise<void> {
	const productService = req.scope.resolve(Modules.PRODUCT) as ProductService
	const product = await productService.retrieveProduct(productId, {
		relations: ['options'],
	}).catch(() => null) as {options?: Array<{title?: string}>} | null

	if (product?.options?.some(option => option.title === DEFAULT_OPTION_TITLE)) {
		return
	}

	await productService.createProductOptions({
		product_id: productId,
		title: DEFAULT_OPTION_TITLE,
		values: [DEFAULT_OPTION_VALUE],
	})
}

async function syncSalesVariants(
	req: MedusaRequest,
	productId: string,
	salesVariants: SalesVariantInput[],
): Promise<void> {
	if (salesVariants.length === 0) {
		return
	}

	await ensureDefaultOption(req, productId)

	const normalized = salesVariants.map(variant => normalizeSalesVariant(productId, variant))
	const variantsToCreate = normalized.filter(variant => typeof variant.id !== 'string')
	const variantsToUpdate = normalized.filter(variant => typeof variant.id === 'string')

	if (variantsToCreate.length > 0) {
		await createProductVariantsWorkflow(req.scope).run({
			input: {
				product_variants: variantsToCreate as never,
			},
		})
	}

	if (variantsToUpdate.length > 0) {
		await updateProductVariantsWorkflow(req.scope).run({
			input: {
				product_variants: variantsToUpdate as never,
			},
		})
	}
}

function remapVariantPrices(product: Record<string, unknown>): Record<string, unknown> {
	const variants = Array.isArray(product.variants)
		? product.variants.map(variant => {
			if (!isRecord(variant)) {
				return variant
			}

			const priceSet = isRecord(variant.price_set)
				? variant.price_set
				: null

			return {
				...variant,
				prices: Array.isArray(priceSet?.prices)
					? priceSet.prices
					: [],
				price_set: undefined,
			}
		})
		: product.variants

	return {
		...product,
		variants,
	}
}

async function retrieveAdminProduct(req: MedusaRequest, id: string): Promise<Record<string, unknown> | null> {
	const graphProduct = await refetchEntity({
		entity: 'product',
		idOrFilter: {id},
		scope: req.scope,
		fields: ADMIN_PRODUCT_FIELDS,
	}).catch(() => null)

	if (graphProduct) {
		return remapVariantPrices(graphProduct)
	}

	const productService = req.scope.resolve(Modules.PRODUCT) as ProductService
	const product = await productService.retrieveProduct(id, {
		relations: ['variants', 'variants.options', 'options', 'images', 'tags', 'categories'],
	}).catch(() => null)

	return isRecord(product)
		? product
		: null
}

export {
	retrieveAdminProduct,
	splitProductPayload,
	syncSalesVariants,
}
