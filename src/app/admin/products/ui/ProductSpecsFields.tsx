import {FormField, Input} from '../../../../shared'

type ProductSpecsStringField = {
	value: string,
	onChange: (value: string) => void,
}

type ProductSpecsFieldsProps = {
	idPrefix: string,
	disabled: boolean,
	materialAndWeight: {
		material: ProductSpecsStringField,
		weight: ProductSpecsStringField,
	},
	dimensions: {
		length: ProductSpecsStringField,
		width: ProductSpecsStringField,
		height: ProductSpecsStringField,
	},
}

function ProductSpecsFields({
	idPrefix,
	disabled,
	materialAndWeight,
	dimensions,
}: ProductSpecsFieldsProps) {
	const {material, weight} = materialAndWeight
	const {
		length, width, height,
	} = dimensions

	return (
		<div className="space-y-4">
			<div className="grid gap-4 sm:grid-cols-2">
				<FormField
					label="Материал"
					htmlFor={`${idPrefix}-material`}
				>
					<Input
						id={`${idPrefix}-material`}
						value={material.value}
						onChange={event => {
							material.onChange(event.target.value)
						}}
						disabled={disabled}
					/>
				</FormField>
				<FormField
					label="Вес"
					htmlFor={`${idPrefix}-weight`}
				>
					<Input
						id={`${idPrefix}-weight`}
						type="number"
						step="any"
						value={weight.value}
						onChange={event => {
							weight.onChange(event.target.value)
						}}
						disabled={disabled}
					/>
				</FormField>
			</div>
			<div>
				<p className="text-muted-foreground mb-3 text-xs">
					{'Габариты (см), необязательно'}
				</p>
				<div className="grid gap-4 sm:grid-cols-3 xl:grid-cols-4">
					<FormField
						label="Длина"
						htmlFor={`${idPrefix}-length`}
					>
						<Input
							id={`${idPrefix}-length`}
							type="number"
							step="any"
							value={length.value}
							onChange={event => {
								length.onChange(event.target.value)
							}}
							disabled={disabled}
						/>
					</FormField>
					<FormField
						label="Ширина"
						htmlFor={`${idPrefix}-width`}
					>
						<Input
							id={`${idPrefix}-width`}
							type="number"
							step="any"
							value={width.value}
							onChange={event => {
								width.onChange(event.target.value)
							}}
							disabled={disabled}
						/>
					</FormField>
					<FormField
						label="Высота"
						htmlFor={`${idPrefix}-height`}
					>
						<Input
							id={`${idPrefix}-height`}
							type="number"
							step="any"
							value={height.value}
							onChange={event => {
								height.onChange(event.target.value)
							}}
							disabled={disabled}
						/>
					</FormField>
					<div className="hidden xl:block" />
				</div>
			</div>
		</div>
	)
}

export {ProductSpecsFields}
export type {ProductSpecsFieldsProps, ProductSpecsStringField}
