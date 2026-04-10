'use client'

import {ImageUploadPopup} from '../../../widgets/image-upload-popup'
import {ImageUploaderDropzone} from '../../uploader/images'
import {useAdminProductFormViewmodel} from '../viewmodel'

function UploadPhotoPopup() {
	const {media} = useAdminProductFormViewmodel()

	return (
		<ImageUploadPopup
			open={media.isOpen}
			disabled={media.disabled}
			title="Фото товара"
			dropzone={(
				<ImageUploaderDropzone
					open={media.isOpen}
					disabled={media.disabled}
					onUploaded={media.onAddGalleryUrls}
				/>
			)}
			imageDraft={media.imageDraft}
			items={media.galleryImages}
			onOpenChange={media.onOpenChange}
			onImageDraftChange={media.onImageDraftChange}
			onAddImageFromDraft={media.onAddImageFromDraft}
			onRemoveImage={media.onRemoveGalleryImage}
		/>
	)
}

export {UploadPhotoPopup}
