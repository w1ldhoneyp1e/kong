import {type ProductTagType} from '../ProductCard'
import {ProductFavoriteButton} from './ProductFavoriteButton'
import {ProductImageLink} from './ProductImageLink'
import {ProductTags} from './ProductTags'
import {cn} from '@/shared'

type ProductImageAreaProps = {
	url: string,
	image?: string,
	title?: string,
	tags?: ProductTagType[],
	available: boolean,
	isGrid: boolean,
	isFavorite: boolean,
	onLinkClick: (e: React.MouseEvent<HTMLAnchorElement>) => void,
	onFavoriteClick: (e: React.MouseEvent<HTMLButtonElement>) => void,
}

function ProductImageArea({
	url,
	image,
	title,
	tags,
	available,
	isGrid,
	isFavorite,
	onLinkClick,
	onFavoriteClick,
}: ProductImageAreaProps) {
	return (
		<div
			className={cn(
				'relative overflow-hidden bg-muted/30 shrink-0',
				isGrid
					? 'aspect-4/5 w-full'
					: 'w-40 md:w-64 border-r border-border',
			)}
		>
			<ProductImageLink
				url={url}
				image={image}
				title={title}
				onLinkClick={onLinkClick}
			/>
			<ProductTags tags={tags} />
			<ProductFavoriteButton
				isFavorite={isFavorite}
				onFavoriteClick={onFavoriteClick}
			/>
			{available && (
				<div className="absolute inset-0 flex items-center justify-center bg-background/40 backdrop-blur-[2px] pointer-events-none">
					<span className="rounded-md bg-background px-3 py-1 text-sm font-semibold shadow-sm">
						{'Нет в наличии'}
					</span>
				</div>
			)}
		</div>
	)
}

export {
	ProductImageArea,
}
