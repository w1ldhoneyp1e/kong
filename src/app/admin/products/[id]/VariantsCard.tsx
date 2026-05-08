'use client'

import {type AdminProduct} from '../../../../entities/product'
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	StatusBadge,
} from '../../../../shared'

function formatVariantPrice(variant: NonNullable<AdminProduct['variants']>[number]): string {
	const amount = variant.prices?.[0]?.amount
	const currency = variant.prices?.[0]?.currency_code ?? 'rub'
	if (typeof amount !== 'number') {
		return '—'
	}

	return new Intl.NumberFormat('ru-RU', {
		style: 'currency',
		currency: currency.toUpperCase(),
	}).format(amount / 100)
}

function ProductVariantsCard({product}: Readonly<{product: AdminProduct}>) {
	return (
		<Card className="lg:col-span-2">
			<CardHeader>
				<CardTitle>
					{'Варианты'}
				</CardTitle>
			</CardHeader>
			<CardContent>
				{product.variants && product.variants.length > 0
					? (
						<div className="overflow-x-auto rounded-md border">
							<table className="w-full text-sm">
								<thead className="bg-muted/50">
									<tr>
										<th className="px-3 py-2 text-left font-medium">
											{'Название'}
										</th>
										<th className="px-3 py-2 text-left font-medium">
											{'SKU'}
										</th>
										<th className="px-3 py-2 text-left font-medium">
											{'Цена'}
										</th>
										<th className="px-3 py-2 text-left font-medium">
											{'Доступность'}
										</th>
										<th className="px-3 py-2 text-left font-medium">
											{'ID'}
										</th>
									</tr>
								</thead>
								<tbody>
									{product.variants.map(variant => (
										<tr
											key={variant.id}
											className="border-t"
										>
											<td className="px-3 py-2">
												{variant.title ?? '—'}
											</td>
											<td className="px-3 py-2">
												{variant.sku ?? '—'}
											</td>
											<td className="px-3 py-2">
												{formatVariantPrice(variant)}
											</td>
											<td className="px-3 py-2">
												<StatusBadge
													status={variant.metadata?.available === false
														? 'inactive'
														: 'active'}
													label={variant.metadata?.available === false
														? 'Недоступен'
														: 'Доступен'}
												/>
											</td>
											<td className="px-3 py-2 font-mono text-xs text-muted-foreground">
												{variant.id}
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					)
					: (
						<p className="text-sm text-muted-foreground">
							{'Нет вариантов'}
						</p>
					)}
			</CardContent>
		</Card>
	)
}

export {ProductVariantsCard}
