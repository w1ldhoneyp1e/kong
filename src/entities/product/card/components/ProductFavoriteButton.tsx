import {Heart} from 'lucide-react'
import {Button, cn} from '@/shared'

type ProductFavoriteButtonProps = {
	isFavorite: boolean,
	onFavoriteClick: (e: MouseEvent<HTMLButtonElement>) => void,
}

function ProductFavoriteButton({
	isFavorite,
	onFavoriteClick,
}: ProductFavoriteButtonProps) {
	return (
		<Button
			type="button"
			variant="ghost"
			size="icon-sm"
			onClick={onFavoriteClick}
			className={cn(
				'absolute right-3 top-3 z-10 rounded-full bg-background/60 backdrop-blur-md transition-colors hover:bg-background',
				isFavorite
					? 'text-destructive hover:text-destructive'
					: 'text-foreground hover:text-primary',
			)}
			aria-label={isFavorite
				? 'Убрать из избранного'
				: 'Добавить в избранное'}
		>
			<Heart
				className={cn(
					'size-4 transition-transform active:scale-95',
					isFavorite && 'fill-current',
				)}
			/>
		</Button>
	)
}

export {
	ProductFavoriteButton,
}
