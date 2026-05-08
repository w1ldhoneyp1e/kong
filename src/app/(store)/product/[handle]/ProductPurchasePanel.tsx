'use client'

import {useMemo, useState} from 'react'
import {type MedusaProduct} from '../../../../entities/product'
import {AddToCartButton} from '../../../../features/cart'
import {Button, cn} from '../../../../shared'

type StorefrontVariant = NonNullable<MedusaProduct['variants']>[number]

function variantIsAvailable(variant: StorefrontVariant): boolean {
	return variant.metadata?.available !== false
}

function variantPriceAmount(variant: StorefrontVariant): number | null {
	const amount = variant.prices?.[0]?.amount

	return typeof amount === 'number'
		? amount
		: null
}

function formatPrice(amount: number | null): string {
	if (amount === null) {
		return 'Цена не указана'
	}

	return new Intl.NumberFormat('ru-RU', {
		style: 'currency',
		currency: 'RUB',
	}).format(amount / 100)
}

function ProductPurchasePanel({
	variants = [],
}: Readonly<{
	variants?: MedusaProduct['variants'],
}>) {
	const firstAvailableId = useMemo(
		() => variants.find(variantIsAvailable)?.id ?? variants[0]?.id ?? null,
		[variants],
	)
	const [selectedVariantId, setSelectedVariantId] = useState<string | null>(firstAvailableId)

	const selectedVariant = variants.find(variant => variant.id === selectedVariantId) ?? variants[0] ?? null
	const selectedAvailable = selectedVariant
		? variantIsAvailable(selectedVariant)
		: false
	const selectedPrice = selectedVariant
		? variantPriceAmount(selectedVariant)
		: null
	const canAddToCart = selectedVariant && selectedAvailable && selectedPrice !== null

	if (variants.length === 0) {
		return (
			<div className="space-y-3">
				<p className="text-2xl font-semibold">
					{'Нет доступных вариантов'}
				</p>
				<AddToCartButton variantId={null} />
			</div>
		)
	}

	return (
		<div className="space-y-5">
			<div className="space-y-2">
				<div className="text-3xl font-bold">
					{formatPrice(selectedPrice)}
				</div>
				{selectedVariant?.sku
					? (
						<p className="text-sm text-muted-foreground">
							{`SKU: ${selectedVariant.sku}`}
						</p>
					)
					: null}
			</div>
			{variants.length > 1
				? (
					<div className="space-y-2">
						<p className="text-sm font-medium">
							{'Вариант'}
						</p>
						<div className="flex flex-wrap gap-2">
							{variants.map(variant => {
								const available = variantIsAvailable(variant)
								const selected = variant.id === selectedVariant?.id

								return (
									<Button
										key={variant.id}
										type="button"
										variant={selected
											? 'default'
											: 'outline'}
										className={cn(
											'min-h-10',
											!available && 'opacity-50',
										)}
										onClick={() => {
											setSelectedVariantId(variant.id)
										}}
									>
										{variant.title ?? 'Вариант'}
									</Button>
								)
							})}
						</div>
					</div>
				)
				: null}
			{!selectedAvailable
				? (
					<p className="text-sm text-muted-foreground">
						{'Выбранный вариант сейчас недоступен для заказа.'}
					</p>
				)
				: null}
			{selectedAvailable && selectedPrice === null
				? (
					<p className="text-sm text-muted-foreground">
						{'Для выбранного варианта не указана цена.'}
					</p>
				)
				: null}
			<AddToCartButton variantId={canAddToCart
				? selectedVariant.id
				: null}
			/>
		</div>
	)
}

export {ProductPurchasePanel}
