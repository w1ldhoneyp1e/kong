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

function normalizeProductStatus(value: string | null | undefined): ProductStatus {
	const normalized = (value ?? '').trim().toLowerCase()
	if (
		normalized === 'draft'
		|| normalized === 'proposed'
		|| normalized === 'published'
		|| normalized === 'rejected'
	) {
		return normalized
	}

	return 'draft'
}

function getProductStatusLabel(value: string | null | undefined): string {
	const normalized = normalizeProductStatus(value)

	return PRODUCT_STATUS_LABEL_BY_VALUE[normalized] ?? 'Черновик'
}

export {
	getProductStatusLabel,
	normalizeProductStatus,
	PRODUCT_STATUS_OPTIONS,
}
export type {
	ProductStatus,
	ProductStatusOption,
}
