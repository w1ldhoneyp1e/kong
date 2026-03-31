import {FormField, Input} from '../../../../../shared'

function ProductCreateTagsSection({
	disabled,
	tagIdsText,
	onTagIdsTextChange,
}: Readonly<{
	disabled: boolean,
	tagIdsText: string,
	onTagIdsTextChange: (value: string) => void,
}>) {
	return (
		<section className="space-y-4">
			<h3 className="text-sm font-medium text-muted-foreground">
				{'Теги'}
			</h3>
			<FormField
				label="ID тегов (через запятую)"
				htmlFor="create-product-tag-ids"
			>
				<Input
					id="create-product-tag-ids"
					value={tagIdsText}
					onChange={event => {
						onTagIdsTextChange(event.target.value)
					}}
					disabled={disabled}
				/>
			</FormField>
		</section>
	)
}

export {ProductCreateTagsSection}
