type ProductStatus = 'draft' | 'proposed' | 'published' | 'rejected'

type ProductStatusOption = {
	value: ProductStatus,
	label: string,
}

const PRODUCT_STATUS_OPTIONS: ProductStatusOption[] = [
	{
		value: 'draft',
		label: 'Черновик',
	},
	{
		value: 'proposed',
		label: 'На модерации',
	},
	{
		value: 'published',
		label: 'Опубликован',
	},
	{
		value: 'rejected',
		label: 'Отклонён',
	},
]

const PRODUCT_STATUS_LABEL_BY_VALUE = PRODUCT_STATUS_OPTIONS.reduce<Record<string, string>>((acc, item) => {
	acc[item.value] = item.label

	return acc
}, {})

function getProductStatusLabel(value: ProductStatus): string {
	return PRODUCT_STATUS_LABEL_BY_VALUE[value] ?? 'Черновик'
}

export {
	getProductStatusLabel,
	PRODUCT_STATUS_OPTIONS,
}
export type {
	ProductStatus,
	ProductStatusOption,
}
