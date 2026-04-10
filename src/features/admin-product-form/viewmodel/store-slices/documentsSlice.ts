import {type StateCreator} from 'zustand'
import {randomId} from '../../../../shared'
import {type ProductCreateStore} from '../store-types'

type DocumentsSlice = Pick<
	ProductCreateStore,
	| 'isDocumentModalOpen'
	| 'documents'
	| 'newDocTitle'
	| 'newDocKind'
	| 'newDocSourceType'
	| 'newDocUrl'
	| 'setDocumentModalOpen'
	| 'setNewDocTitle'
	| 'setNewDocKind'
	| 'setNewDocSourceType'
	| 'setNewDocUrl'
	| 'addDocument'
	| 'removeDocument'
>

function getDocumentsSliceInitialState() {
	return {
		isDocumentModalOpen: false,
		documents: [],
		newDocTitle: '',
		newDocKind: 'instruction' as const,
		newDocSourceType: 'url' as const,
		newDocUrl: '',
	}
}

const createDocumentsSlice: StateCreator<ProductCreateStore, [], [], DocumentsSlice> = (set, get) => ({
	...getDocumentsSliceInitialState(),
	setDocumentModalOpen: open => set({isDocumentModalOpen: open}),
	setNewDocTitle: value => set({newDocTitle: value}),
	setNewDocKind: value => set({newDocKind: value}),
	setNewDocSourceType: value => set({newDocSourceType: value}),
	setNewDocUrl: value => set({newDocUrl: value}),
	addDocument: () => {
		const {
			newDocTitle,
			newDocKind,
			newDocSourceType,
			newDocUrl,
		} = get()
		const title = newDocTitle.trim()
		const url = newDocUrl.trim()
		if (!title || !url) {
			return
		}

		set(state => ({
			documents: [
				...state.documents,
				{
					id: randomId(),
					title,
					kind: newDocKind,
					sourceType: newDocSourceType,
					url,
				},
			],
			newDocTitle: '',
			newDocUrl: '',
			isDocumentModalOpen: false,
		}))
	},
	removeDocument: id => set(state => ({
		documents: state.documents.filter(item => item.id !== id),
	})),
})

export {
	createDocumentsSlice,
	getDocumentsSliceInitialState,
}
