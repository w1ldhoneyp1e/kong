'use client'

import {type AdminProduct} from '../../../../entities/product'
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from '../../../../shared'

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
