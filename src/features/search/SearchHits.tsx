'use client'

import {
	type StoreProduct,
	mapStoreProductToCardProps,
	ProductCard,
} from '../../entities/product'

type SearchHitsProps = {
	products: StoreProduct[],
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
			{products.map(product => (
				<ProductCard
					key={product.id}
					{...mapStoreProductToCardProps(product)}
				/>
			))}
		</div>
	)
}

export {SearchHits}
