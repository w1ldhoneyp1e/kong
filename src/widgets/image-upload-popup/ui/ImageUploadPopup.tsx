'use client'
import {useRef} from 'react'
import {Modal, useClipboardFilePaste} from '../../../shared'
import {ImageUploadDropzone} from './ImageUploadDropzone'
import {type ImageUploadItem, ImageUploadItemsGrid} from './ImageUploadItemsGrid'
import {ImageUploadPopupHeader} from './ImageUploadPopupHeader'
import {ImageUploadUrlInput} from './ImageUploadUrlInput'

type ImageUploadPopupProps = {
	open: boolean,
	disabled: boolean,
	title: string,
	uploadError: string | null,
	dropzoneActive: boolean,
	imageDraft: string,
	items: ImageUploadItem[],
	onOpenChange: (open: boolean) => void,
	onDropzoneEnter: () => void,
	onDropzoneLeave: () => void,
	onDropzoneReset: () => void,
	onImageDraftChange: (value: string) => void,
	onAddImageFromDraft: () => void,
	onAddFiles: (files: FileList | File[] | null) => Promise<void>,
	onRemoveImage: (id: string) => void,
}

function ImageUploadPopup({
	open,
	disabled,
	title,
	uploadError,
	dropzoneActive,
	imageDraft,
	items,
	onOpenChange,
	onDropzoneEnter,
	onDropzoneLeave,
	onDropzoneReset,
	onImageDraftChange,
	onAddImageFromDraft,
	onAddFiles,
	onRemoveImage,
}: Readonly<ImageUploadPopupProps>) {
	const fileInputRef = useRef<HTMLInputElement>(null)

	useClipboardFilePaste({
		enabled: open,
		disabled,
		acceptFile: file => file.type.startsWith('image/'),
		onFiles: async files => {
			await onAddFiles(files)
		},
	})

	return (
		<Modal
			open={open}
			onOpenChange={onOpenChange}
			disabled={disabled}
			className="max-w-2xl"
			ariaLabelledBy="image-upload-popup-title"
		>
			<ImageUploadPopupHeader
				title={title}
				disabled={disabled}
				onClose={() => {
					onOpenChange(false)
				}}
			/>
			<div className="space-y-6">
				<p className="text-xs text-muted-foreground">
					{'Первое фото в списке ниже — основное в карточке товара.'}
				</p>
				<div className="space-y-3">
					<p className="text-sm font-medium text-muted-foreground">
						{'Галерея'}
					</p>
					<ImageUploadDropzone
						disabled={disabled}
						active={dropzoneActive}
						onDragEnter={event => {
							event.preventDefault()
							onDropzoneEnter()
						}}
						onDragLeave={event => {
							event.preventDefault()
							onDropzoneLeave()
						}}
						onDragOver={event => {
							event.preventDefault()
							event.dataTransfer.dropEffect = 'copy'
						}}
						onDrop={async event => {
							event.preventDefault()
							onDropzoneReset()
							if (disabled) {
								return
							}

							await onAddFiles(event.dataTransfer.files)
						}}
						onComputerClick={() => {
							fileInputRef.current?.click()
						}}
						onUrlClick={() => {
							const input = document.getElementById('create-product-image-draft')
							if (input instanceof HTMLInputElement) {
								input.focus()
							}
						}}
					/>
					<input
						ref={fileInputRef}
						type="file"
						accept="image/*"
						multiple={true}
						className="sr-only"
						disabled={disabled}
						onChange={async event => {
							await onAddFiles(event.target.files)
							event.target.value = ''
						}}
					/>
					{uploadError
						? (
							<p
								className="text-sm text-destructive"
								role="alert"
							>
								{uploadError}
							</p>
						)
						: null}
					<ImageUploadUrlInput
						disabled={disabled}
						value={imageDraft}
						onValueChange={onImageDraftChange}
						onAdd={onAddImageFromDraft}
					/>
				</div>
				<div className="space-y-2">
					<p className="text-sm font-medium text-muted-foreground">
						{'Загружено в галерею'}
					</p>
					<ImageUploadItemsGrid
						items={items}
						disabled={disabled}
						onRemove={onRemoveImage}
					/>
				</div>
			</div>
		</Modal>
	)
}
export {ImageUploadPopup}
export type {ImageUploadPopupProps}
