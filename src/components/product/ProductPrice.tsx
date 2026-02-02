import {cn} from '../../lib/utils'

type ProductPriceCurrency = {
	symbol: string,
	position: 'prefix' | 'suffix',
}

type ProductPriceProps = {
	price: number,
	originalPrice?: number,
	currency?: ProductPriceCurrency,
	precision?: number,
	className?: string,
	classNamePrice?: string,
	classNameOriginalPrice?: string,
}

function ProductPrice({
	price,
	originalPrice,
	currency,
	precision = 2,
	className = 'items-baseline gap-2 italic',
	classNamePrice,
	classNameOriginalPrice,
}: ProductPriceProps) {
	return (
		<div className={cn('flex', className)}>
			<span
				className={cn('font-bold', classNamePrice)}
				style={{color: 'var(--color-venus-base)'}}
			>
				{currency?.position === 'prefix'
					? currency.symbol
					: null}
				{price.toFixed(precision).toLocaleString()}
				{currency?.position === 'suffix'
					? currency.symbol
					: null}
			</span>
			{originalPrice && (
				<span
					className={cn('text-xs line-through', classNameOriginalPrice)}
					style={{color: 'var(--color-neutral-dark)'}}
				>
					{currency?.position === 'prefix'
						? currency.symbol
						: null}
					{originalPrice.toFixed(precision).toLocaleString()}
					{currency?.position === 'suffix'
						? currency.symbol
						: null}
				</span>
			)}
		</div>
	)
}

export {ProductPrice}
export type {ProductPriceProps, ProductPriceCurrency}
