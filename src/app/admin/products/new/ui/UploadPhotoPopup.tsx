'use client'

import {useRef} from 'react'
import {
	Button,
	cn,
	FormField,
	Input,
	Modal,
} from '../../../../../shared'
import {uploadProductImageFiles} from '../lib/uploadProductImageFiles'
import {useProductCreateVm} from '../viewmodel'

function UploadPhotoPopup() {
	const {media} = useProductCreateVm()
	const fileInputRef = useRef<HTMLInputElement>(null)

	async function ingestFiles(files: FileList | File[] | null) {
		if (!files?.length) {
			return
		}

		const list = Array.from(files).filter(file => file.type.startsWith('image/'))

		if (list.length === 0) {
			return
		}

		media.onUploadErrorChange(null)

		try {
			const urls = await uploadProductImageFiles(list)

			if (urls.length === 0) {
				return
			}

			media.onAddGalleryUrls(urls)
		}
		catch (error) {
			media.onUploadErrorChange(error instanceof Error
				? error.message
				: 'Ошибка загрузки')
		}
	}

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
			<div className="space-y-6">
				<p className="text-xs text-muted-foreground">
					{'Первое фото в списке ниже — основное в карточке товара.'}
				</p>
				<div className="space-y-3">
					<p className="text-sm font-medium text-muted-foreground">
						{'Галерея'}
					</p>
					<div
						className={cn(
							'flex min-h-[9rem] flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed px-4 py-6 text-center transition-colors',
							media.dropzoneActive
								? 'border-primary bg-primary/5'
								: 'border-muted-foreground/25 bg-muted/10',
							media.disabled
								? 'pointer-events-none opacity-50'
								: '',
						)}
						onDragEnter={event => {
							event.preventDefault()
							media.onDropzoneEnter()
						}}
						onDragLeave={event => {
							event.preventDefault()
							media.onDropzoneLeave()
						}}
						onDragOver={event => {
							event.preventDefault()
							event.dataTransfer.dropEffect = 'copy'
						}}
						onDrop={async event => {
							event.preventDefault()
							media.onDropzoneReset()
							if (media.disabled) {
								return
							}

							await ingestFiles(event.dataTransfer.files)
						}}
					>
						<p className="text-sm text-muted-foreground">
							{'Перетащите изображения сюда'}
						</p>
						<div className="flex flex-wrap items-center justify-center gap-2">
							<Button
								type="button"
								variant="outline"
								disabled={media.disabled}
								onClick={() => {
									fileInputRef.current?.click()
								}}
							>
								{'С компьютера'}
							</Button>
							<input
								ref={fileInputRef}
								type="file"
								accept="image/*"
								multiple={true}
								className="sr-only"
								disabled={media.disabled}
								onChange={async event => {
									const list = event.target.files
									await ingestFiles(list)
									event.target.value = ''
								}}
							/>
							<span className="text-xs text-muted-foreground">
								{'или'}
							</span>
							<Button
								type="button"
								variant="secondary"
								disabled={media.disabled}
								onClick={() => {
									const el = document.getElementById('create-product-image-draft')
									if (el instanceof HTMLInputElement) {
										el.focus()
									}
								}}
							>
								{'По ссылке'}
							</Button>
						</div>
					</div>
					{media.uploadError
						? (
							<p
								className="text-sm text-destructive"
								role="alert"
							>
								{media.uploadError}
							</p>
						)
						: null}
					<div className="grid gap-2 sm:grid-cols-[1fr_auto]">
						<FormField
							label="URL изображения"
							htmlFor="create-product-image-draft"
						>
							<Input
								id="create-product-image-draft"
								value={media.imageDraft}
								onChange={event => {
									media.onImageDraftChange(event.target.value)
								}}
								disabled={media.disabled}
								placeholder="https://"
								onKeyDown={event => {
									if (event.key === 'Enter') {
										event.preventDefault()
										media.onAddImageFromDraft()
									}
								}}
							/>
						</FormField>
						<div className="flex items-end">
							<Button
								type="button"
								variant="outline"
								disabled={media.disabled || media.imageDraft.trim().length === 0}
								onClick={media.onAddImageFromDraft}
							>
								{'Добавить'}
							</Button>
						</div>
					</div>
				</div>
				<div className="space-y-2">
					<p className="text-sm font-medium text-muted-foreground">
						{'Загружено в галерею'}
					</p>
					{media.galleryImages.length > 0
						? (
							<ul className="grid grid-cols-2 gap-2 sm:grid-cols-3">
								{media.galleryImages.map(item => (
									<li
										key={item.id}
										className="group relative overflow-hidden rounded-md border bg-muted/20"
									>
										<div className="aspect-square w-full">
											<img
												src={item.url}
												alt=""
												className="h-full w-full object-cover"
											/>
										</div>
										<Button
											type="button"
											variant="destructive"
											size="sm"
											className="absolute right-1 top-1 opacity-90 shadow-sm group-hover:opacity-100"
											disabled={media.disabled}
											onClick={() => {
												media.onRemoveGalleryImage(item.id)
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
								{'Пока пусто — добавьте файлы или ссылки выше'}
							</p>
						)}
				</div>
			</div>
		</Modal>
	)
}

export {UploadPhotoPopup}
