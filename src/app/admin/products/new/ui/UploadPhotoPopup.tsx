import {
	Button,
	FormField,
	Input,
	Modal,
} from '../../../../../shared'
import {useProductCreateVm} from '../viewmodel'

function ProductCreateMediaModal() {
	const {media} = useProductCreateVm()

	return (
		<Modal
			open={media.isOpen}
			onOpenChange={media.onOpenChange}
			disabled={media.disabled}
			className="max-w-2xl"
			ariaLabelledBy="create-product-media-modal-title"
		>
			<div className="mb-4 flex items-center justify-between gap-2">
				<h3
					id="create-product-media-modal-title"
					className="text-lg font-semibold"
				>
					{'Фото товара'}
				</h3>
				<Button
					type="button"
					variant="outline"
					size="sm"
					disabled={media.disabled}
					onClick={() => {
						media.onOpenChange(false)
					}}
				>
					{'Закрыть'}
				</Button>
			</div>
			<div className="space-y-4">
				<FormField
					label="Thumbnail URL"
					htmlFor="create-product-thumbnail-url"
				>
					<Input
						id="create-product-thumbnail-url"
						value={media.thumbnailUrl}
						onChange={event => {
							media.onThumbnailChange(event.target.value)
						}}
						disabled={media.disabled}
					/>
				</FormField>
				<div className="grid gap-2 sm:grid-cols-[1fr_auto]">
					<FormField
						label="URL изображения для галереи"
						htmlFor="create-product-image-draft"
					>
						<Input
							id="create-product-image-draft"
							value={media.imageDraft}
							onChange={event => {
								media.onImageDraftChange(event.target.value)
							}}
							disabled={media.disabled}
						/>
					</FormField>
					<div className="flex items-end">
						<Button
							type="button"
							variant="outline"
							disabled={media.disabled || media.imageDraft.trim().length === 0}
							onClick={media.onAddImage}
						>
							{'Добавить'}
						</Button>
					</div>
				</div>
				<div className="space-y-2">
					<p className="text-sm font-medium text-muted-foreground">
						{'Галерея'}
					</p>
					{media.galleryImages.length > 0
						? (
							<ul className="space-y-2">
								{media.galleryImages.map((url, index) => (
									<li
										key={url}
										className="flex items-center justify-between gap-2 rounded border p-2"
									>
										<span className="truncate text-sm">
											{url}
										</span>
										<Button
											type="button"
											variant="outline"
											size="sm"
											disabled={media.disabled}
											onClick={() => {
												media.onRemoveImage(index)
											}}
										>
											{'Удалить'}
										</Button>
									</li>
								))}
							</ul>
						)
						: (
							<p className="text-sm text-muted-foreground">
								{'Изображения не добавлены'}
							</p>
						)}
				</div>
			</div>
		</Modal>
	)
}

export {ProductCreateMediaModal}
