import {DOCUMENT_KIND_OPTIONS, DOCUMENT_SOURCE_TYPE_OPTIONS} from '../../constants'
import {type ProductCreateVm} from '../interface'
import {type ProductCreateStore} from '../store'

function createDocumentsVm(
	store: ProductCreateStore,
	disabled: boolean,
): ProductCreateVm['documents'] {
	return {
		items: store.documents,
		isModalOpen: store.isDocumentModalOpen,
		newItem: {
			title: store.newDocTitle,
			kind: store.newDocKind,
			sourceType: store.newDocSourceType,
			url: store.newDocUrl,
		},
		kindOptions: DOCUMENT_KIND_OPTIONS,
		sourceTypeOptions: DOCUMENT_SOURCE_TYPE_OPTIONS,
		disabled,
		onOpenModal: () => store.setDocumentModalOpen(true),
		onCloseModal: () => store.setDocumentModalOpen(false),
		onOpenChange: store.setDocumentModalOpen,
		onNewTitleChange: store.setNewDocTitle,
		onNewKindChange: store.setNewDocKind,
		onNewSourceTypeChange: store.setNewDocSourceType,
		onNewUrlChange: store.setNewDocUrl,
		onAdd: store.addDocument,
		onRemove: store.removeDocument,
	}
}

export {createDocumentsVm}
