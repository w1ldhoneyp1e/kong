'use client'

import {useRouter} from 'next/navigation'
import {type ReactNode, useLayoutEffect} from 'react'
import {useCategoriesQuery} from '../../../entities/category'
import {
	type AdminProduct,
	useCreateProductMutation,
	useProductTagsQuery,
	useUpdateProductMutation,
} from '../../../entities/product'
import {randomId} from '../../../shared'
import {type AdminProductFormViewmodel, type ProductFormMode} from './interface'
import {AdminProductFormViewmodelProvider} from './provider'
import {useProductCreateStore} from './store'
import {
	formatMutationError,
	parseMoneyToMinorUnits,
	parseNumberOrNull,
	productSpecsHaveAnyValue,
} from './utils'
import {createDocumentsVm} from './vm/documentsVm'
import {createMainVm} from './vm/mainVm'
import {createMediaVm} from './vm/mediaVm'
import {createPageVm} from './vm/pageVm'
import {createSalesVm} from './vm/salesVm'
import {createSpecsVm} from './vm/specsVm'
import {createTagsVm} from './vm/tagsVm'

type AdminProductFormProviderProps = Readonly<{
	mode: ProductFormMode,
	productId?: string,
	initialProduct?: AdminProduct,
	children: ReactNode,
}>

function syncStoreWithProduct(initialProduct: AdminProduct | undefined) {
	if (!initialProduct) {
		return
	}

	const handle = initialProduct.handle ?? ''
	const status = typeof initialProduct.status === 'string' && initialProduct.status.trim().length > 0
		? initialProduct.status
		: 'draft'
	const material = initialProduct.material ?? ''
	const weight = typeof initialProduct.weight === 'number'
		? String(initialProduct.weight)
		: ''
	const length = typeof initialProduct.length === 'number'
		? String(initialProduct.length)
		: ''
	const width = typeof initialProduct.width === 'number'
		? String(initialProduct.width)
		: ''
	const height = typeof initialProduct.height === 'number'
		? String(initialProduct.height)
		: ''
	const selectedTagIds = (initialProduct.tags ?? [])
		.map(tag => tag.id)
		.filter(id => id.trim().length > 0)
	const primaryVariant = initialProduct.variants?.[0]
	const primaryVariantPrice = primaryVariant?.prices?.[0]?.amount
	const variantAvailable = primaryVariant?.metadata?.available
	const variantStockQuantity = primaryVariant?.stock_quantity ?? primaryVariant?.metadata?.stock_quantity ?? null
	const selectedCategoryId = initialProduct.categories?.[0]?.id ?? null
	const galleryImages = [
		...(initialProduct.images ?? []),
	].sort((a, b) => {
		const rankA = a.rank ?? 0
		const rankB = b.rank ?? 0

		return rankA - rankB
	}).map(image => image.url?.trim() ?? '')
		.filter(Boolean)
		.map(url => ({
			id: randomId(),
			url,
		}))
	const docs = (initialProduct.metadata?.documents ?? [])
		.map(item => ({
			id: item.id?.trim() || randomId(),
			title: item.title?.trim() ?? '',
			kind: item.kind,
			sourceType: item.sourceType,
			url: item.url?.trim() ?? '',
		}))
		.filter(item => item.title.length > 0 || item.url.length > 0)

	useProductCreateStore.setState({
		title: initialProduct.title?.trim() ?? '',
		handle,
		status,
		material,
		weight,
		length,
		width,
		height,
		selectedTagIds,
		variantId: primaryVariant?.id ?? null,
		variantTitle: primaryVariant?.title?.trim() ?? 'Основной',
		variantSku: primaryVariant?.sku?.trim() ?? '',
		variantPrice: typeof primaryVariantPrice === 'number'
			? String(primaryVariantPrice / 100)
			: '',
		variantAvailable: typeof variantAvailable === 'boolean'
			? variantAvailable
			: true,
		variantStockQuantity: typeof variantStockQuantity === 'number'
			? variantStockQuantity
			: null,
		selectedCategoryId,
		galleryImages,
		documents: docs,
		specsSectionExpanded: productSpecsHaveAnyValue({
			material,
			weight,
			length,
			width,
			height,
		}),
	})
}

function useAdminProductFormViewmodel(params: {
	mode: ProductFormMode,
	productId?: string,
	initialProduct?: AdminProduct,
}): AdminProductFormViewmodel {
	const router = useRouter()
	const createMutation = useCreateProductMutation()
	const updateMutation = useUpdateProductMutation()
	const {data: tagOptions = []} = useProductTagsQuery()
	const {data: categoryOptions = []} = useCategoriesQuery()
	const store = useProductCreateStore()

	useLayoutEffect(() => {
		if (params.mode === 'edit') {
			syncStoreWithProduct(params.initialProduct)
		}

		if (params.mode === 'create') {
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
		}
	}, [params.initialProduct, params.mode, params.productId])
	const disabled = createMutation.isPending || updateMutation.isPending
	const errorText = (params.mode === 'create' && createMutation.error)
		? formatMutationError(createMutation.error)
		: ((params.mode === 'edit' && updateMutation.error)
			? formatMutationError(updateMutation.error)
			: '')

	const onSubmit = (event: React.FormEvent) => {
		event.preventDefault()
		const metadataDocuments = store.documents.map(document => ({
			id: document.id,
			title: document.title.trim(),
			kind: document.kind,
			sourceType: document.sourceType,
			url: document.url.trim(),
		})).filter(document => document.title.length > 0 && document.url.length > 0)

		const variantPrice = parseMoneyToMinorUnits(store.variantPrice)
		const variantPayload = {
			...(store.variantId
				? {id: store.variantId}
				: {}),
			title: store.variantTitle.trim() || 'Основной',
			sku: store.variantSku.trim() || undefined,
			prices: variantPrice === null || variantPrice === undefined
				? []
				: [{
					amount: variantPrice,
					currency_code: 'rub',
				}],
			metadata: {
				available: store.variantAvailable,
			},
			stock_quantity: store.variantStockQuantity ?? undefined,
		}

		const payload = {
			title: store.title.trim(),
			handle: store.handle.trim() || undefined,
			status: store.status.trim() || 'draft',
			thumbnail: store.galleryImages[0]?.url.trim() || null,
			images: store.galleryImages.map(item => ({url: item.url})),
			variants: [variantPayload],
			material: store.material.trim() || null,
			weight: parseNumberOrNull(store.weight),
			length: parseNumberOrNull(store.length),
			width: parseNumberOrNull(store.width),
			height: parseNumberOrNull(store.height),
			tag_ids: store.selectedTagIds,
			category_ids: store.selectedCategoryId
				? [store.selectedCategoryId]
				: [],
			metadata: {
				documents: metadataDocuments,
			},
		}

		if (params.mode === 'create') {
			createMutation.mutate(payload, {
				onSuccess: product => {
					store.reset()
					router.push(`/admin/products/${product.id}`)
				},
			})
		}

		if (params.mode === 'edit' && params.productId) {
			updateMutation.mutate({
				id: params.productId,
				payload,
			}, {
				onSuccess: product => {
					store.reset()
					router.push(`/admin/products/${product.id}`)
				},
			})
		}
	}

	const pageTitle = params.mode === 'create'
		? 'Создание товара'
		: 'Редактирование товара'
	const submitLabel = params.mode === 'create'
		? 'Создать'
		: 'Сохранить'

	return {
		main: createMainVm(store, categoryOptions, disabled),
		sales: createSalesVm(store, disabled),
		specs: createSpecsVm(store, disabled),
		tags: createTagsVm(store, tagOptions, disabled),
		media: createMediaVm(store, disabled),
		documents: createDocumentsVm(store, disabled),
		page: createPageVm({
			mode: params.mode,
			title: pageTitle,
			submitLabel,
			disabled,
			errorText,
			onCancel: () => {
				if (params.mode === 'edit' && params.productId) {
					router.push(`/admin/products/${params.productId}`)
				}
				else {
					router.push('/admin/products')
				}
			},
			onSubmit,
		}),
	}
}

function AdminProductFormProvider({
	mode,
	productId,
	initialProduct,
	children,
}: AdminProductFormProviderProps) {
	const viewmodel = useAdminProductFormViewmodel({
		mode,
		productId,
		initialProduct,
	})

	return (
		<AdminProductFormViewmodelProvider viewmodel={viewmodel}>
			{children}
		</AdminProductFormViewmodelProvider>
	)
}

export {
	AdminProductFormProvider,
}
