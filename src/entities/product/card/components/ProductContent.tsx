import {ProductDescription} from './ProductDescription'
import {ProductFooter} from './ProductFooter'
import {ProductMeta} from './ProductMeta'
import {ProductTitle} from './ProductTitle'
import {cn, Link} from '@/shared'

type ProductContentProps = {
	url: string,
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
	isGrid: boolean,
	onLinkClick: (e: MouseEvent<HTMLAnchorElement>) => void,
}

function ProductContent({
	url,
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
	isGrid,
	onLinkClick,
}: ProductContentProps) {
	return (
		<Link
			href={url}
			onClick={onLinkClick}
			className={cn(
				'flex flex-1 flex-col p-4',
				!isGrid && 'justify-center py-6',
			)}
		>
			<ProductMeta
				label={label}
				labelHighlighting={labelHighlighting}
				colors={colors}
			/>
			<ProductTitle
				title={title}
				titleHighlighting={titleHighlighting}
			/>
			<ProductDescription
				description={description}
				descriptionSnippeting={descriptionSnippeting}
				isGrid={isGrid}
			/>
			<div className="mt-auto pt-4" />
			<ProductFooter
				price={price}
				originalPrice={originalPrice}
				rating={rating}
				reviews={reviews}
			/>
		</Link>
	)
}

export {
	ProductContent,
}
