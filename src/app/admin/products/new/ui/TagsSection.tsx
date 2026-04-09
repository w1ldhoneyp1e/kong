import {FormField} from '../../../../../shared'
import {type ProductCreateVm} from '../viewmodel'

type TagsSectionProps = {
	tags: ProductCreateVm['tags'],
}

function TagsSection({
	tags,
}: TagsSectionProps) {
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
					{tags.tagOptions.length > 0
						? tags.tagOptions.map(tag => (
							<label
								key={tag.id}
								className="flex items-center gap-2 text-sm"
							>
								<input
									type="checkbox"
									checked={tags.selectedTagIds.includes(tag.id)}
									onChange={() => {
										tags.onToggleTag(tag.id)
									}}
									disabled={tags.disabled}
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

export {TagsSection}
