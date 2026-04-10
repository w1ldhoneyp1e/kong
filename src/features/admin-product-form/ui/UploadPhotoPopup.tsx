'use client'

import {ImageUploadPopup} from '../../../widgets/image-upload-popup'
import {uploadProductImageFiles} from '../lib/uploadProductImageFiles'
import {useAdminProductFormViewmodel} from '../viewmodel'

function UploadPhotoPopup() {
	const {media} = useAdminProductFormViewmodel()

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
		<ImageUploadPopup
			open={media.isOpen}
			disabled={media.disabled}
			title="Фото товара"
			uploadError={media.uploadError}
			dropzoneActive={media.dropzoneActive}
			imageDraft={media.imageDraft}
			items={media.galleryImages}
			onOpenChange={media.onOpenChange}
			onDropzoneEnter={media.onDropzoneEnter}
			onDropzoneLeave={media.onDropzoneLeave}
			onDropzoneReset={media.onDropzoneReset}
			onImageDraftChange={media.onImageDraftChange}
			onAddImageFromDraft={media.onAddImageFromDraft}
			onAddFiles={ingestFiles}
			onRemoveImage={media.onRemoveGalleryImage}
		/>
	)
}

export {UploadPhotoPopup}
