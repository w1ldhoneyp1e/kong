'use client'

import {type AdminProduct} from '../../../../entities/product'
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from '../../../../shared'

function ProductOptionsCard({product}: Readonly<{product: AdminProduct}>) {
	return (
		<Card className="lg:col-span-2">
			<CardHeader>
				<CardTitle>
					{'Опции'}
				</CardTitle>
			</CardHeader>
			<CardContent>
				{product.options && product.options.length > 0
					? (
						<ul className="space-y-2 text-sm">
							{product.options.map(option => (
								<li key={option.id}>
									<span className="font-medium">
										{option.title ?? option.id}
										{': '}
									</span>
									{(option.values ?? [])
										.map(val => val.value)
										.filter(Boolean)
										.join(', ') || '—'}
								</li>
							))}
						</ul>
					)
					: (
						<p className="text-sm text-muted-foreground">
							{'Нет опций'}
						</p>
					)}
			</CardContent>
		</Card>
	)
}

export {ProductOptionsCard}
