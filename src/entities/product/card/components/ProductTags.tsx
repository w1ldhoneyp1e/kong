import {type ProductTagType} from '../ProductCard'
import {Badge} from '@/shared'

type ProductTagsProps = {
	tags?: ProductTagType[],
}

function ProductTags({tags}: ProductTagsProps) {
	if (!tags || tags.length === 0) {
		return null
	}

	return (
		<div className="absolute left-3 top-3 z-10 flex flex-col items-start gap-1.5 pointer-events-none">
			{tags.map(tag => (
				<Badge
					key={tag.label}
					variant={(tag.theme as any) || 'default'}
					className="uppercase text-[10px] tracking-wider px-2 py-0.5 shadow-sm backdrop-blur-md"
					style={tag.color
						? {
							backgroundColor: tag.color,
							color: '#ffffff',
						}
						: undefined}
				>
					{tag.label}
				</Badge>
			))}
		</div>
	)
}

export {
	ProductTags,
}
