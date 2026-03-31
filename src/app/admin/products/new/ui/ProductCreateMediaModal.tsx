import {
	Button,
	FormField,
	Input,
} from '../../../../../shared'

function ProductCreateMediaModal({
	open,
	disabled,
	thumbnail,
	imageDraft,
	images,
	onOpenChange,
	onThumbnailChange,
	onImageDraftChange,
	onAddImage,
	onRemoveImage,
}: Readonly<{
	open: boolean,
	disabled: boolean,
	thumbnail: string,
	imageDraft: string,
	images: string[],
	onOpenChange: (open: boolean) => void,
	onThumbnailChange: (value: string) => void,
	onImageDraftChange: (value: string) => void,
	onAddImage: () => void,
	onRemoveImage: (index: number) => void,
}>) {
	if (!open) {
		return null
	}

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center p-4">
			<button
				type="button"
				className="absolute inset-0 bg-black/50"
				aria-label="Закрыть"
				onClick={() => {
					if (!disabled) {
						onOpenChange(false)
					}
				}}
			/>
			<div className="relative z-10 w-full max-w-2xl rounded-lg border border-border bg-background p-6 shadow-lg">
				<div className="mb-4 flex items-center justify-between gap-2">
					<h3 className="text-lg font-semibold">
						{'Фото товара'}
					</h3>
					<Button
						type="button"
						variant="outline"
						size="sm"
						disabled={disabled}
						onClick={() => {
							onOpenChange(false)
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
							value={thumbnail}
							onChange={event => {
								onThumbnailChange(event.target.value)
							}}
							disabled={disabled}
						/>
					</FormField>
					<div className="grid gap-2 sm:grid-cols-[1fr_auto]">
						<FormField
							label="URL изображения для галереи"
							htmlFor="create-product-image-draft"
						>
							<Input
								id="create-product-image-draft"
								value={imageDraft}
								onChange={event => {
									onImageDraftChange(event.target.value)
								}}
								disabled={disabled}
							/>
						</FormField>
						<div className="flex items-end">
							<Button
								type="button"
								variant="outline"
								disabled={disabled || imageDraft.trim().length === 0}
								onClick={onAddImage}
							>
								{'Добавить'}
							</Button>
						</div>
					</div>
					<div className="space-y-2">
						<p className="text-sm font-medium text-muted-foreground">
							{'Галерея'}
						</p>
						{images.length > 0
							? (
								<ul className="space-y-2">
									{images.map((url, index) => (
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
												disabled={disabled}
												onClick={() => {
													onRemoveImage(index)
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
			</div>
		</div>
	)
}

export {ProductCreateMediaModal}
