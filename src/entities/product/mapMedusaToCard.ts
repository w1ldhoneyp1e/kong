import {type MedusaProduct} from './api'
import {type ProductCardProps} from './ProductCard'

function mapMedusaProductToCardProps(product: MedusaProduct): Partial<ProductCardProps> {
	const firstAvailableVariant = product.variants?.find(variant => variant.metadata?.available !== false)
	const displayVariant = firstAvailableVariant ?? product.variants?.[0]
	const amount = displayVariant?.prices?.[0]?.amount

	return {
		url: product.handle
			? `/product/${product.handle}`
			: '',
		title: product.title ?? undefined,
		description: product.description ?? undefined,
		image: product.thumbnail ?? undefined,
		price: amount !== undefined && amount !== null
			? amount / 100
			: undefined,
		currency: {
			symbol: '₽',
			position: 'suffix',
		},
		tags: product.tags?.map(t => ({
			label: t.value,
			theme: 'popular' as const,
		})),
		available: Boolean(firstAvailableVariant && amount !== undefined && amount !== null),
		view: 'grid',
	}
}

export {mapMedusaProductToCardProps}
