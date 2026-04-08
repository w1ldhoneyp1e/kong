import {FormField, Input} from '../../../../../shared'
import {useProductCreateVm} from '../viewmodel'

function ProductCreateSpecsSection() {
	const {specs} = useProductCreateVm()

	return (
		<section className="space-y-4">
			<h3 className="text-sm font-medium text-muted-foreground">
				{'Характеристики'}
			</h3>
			<div className="grid gap-4 sm:grid-cols-2">
				<FormField
					label="Материал"
					htmlFor="create-product-material"
				>
					<Input
						id="create-product-material"
						value={specs.material}
						onChange={event => {
							specs.onMaterialChange(event.target.value)
						}}
						disabled={specs.disabled}
					/>
				</FormField>
				<FormField
					label="Вес"
					htmlFor="create-product-weight"
				>
					<Input
						id="create-product-weight"
						type="number"
						step="any"
						value={specs.weight}
						onChange={event => {
							specs.onWeightChange(event.target.value)
						}}
						disabled={specs.disabled}
					/>
				</FormField>
			</div>
			<div className="grid gap-4 sm:grid-cols-3 xl:grid-cols-4">
				<FormField
					label="Длина"
					htmlFor="create-product-length"
				>
					<Input
						id="create-product-length"
						type="number"
						step="any"
						value={specs.length}
						onChange={event => {
							specs.onLengthChange(event.target.value)
						}}
						disabled={specs.disabled}
					/>
				</FormField>
				<FormField
					label="Ширина"
					htmlFor="create-product-width"
				>
					<Input
						id="create-product-width"
						type="number"
						step="any"
						value={specs.width}
						onChange={event => {
							specs.onWidthChange(event.target.value)
						}}
						disabled={specs.disabled}
					/>
				</FormField>
				<FormField
					label="Высота"
					htmlFor="create-product-height"
				>
					<Input
						id="create-product-height"
						type="number"
						step="any"
						value={specs.height}
						onChange={event => {
							specs.onHeightChange(event.target.value)
						}}
						disabled={specs.disabled}
					/>
				</FormField>
				<div className="hidden xl:block" />
			</div>
		</section>
	)
}

export {ProductCreateSpecsSection}
