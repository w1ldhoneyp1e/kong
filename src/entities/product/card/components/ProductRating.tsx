import {Star} from 'lucide-react'

type ProductRatingProps = {
	rating?: number,
	reviews?: number,
}

function ProductRating({
	rating,
	reviews,
}: ProductRatingProps) {
	if (typeof rating === 'undefined') {
		return null
	}

	return (
		<div className="flex items-center gap-1.5 rounded-full bg-muted/50 px-2 py-1 text-sm font-medium">
			<Star className="size-3.5 fill-amber-500 text-amber-500" />
			<span>{rating}</span>
			{reviews
				? (
					<span className="text-xs font-normal text-muted-foreground">
						{'('}{reviews}{')'}
					</span>
				)
				: null}
		</div>
	)
}

export {
	ProductRating,
}
