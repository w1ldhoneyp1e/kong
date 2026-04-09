'use client'

import {useRouter} from 'next/navigation'
import {type ReactNode, useLayoutEffect} from 'react'
import {useCreateProductMutation, useProductTagsQuery} from '../../../../../entities/product'
import {type ProductCreateVm} from './interface'
import {ProductCreateVmProvider} from './provider'
import {useProductCreateStore} from './store'
import {
	formatMutationError,
	parseNumberOrNull,
	productSpecsHaveAnyValue,
} from './utils'
import {createDocumentsVm} from './vm/documentsVm'
import {createMainVm} from './vm/mainVm'
import {createMediaVm} from './vm/mediaVm'
import {createPageVm} from './vm/pageVm'
import {createSpecsVm} from './vm/specsVm'
import {createTagsVm} from './vm/tagsVm'

function useProductCreateVmModel(): ProductCreateVm {
	const router = useRouter()
	const createMutation = useCreateProductMutation()
	const {data: tagOptions = []} = useProductTagsQuery()
	const store = useProductCreateStore()
	useLayoutEffect(() => {
		const snapshot = useProductCreateStore.getState()
		if (productSpecsHaveAnyValue({
			material: snapshot.material,
			weight: snapshot.weight,
			length: snapshot.length,
			width: snapshot.width,
			height: snapshot.height,
		})) {
			snapshot.setSpecsSectionExpanded(true)
		}
	}, [])
	const disabled = createMutation.isPending
	const createError = createMutation.error
		? formatMutationError(createMutation.error)
		: ''

	const onSubmit = (event: React.FormEvent) => {
		event.preventDefault()
		const metadataDocuments = store.documents.map(document => ({
			id: document.id,
			title: document.title.trim(),
			kind: document.kind,
			sourceType: document.sourceType,
			url: document.url.trim(),
		})).filter(document => document.title.length > 0 && document.url.length > 0)

		createMutation.mutate(
			{
				title: store.title.trim(),
				handle: store.handle.trim() || undefined,
				status: store.status,
				thumbnail: store.galleryImages[0]?.url.trim() || null,
				images: store.galleryImages.map(item => ({url: item.url})),
				material: store.material.trim() || null,
				weight: parseNumberOrNull(store.weight),
				length: parseNumberOrNull(store.length),
				width: parseNumberOrNull(store.width),
				height: parseNumberOrNull(store.height),
				tag_ids: store.selectedTagIds,
				metadata: {
					documents: metadataDocuments,
				},
			},
			{
				onSuccess: product => {
					store.reset()
					router.push(`/admin/products/${product.id}`)
				},
			},
		)
	}

	return {
		main: createMainVm(store, disabled),
		specs: createSpecsVm(store, disabled),
		tags: createTagsVm(store, tagOptions, disabled),
		media: createMediaVm(store, disabled),
		documents: createDocumentsVm(store, disabled),
		page: createPageVm({
			disabled,
			createError,
			onCancel: () => {
				router.push('/admin/products')
			},
			onSubmit,
		}),
	}
}

function ProductCreateVmModelProvider({children}: Readonly<{children: ReactNode}>) {
	const vm = useProductCreateVmModel()

	return (
		<ProductCreateVmProvider vm={vm}>
			{children}
		</ProductCreateVmProvider>
	)
}

export {
	ProductCreateVmModelProvider,
}
