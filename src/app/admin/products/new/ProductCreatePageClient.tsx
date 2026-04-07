'use client'

import {useRouter} from 'next/navigation'
import {useState} from 'react'
import {useCreateProductMutation, useProductTagsQuery} from '../../../../entities/product'
import {
	Button,
	EntityPageHeader,
	Link,
} from '../../../../shared'
import {
	DOCUMENT_KIND_OPTIONS,
	DOCUMENT_SOURCE_TYPE_OPTIONS,
	STATUS_OPTIONS,
} from './constants'
import {type ProductDocumentKind, type ProductDocumentSourceType} from './types'
import {ProductCreateDocumentsSection} from './ui/ProductCreateDocumentsSection'
import {ProductCreateMainSection} from './ui/ProductCreateMainSection'
import {ProductCreateMediaModal} from './ui/ProductCreateMediaModal'
import {ProductCreateSpecsSection} from './ui/ProductCreateSpecsSection'
import {ProductCreateTagsSection} from './ui/ProductCreateTagsSection'

function parseNumberOrNull(value: string): number | null | undefined {
	const trimmed = value.trim()
	if (!trimmed) {
		return null
	}

	const n = Number(trimmed)
	if (Number.isNaN(n)) {
		return undefined
	}

	return n
}

function formatMutationError(err: unknown): string {
	if (err instanceof Error) {
		return err.message
	}

	return String(err)
}

function ProductCreatePageClient() {
	const router = useRouter()
	const createMutation = useCreateProductMutation()
	const [title, setTitle] = useState('')
	const [handle, setHandle] = useState('')
	const [status, setStatus] = useState('draft')
	const [material, setMaterial] = useState('')
	const [weight, setWeight] = useState('')
	const [length, setLength] = useState('')
	const [width, setWidth] = useState('')
	const [height, setHeight] = useState('')
	const [selectedTagIds, setSelectedTagIds] = useState<string[]>([])
	const [isMediaModalOpen, setMediaModalOpen] = useState(false)
	const [thumbnailUrl, setThumbnailUrl] = useState('')
	const [imageDraft, setImageDraft] = useState('')
	const [galleryImages, setGalleryImages] = useState<string[]>([])
	const [documents, setDocuments] = useState<{
		id: string,
		title: string,
		kind: ProductDocumentKind,
		sourceType: ProductDocumentSourceType,
		url: string,
	}[]>([])
	const [newDocTitle, setNewDocTitle] = useState('')
	const [newDocKind, setNewDocKind] = useState<ProductDocumentKind>('instruction')
	const [newDocSourceType, setNewDocSourceType] = useState<ProductDocumentSourceType>('url')
	const [newDocUrl, setNewDocUrl] = useState('')
	const {data: tagOptions = []} = useProductTagsQuery()

	const createError = createMutation.error
		? formatMutationError(createMutation.error)
		: ''

	const handleSubmit = (event: React.FormEvent) => {
		event.preventDefault()
		const tag_ids = selectedTagIds
		const metadataDocuments = documents.map(document => ({
			id: document.id,
			title: document.title.trim(),
			kind: document.kind,
			sourceType: document.sourceType,
			url: document.url.trim(),
		})).filter(document => document.title.length > 0 && document.url.length > 0)

		createMutation.mutate(
			{
				title: title.trim(),
				handle: handle.trim() || undefined,
				status,
				thumbnail: thumbnailUrl.trim() || null,
				images: galleryImages.map(url => ({url})),
				material: material.trim() || null,
				weight: parseNumberOrNull(weight),
				length: parseNumberOrNull(length),
				width: parseNumberOrNull(width),
				height: parseNumberOrNull(height),
				tag_ids,
				metadata: {
					documents: metadataDocuments,
				},
			},
			{
				onSuccess: product => {
					router.push(`/admin/products/${product.id}`)
				},
			},
		)
	}

	const handleAddDocument = () => {
		const id = (globalThis.crypto as {randomUUID?: () => string} | undefined)
			?.randomUUID?.()
			?? `${Date.now()}_${Math.random()}`

		setDocuments(items => [
			...items,
			{
				id,
				title: newDocTitle.trim(),
				kind: newDocKind,
				sourceType: newDocSourceType,
				url: newDocUrl.trim(),
			},
		])
		setNewDocTitle('')
		setNewDocUrl('')
	}

	const handleRemoveDocument = (id: string) => {
		setDocuments(items => items.filter(item => item.id !== id))
	}

	const handleToggleTag = (id: string) => {
		setSelectedTagIds(current =>
			current.includes(id)
				? current.filter(item => item !== id)
				: [...current, id])
	}

	const handleAddGalleryImage = () => {
		const value = imageDraft.trim()
		if (!value) {
			return
		}

		setGalleryImages(current => [...current, value])
		setImageDraft('')
	}

	const handleRemoveGalleryImage = (index: number) => {
		setGalleryImages(current => current.filter((_, i) => i !== index))
	}

	return (
		<div className="space-y-6">
			<EntityPageHeader
				title="Создание товара"
				breadcrumbs={(
					<Link
						href="/admin/products"
						className="text-sm text-muted-foreground underline-offset-4 hover:underline"
					>
						{'Назад к списку товаров'}
					</Link>
				)}
			/>
			<div className="max-w-7xl">
				<form
					className="grid gap-6 xl:grid-cols-3"
					onSubmit={handleSubmit}
				>
					<ProductCreateMainSection
						title={title}
						handle={handle}
						status={status}
						disabled={createMutation.isPending}
						statusOptions={STATUS_OPTIONS}
						onTitleChange={setTitle}
						onHandleChange={setHandle}
						onStatusChange={setStatus}
					/>
					<ProductCreateSpecsSection
						disabled={createMutation.isPending}
						material={material}
						weight={weight}
						length={length}
						width={width}
						height={height}
						onMaterialChange={setMaterial}
						onWeightChange={setWeight}
						onLengthChange={setLength}
						onWidthChange={setWidth}
						onHeightChange={setHeight}
					/>
					<ProductCreateTagsSection
						disabled={createMutation.isPending}
						selectedTagIds={selectedTagIds}
						tagOptions={tagOptions}
						onToggleTag={handleToggleTag}
					/>
					<section className="space-y-3">
						<h3 className="text-sm font-medium text-muted-foreground">
							{'Фото'}
						</h3>
						<div className="rounded-md border p-3">
							<p className="mb-2 text-sm text-muted-foreground">
								{thumbnailUrl.trim().length > 0
									? 'Thumbnail добавлен'
									: 'Thumbnail не задан'}
							</p>
							<p className="mb-3 text-sm text-muted-foreground">
								{`Изображений в галерее: ${galleryImages.length}`}
							</p>
							<Button
								type="button"
								variant="outline"
								disabled={createMutation.isPending}
								onClick={() => {
									setMediaModalOpen(true)
								}}
							>
								{'Открыть модалку фото'}
							</Button>
						</div>
					</section>
					<ProductCreateDocumentsSection
						disabled={createMutation.isPending}
						documents={documents}
						newDocTitle={newDocTitle}
						newDocKind={newDocKind}
						newDocSourceType={newDocSourceType}
						newDocUrl={newDocUrl}
						documentKindOptions={DOCUMENT_KIND_OPTIONS}
						documentSourceTypeOptions={DOCUMENT_SOURCE_TYPE_OPTIONS}
						onNewDocTitleChange={setNewDocTitle}
						onNewDocKindChange={setNewDocKind}
						onNewDocSourceTypeChange={setNewDocSourceType}
						onNewDocUrlChange={setNewDocUrl}
						onAddDocument={handleAddDocument}
						onRemoveDocument={handleRemoveDocument}
					/>
					{createError
						? (
							<p
								className="text-sm text-destructive xl:col-span-2"
								role="alert"
							>
								{createError}
							</p>
						)
						: null}
					<div className="flex gap-2 xl:col-span-2">
						<Button
							type="submit"
							state={createMutation.isPending
								? 'loading'
								: 'default'}
						>
							{'Создать'}
						</Button>
						<Button
							type="button"
							variant="secondary"
							onClick={() => {
								router.push('/admin/products')
							}}
						>
							{'Отмена'}
						</Button>
					</div>
				</form>
			</div>
			<ProductCreateMediaModal
				open={isMediaModalOpen}
				disabled={createMutation.isPending}
				thumbnail={thumbnailUrl}
				imageDraft={imageDraft}
				images={galleryImages}
				onOpenChange={setMediaModalOpen}
				onThumbnailChange={setThumbnailUrl}
				onImageDraftChange={setImageDraft}
				onAddImage={handleAddGalleryImage}
				onRemoveImage={handleRemoveGalleryImage}
			/>
		</div>
	)
}

export {ProductCreatePageClient}
