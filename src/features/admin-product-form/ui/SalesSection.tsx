import {FormField, Input} from '../../../shared'
import {type AdminProductFormViewmodel} from '../viewmodel'

type SalesSectionProps = {
	sales: AdminProductFormViewmodel['sales'],
}

function SalesSection({
	sales,
}: SalesSectionProps) {
	return (
		<section className="space-y-4">
			<h3 className="text-sm font-medium text-muted-foreground">
				{'Продажи'}
			</h3>
			<div className="grid gap-4 sm:grid-cols-2">
				<FormField
					label="Название варианта"
					htmlFor="create-product-variant-title"
				>
					<Input
						id="create-product-variant-title"
						value={sales.variantTitle}
						onChange={event => {
							sales.onVariantTitleChange(event.target.value)
						}}
						placeholder="Основной"
						disabled={sales.disabled}
					/>
				</FormField>
				<FormField
					label="SKU"
					htmlFor="create-product-variant-sku"
				>
					<Input
						id="create-product-variant-sku"
						value={sales.variantSku}
						onChange={event => {
							sales.onVariantSkuChange(event.target.value)
						}}
						disabled={sales.disabled}
					/>
				</FormField>
				<FormField
					label="Цена, ₽"
					htmlFor="create-product-variant-price"
				>
					<Input
						id="create-product-variant-price"
						type="number"
						inputMode="decimal"
						min="0"
						step="0.01"
						value={sales.variantPrice}
						onChange={event => {
							sales.onVariantPriceChange(event.target.value)
						}}
						disabled={sales.disabled}
					/>
				</FormField>
				<FormField
					label="Доступность"
					htmlFor="create-product-variant-available"
				>
					<div className="flex h-9 items-center gap-2">
						<input
							id="create-product-variant-available"
							type="checkbox"
							checked={sales.variantAvailable}
							onChange={event => {
								sales.onVariantAvailableChange(event.target.checked)
							}}
							disabled={sales.disabled}
						/>
						<span className="text-sm">
							{'Можно добавить в корзину'}
						</span>
					</div>
				</FormField>
			</div>
		</section>
	)
}

export {SalesSection}
