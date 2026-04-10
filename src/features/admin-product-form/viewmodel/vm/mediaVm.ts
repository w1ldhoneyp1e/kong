import {type ProductCreateVm} from '../interface'
import {type ProductCreateStore} from '../store-types'

function createMediaVm(
	store: ProductCreateStore,
	disabled: boolean,
): ProductCreateVm['media'] {
	return {
		isOpen: store.isMediaModalOpen,
		imageDraft: store.imageDraft,
		galleryImages: store.galleryImages,
		disabled,
		uploadError: store.mediaUploadError,
		dropzoneActive: store.mediaDropzoneDepth > 0,
		onUploadErrorChange: store.setMediaUploadError,
		onDropzoneEnter: store.mediaDropzoneEnter,
		onDropzoneLeave: store.mediaDropzoneLeave,
		onDropzoneReset: store.resetMediaDropzone,
		onOpen: () => store.setMediaModalOpen(true),
		onOpenChange: store.setMediaModalOpen,
		onImageDraftChange: store.setImageDraft,
		onAddImageFromDraft: store.addGalleryImageFromDraft,
		onAddGalleryUrls: store.addGalleryUrls,
		onReorderGallery: store.reorderGalleryImages,
		onRemoveGalleryImage: store.removeGalleryImageById,
	}
}

export {createMediaVm}
