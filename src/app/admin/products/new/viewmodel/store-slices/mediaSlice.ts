import {type StateCreator} from 'zustand'
import {randomId} from '../../../../../../shared'
import {type ProductCreateStore} from '../store-types'

type MediaSlice = Pick<
	ProductCreateStore,
	| 'isMediaModalOpen'
	| 'mediaUploadError'
	| 'mediaDropzoneDepth'
	| 'imageDraft'
	| 'galleryImages'
	| 'setMediaModalOpen'
	| 'setMediaUploadError'
	| 'mediaDropzoneEnter'
	| 'mediaDropzoneLeave'
	| 'resetMediaDropzone'
	| 'setImageDraft'
	| 'addGalleryImageFromDraft'
	| 'addGalleryUrls'
	| 'reorderGalleryImages'
	| 'removeGalleryImageById'
>

function getMediaSliceInitialState() {
	return {
		isMediaModalOpen: false,
		mediaUploadError: null,
		mediaDropzoneDepth: 0,
		imageDraft: '',
		galleryImages: [],
	}
}

const createMediaSlice: StateCreator<ProductCreateStore, [], [], MediaSlice> = (set, get) => ({
	...getMediaSliceInitialState(),
	setMediaModalOpen: open => set({
		isMediaModalOpen: open,
		mediaUploadError: null,
		mediaDropzoneDepth: 0,
	}),
	setMediaUploadError: value => set({mediaUploadError: value}),
	mediaDropzoneEnter: () => set(state => ({
		mediaDropzoneDepth: state.mediaDropzoneDepth + 1,
	})),
	mediaDropzoneLeave: () => set(state => ({
		mediaDropzoneDepth: Math.max(0, state.mediaDropzoneDepth - 1),
	})),
	resetMediaDropzone: () => set({mediaDropzoneDepth: 0}),
	setImageDraft: value => set({imageDraft: value}),
	addGalleryImageFromDraft: () => {
		const value = get().imageDraft.trim()
		if (!value) {
			return
		}

		set(state => ({
			galleryImages: [
				...state.galleryImages,
				{
					id: randomId(),
					url: value,
				},
			],
			imageDraft: '',
		}))
	},
	addGalleryUrls: urls => set(state => ({
		galleryImages: [
			...state.galleryImages,
			...urls
				.map(url => url.trim())
				.filter(Boolean)
				.map(url => ({
					id: randomId(),
					url,
				})),
		],
	})),
	reorderGalleryImages: (fromIndex, toIndex) => set(state => {
		const next = [...state.galleryImages]
		if (
			fromIndex < 0
			|| fromIndex >= next.length
			|| toIndex < 0
			|| toIndex >= next.length
		) {
			return state
		}

		const moved = next.splice(fromIndex, 1)[0]
		if (!moved) {
			return state
		}

		next.splice(toIndex, 0, moved)

		return {galleryImages: next}
	}),
	removeGalleryImageById: id => set(state => ({
		galleryImages: state.galleryImages.filter(item => item.id !== id),
	})),
})

export {
	createMediaSlice,
	getMediaSliceInitialState,
}
