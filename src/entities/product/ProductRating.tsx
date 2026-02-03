import {Star} from 'lucide-react'
import {cn} from '../../shared'

type ProductRatingProps = {
	rating: number,
	maxRating?: number,
	reviews?: number,
	reviewComponent?: React.ComponentType<{reviews: number}>,
	className?: string,
	classNameStar?: string,
}

function ProductRating({
	rating,
	maxRating = 4,
	reviews,
	reviewComponent: reviewComponentCmp,
	className,
	classNameStar = 'w-3 h-3',
}: ProductRatingProps) {
	const ReviewCmp = reviewComponentCmp
	const ratingParsed = Math.min(Math.max(Math.round(rating), 0), maxRating)

	const stars = []
	for (let i = 0; i < maxRating; i++) {
		const filled = i < ratingParsed
		stars.push(
			<li key={i}>
				<Star
					className={cn(classNameStar, filled
						? 'fill-current'
						: '')}
				/>
			</li>,
		)
	}

	return (
		<div className={cn('flex gap-1.5 items-center', className)}>
			<ul className="flex gap-px">{stars}</ul>
			{reviews
			&& (ReviewCmp
				? (
					<ReviewCmp reviews={reviews} />
				)
				: (
					<span className="tag-bold">{'('}{reviews}{')'}</span>
				))}
		</div>
	)
}

export {ProductRating}
export type {ProductRatingProps}
