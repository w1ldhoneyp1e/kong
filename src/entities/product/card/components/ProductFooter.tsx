import {ProductPrice} from './ProductPrice'
import {ProductRating} from './ProductRating'

type ProductFooterProps = {
	price?: number,
	originalPrice?: number,
	rating?: number,
	reviews?: number,
}

function ProductFooter({
	price,
	originalPrice,
	rating,
	reviews,
}: ProductFooterProps) {
	return (
		<div className="flex flex-wrap items-end justify-between gap-3">
			<ProductPrice
				price={price}
				originalPrice={originalPrice}
			/>
			<ProductRating
				rating={rating}
				reviews={reviews}
			/>
		</div>
	)
}

export {
	ProductFooter,
}
