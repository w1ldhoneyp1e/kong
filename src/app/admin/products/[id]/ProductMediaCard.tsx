'use client'

import {type AdminProduct} from '../../../../entities/product'
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from '../../../../shared'

function ProductMediaCard({product}: Readonly<{product: AdminProduct}>) {
	return (
		<Card>
			<CardHeader>
				<CardTitle>
					{'Медиа'}
				</CardTitle>
			</CardHeader>
			<CardContent>
				{product.thumbnail
					? (
						<div className="mb-4">
							<p className="mb-2 text-xs font-medium text-muted-foreground">
								{'Thumbnail'}
							</p>
							<img
								src={product.thumbnail}
								alt=""
								className="max-h-48 rounded-md border object-contain"
							/>
						</div>
					)
					: null}
				{product.images && product.images.length > 0
					? (
						<div className="flex flex-wrap gap-2">
							{product.images.map(img => (
								img.url
									? (
										<img
											key={img.id}
											src={img.url}
											alt=""
											className="h-20 w-20 rounded object-cover"
										/>
									)
									: null
							))}
						</div>
					)
					: (
						<p className="text-sm text-muted-foreground">
							{'Нет изображений'}
						</p>
					)}
			</CardContent>
		</Card>
	)
}

export {ProductMediaCard}
