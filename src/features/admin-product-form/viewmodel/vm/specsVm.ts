import {type AdminProductFormViewmodel} from '../interface'
import {type ProductCreateStore} from '../store-types'

function createSpecsVm(
	store: ProductCreateStore,
	disabled: boolean,
): AdminProductFormViewmodel['specs'] {
	return {
		disabled,
		sectionExpanded: store.specsSectionExpanded,
		onToggleSection: store.toggleSpecsSectionExpanded,
		materialAndWeight: {
			material: {
				value: store.material,
				onChange: store.setMaterial,
			},
			weight: {
				value: store.weight,
				onChange: store.setWeight,
			},
		},
		dimensions: {
			length: {
				value: store.length,
				onChange: store.setLength,
			},
			width: {
				value: store.width,
				onChange: store.setWidth,
			},
			height: {
				value: store.height,
				onChange: store.setHeight,
			},
		},
	}
}

export {createSpecsVm}
