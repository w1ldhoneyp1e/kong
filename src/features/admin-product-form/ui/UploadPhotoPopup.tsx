'use client'

import {ImageUploadPopup} from '../../../widgets/image-upload-popup'
import {ImageUploaderDropzone} from '../../uploader/images'
import {type AdminProductFormViewmodel} from '../viewmodel'

type UploadPhotoPopupProps = {
	media: AdminProductFormViewmodel['media'],
}

function UploadPhotoPopup({
	media,
}: Readonly<UploadPhotoPopupProps>) {
	return (
		<ImageUploadPopup
			onClose={media.onClose}
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
			onImageDraftChange={media.onImageDraftChange}
			onAddImageFromDraft={media.onAddImageFromDraft}
			onRemoveImage={media.onRemoveGalleryImage}
		/>
	)
}

export {UploadPhotoPopup}
