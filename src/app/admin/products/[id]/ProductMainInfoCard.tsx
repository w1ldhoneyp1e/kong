'use client'

import {type AdminProduct} from '../../../../entities/product'
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from '../../../../shared'

function ProductMainInfoCard({product}: Readonly<{product: AdminProduct}>) {
	return (
		<Card>
			<CardHeader>
				<CardTitle>
					{'Основная информация'}
				</CardTitle>
			</CardHeader>
			<CardContent className="space-y-2 text-sm">
				<p>
					<span className="font-medium text-muted-foreground">
						{'Handle: '}
					</span>
					{product.handle ?? '—'}
				</p>
				{product.subtitle
					? (
						<p>
							<span className="font-medium text-muted-foreground">
								{'Подзаголовок: '}
							</span>
							{product.subtitle}
						</p>
					)
					: null}
				{product.description
					? (
						<p className="whitespace-pre-wrap">
							<span className="font-medium text-muted-foreground">
								{'Описание: '}
							</span>
							{product.description}
						</p>
					)
					: null}
			</CardContent>
		</Card>
	)
}

export {ProductMainInfoCard}
