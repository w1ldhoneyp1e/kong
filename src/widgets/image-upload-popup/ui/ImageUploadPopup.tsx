'use client'
import {type ReactNode} from 'react'
import {Modal} from '../../../shared'
import {type ImageUploadItem, ImageUploadItemsGrid} from './ImageUploadItemsGrid'
import {ImageUploadPopupHeader} from './ImageUploadPopupHeader'
import {ImageUploadUrlInput} from './ImageUploadUrlInput'

type ImageUploadPopupProps = {
	open: boolean,
	disabled: boolean,
	title: string,
	dropzone: ReactNode,
	imageDraft: string,
	items: ImageUploadItem[],
	onOpenChange: (open: boolean) => void,
	onImageDraftChange: (value: string) => void,
	onAddImageFromDraft: () => void,
	onRemoveImage: (id: string) => void,
}

function ImageUploadPopup({
	open,
	disabled,
	title,
	dropzone,
	imageDraft,
	items,
	onOpenChange,
	onImageDraftChange,
	onAddImageFromDraft,
	onRemoveImage,
}: Readonly<ImageUploadPopupProps>) {
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
					{dropzone}
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
