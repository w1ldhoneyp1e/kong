import {createDocumentsSlice, getDocumentsSliceInitialState} from './documentsSlice'
import {createMainSlice, getMainSliceInitialState} from './mainSlice'
import {createMediaSlice, getMediaSliceInitialState} from './mediaSlice'
import {createSalesSlice, getSalesSliceInitialState} from './salesSlice'
import {createSpecsSlice, getSpecsSliceInitialState} from './specsSlice'
import {createTagsSlice, getTagsSliceInitialState} from './tagsSlice'

function getInitialState() {
	return {
		...getMainSliceInitialState(),
		...getSalesSliceInitialState(),
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
	createSalesSlice,
	createSpecsSlice,
	createTagsSlice,
	getInitialState,
}
