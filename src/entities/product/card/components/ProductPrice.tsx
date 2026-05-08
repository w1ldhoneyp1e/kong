import {cn} from '@/shared'

function getPriceText(value: number) {
	return `${value} ₽`
}

type ProductPriceProps = {
	price?: number,
	originalPrice?: number,
}

function ProductPrice({
	price,
	originalPrice,
}: ProductPriceProps) {
	return (
		<div className="flex flex-col gap-0.5">
			{originalPrice
				? (
					<span className="text-xs font-medium text-muted-foreground line-through opacity-70">
						{getPriceText(originalPrice)}
					</span>
				)
				: null}
			{price
				? (
					<span className={cn('text-lg font-bold', originalPrice && 'text-destructive')}>
						{getPriceText(price)}
					</span>
				)
				: null}
		</div>
	)
}

export {
	ProductPrice,
}
