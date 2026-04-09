import {createDocumentsSlice, getDocumentsSliceInitialState} from './documentsSlice'
import {createMainSlice, getMainSliceInitialState} from './mainSlice'
import {createMediaSlice, getMediaSliceInitialState} from './mediaSlice'
import {createSpecsSlice, getSpecsSliceInitialState} from './specsSlice'
import {createTagsSlice, getTagsSliceInitialState} from './tagsSlice'

function getInitialState() {
	return {
		...getMainSliceInitialState(),
		...getSpecsSliceInitialState(),
		...getTagsSliceInitialState(),
		...getMediaSliceInitialState(),
		...getDocumentsSliceInitialState(),
	}
}

export {
	createDocumentsSlice,
	createMainSlice,
	createMediaSlice,
	createSpecsSlice,
	createTagsSlice,
	getInitialState,
}
