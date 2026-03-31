import {FormField, Input} from '../../../../../shared'

function ProductCreateSpecsSection({
	disabled,
	material,
	weight,
	length,
	width,
	height,
	onMaterialChange,
	onWeightChange,
	onLengthChange,
	onWidthChange,
	onHeightChange,
}: Readonly<{
	disabled: boolean,
	material: string,
	weight: string,
	length: string,
	width: string,
	height: string,
	onMaterialChange: (value: string) => void,
	onWeightChange: (value: string) => void,
	onLengthChange: (value: string) => void,
	onWidthChange: (value: string) => void,
	onHeightChange: (value: string) => void,
}>) {
	return (
		<section className="space-y-4">
			<h3 className="text-sm font-medium text-muted-foreground">
				{'Характеристики'}
			</h3>
			<p className="text-xs text-muted-foreground">
				{'Материал, вес и габариты не обязательны на этапе создания.'}
			</p>
			<FormField
				label="Материал"
				htmlFor="create-product-material"
			>
				<Input
					id="create-product-material"
					value={material}
					onChange={event => {
						onMaterialChange(event.target.value)
					}}
					disabled={disabled}
				/>
			</FormField>
			<div className="grid gap-4 sm:grid-cols-2">
				<FormField
					label="Вес"
					htmlFor="create-product-weight"
				>
					<Input
						id="create-product-weight"
						type="number"
						step="any"
						value={weight}
						onChange={event => {
							onWeightChange(event.target.value)
						}}
						disabled={disabled}
					/>
				</FormField>
				<div />
			</div>
			<div className="grid gap-4 sm:grid-cols-3">
				<FormField
					label="Длина"
					htmlFor="create-product-length"
				>
					<Input
						id="create-product-length"
						type="number"
						step="any"
						value={length}
						onChange={event => {
							onLengthChange(event.target.value)
						}}
						disabled={disabled}
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
						value={width}
						onChange={event => {
							onWidthChange(event.target.value)
						}}
						disabled={disabled}
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
						value={height}
						onChange={event => {
							onHeightChange(event.target.value)
						}}
						disabled={disabled}
					/>
				</FormField>
			</div>
		</section>
	)
}

export {ProductCreateSpecsSection}
