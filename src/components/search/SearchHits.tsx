'use client'

import {type MedusaProduct} from '../../lib/api/products'
import {ProductCard} from '../product/ProductCard'

type SearchHitsProps = {
	products: MedusaProduct[],
}

function SearchHits({products}: SearchHitsProps) {
	if (products.length === 0) {
		return (
			<div className="text-center py-12">
				<p className="text-gray-600">{'Ничего не найдено. Попробуйте изменить запрос.'}</p>
			</div>
		)
	}

	return (
		<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
			{products.map(product => {
				const amount = product.variants?.[0]?.prices?.[0]?.amount
				return (
					<ProductCard
						key={product.id}
						url={product.handle
							? `/product/${product.handle}`
							: ''}
						title={product.title ?? undefined}
						description={product.description ?? undefined}
						image={product.thumbnail ?? undefined}
						price={amount !== undefined && amount !== null
							? amount / 100
							: undefined}
						currency={{
							symbol: '₽',
							position: 'suffix',
						}}
						tags={product.tags?.map(t => ({
							label: t.value,
							theme: 'popular' as const,
						}))}
						available={true}
						view="grid"
					/>
				)
			})}
		</div>
	)
}

export {SearchHits}
