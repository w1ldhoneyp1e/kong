import {type ProductDocumentKind, type ProductDocumentSourceType} from './types'

const DOCUMENT_KIND_OPTIONS: {
	value: ProductDocumentKind,
	label: string,
}[] = [
	{
		value: 'instruction',
		label: 'Инструкция',
	},
	{
		value: 'reference',
		label: 'Справка',
	},
	{
		value: 'certificate',
		label: 'Сертификат',
	},
	{
		value: 'other',
		label: 'Другое',
	},
]

const DOCUMENT_SOURCE_TYPE_OPTIONS: {
	value: ProductDocumentSourceType,
	label: string,
}[] = [
	{
		value: 'url',
		label: 'URL',
	},
	{
		value: 'file',
		label: 'Файл (пока хранится как URL)',
	},
]

export {
	DOCUMENT_KIND_OPTIONS,
	DOCUMENT_SOURCE_TYPE_OPTIONS,
}
