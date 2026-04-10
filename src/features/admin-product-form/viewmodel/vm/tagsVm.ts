import {type AdminProductFormViewmodel} from '../interface'
import {type ProductCreateStore} from '../store-types'

function createTagsVm(
	store: ProductCreateStore,
	tagOptions: AdminProductFormViewmodel['tags']['tagOptions'],
	disabled: boolean,
): AdminProductFormViewmodel['tags'] {
	return {
		selectedTagIds: store.selectedTagIds,
		tagOptions,
		disabled,
		onToggleTag: store.toggleTag,
	}
}

export {createTagsVm}
