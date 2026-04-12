'use client'
import {type ReactNode} from 'react'
import {Popup} from '../../../shared'
import {type ImageUploadItem, ImageUploadItemsGrid} from './ImageUploadItemsGrid'
import {ImageUploadUrlInput} from './ImageUploadUrlInput'

type ImageUploadPopupProps = {
	onClose: () => void,
	disabled: boolean,
	title: string,
	dropzone: ReactNode,
	imageDraft: string,
	items: ImageUploadItem[],
	onImageDraftChange: (value: string) => void,
	onAddImageFromDraft: () => void,
	onRemoveImage: (id: string) => void,
}

function ImageUploadPopup({
	onClose,
	disabled,
	title,
	dropzone,
	imageDraft,
	items,
	onImageDraftChange,
	onAddImageFromDraft,
	onRemoveImage,
}: Readonly<ImageUploadPopupProps>) {
	return (
		<Popup
			title={title}
			onClose={onClose}
			submitBtn={{
				label: 'Готово',
				onClick: onClose,
			}}
			disabled={disabled}
			className="max-w-2xl"
		>
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
		</Popup>
	)
}
export {ImageUploadPopup}
export type {ImageUploadPopupProps}
