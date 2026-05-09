'use client'

import {
	type MouseEvent,
	useCallback,
	useState,
} from 'react'
import {cn} from '../../../shared'
import {ProductContent} from './components/ProductContent'
import {ProductImageArea} from './components/ProductImageArea'

type ProductTagType = {
	label: string,
	theme?: string,
	color?: string,
}

type ProductPriceCurrency = 'RUB' | 'USD' | 'EUR' | string

type ViewMode = 'grid' | 'list'

type ProductCardProps = {
	url?: string,
	image?: string,
	tags?: ProductTagType[],
	label?: string,
	labelHighlighting?: React.ComponentType,
	title?: string,
	titleHighlighting?: React.ComponentType,
	description?: string,
	descriptionSnippeting?: React.ComponentType,
	colors?: string[],
	price?: number,
	originalPrice?: number,
	rating?: number,
	reviews?: number,
	available?: boolean,
	view?: ViewMode,
	onLinkClick?: (e: MouseEvent<HTMLAnchorElement>) => void,
}

function ProductCard({
	url = '#',
	image,
	tags,
	label,
	labelHighlighting,
	title,
	titleHighlighting,
	description,
	descriptionSnippeting,
	colors,
	price,
	originalPrice,
	rating,
	reviews,
	available = true,
	view = 'grid',
	onLinkClick,
}: ProductCardProps) {
	const [isFavorite, setIsFavorite] = useState(false)

	const handleFavoriteClick = useCallback((e: MouseEvent<HTMLButtonElement>) => {
		e.preventDefault()
		setIsFavorite(prev => !prev)
	}, [])

	const handleLinkClick = useCallback(
		(e: MouseEvent<HTMLAnchorElement>) => {
			if (typeof onLinkClick === 'function') {
				onLinkClick(e)
			}
		},
		[onLinkClick],
	)

	const isGrid = view === 'grid'

	return (
		<article
			className={cn(
				'group relative flex w-full overflow-hidden rounded-xl border border-border bg-card text-card-foreground shadow-sm transition-all duration-300 hover:shadow-md',
				isGrid
					? 'flex-col'
					: 'flex-row h-full max-h-70',
				!available && 'opacity-60 grayscale-30',
			)}
		>
			<ProductImageArea
				url={url}
				image={image}
				title={title}
				tags={tags}
				available={available}
				isGrid={isGrid}
				isFavorite={isFavorite}
				onLinkClick={handleLinkClick}
				onFavoriteClick={handleFavoriteClick}
			/>
			<ProductContent
				url={url}
				label={label}
				labelHighlighting={labelHighlighting}
				title={title}
				titleHighlighting={titleHighlighting}
				description={description}
				descriptionSnippeting={descriptionSnippeting}
				colors={colors}
				price={price}
				originalPrice={originalPrice}
				rating={rating}
				reviews={reviews}
				isGrid={isGrid}
				onLinkClick={handleLinkClick}
			/>
		</article>
	)
}

export type {
	ProductTagType,
	ProductPriceCurrency,
	ViewMode,
	ProductCardProps,
}

export {
	ProductCard,
}
