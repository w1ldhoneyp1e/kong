import {type ProductCreateVm} from '../interface'
import {type ProductCreateStore} from '../store'

function createTagsVm(
	store: ProductCreateStore,
	tagOptions: ProductCreateVm['tags']['tagOptions'],
	disabled: boolean,
): ProductCreateVm['tags'] {
	return {
		selectedTagIds: store.selectedTagIds,
		tagOptions,
		disabled,
		onToggleTag: store.toggleTag,
	}
}

export {createTagsVm}
