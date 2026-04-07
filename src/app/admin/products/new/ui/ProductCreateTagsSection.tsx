import {FormField} from '../../../../../shared'

function ProductCreateTagsSection({
	disabled,
	selectedTagIds,
	tagOptions,
	onToggleTag,
}: Readonly<{
	disabled: boolean,
	selectedTagIds: string[],
	tagOptions: {
		id: string,
		value?: string | null,
	}[],
	onToggleTag: (id: string) => void,
}>) {
	return (
		<section className="space-y-4">
			<h3 className="text-sm font-medium text-muted-foreground">
				{'Теги'}
			</h3>
			<FormField
				label="Выберите теги"
				htmlFor="create-product-tags"
			>
				<div
					id="create-product-tags"
					className="grid gap-2 rounded-md border p-2 sm:grid-cols-2"
				>
					{tagOptions.length > 0
						? tagOptions.map(tag => (
							<label
								key={tag.id}
								className="flex items-center gap-2 text-sm"
							>
								<input
									type="checkbox"
									checked={selectedTagIds.includes(tag.id)}
									onChange={() => {
										onToggleTag(tag.id)
									}}
									disabled={disabled}
								/>
								<span>
									{tag.value ?? tag.id}
								</span>
							</label>
						))
						: (
							<p className="text-sm text-muted-foreground">
								{'Теги не найдены'}
							</p>
						)}
				</div>
			</FormField>
		</section>
	)
}

export {ProductCreateTagsSection}
