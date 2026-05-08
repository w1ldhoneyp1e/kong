import {Link} from '@/shared'

type ProductImageLinkProps = {
	url: string,
	image?: string,
	title?: string,
	onLinkClick: (e: React.MouseEvent<HTMLAnchorElement>) => void,
}

function ProductImageLink({
	url,
	image,
	title,
	onLinkClick,
}: ProductImageLinkProps) {
	return (
		<Link
			href={url}
			onClick={onLinkClick}
			className="block w-full h-full"
		>
			{image
				? (
					<img
						src={image}
						alt={title || 'Фото товара'}
						className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
					/>
				)
				: (
					<div className="flex h-full w-full items-center justify-center bg-secondary/50 text-sm font-medium text-muted-foreground">
						{'Нет фото'}
					</div>
				)}
		</Link>
	)
}

export {
	ProductImageLink,
}
