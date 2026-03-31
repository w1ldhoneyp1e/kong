'use client'

import {useRouter} from 'next/navigation'
import {useState} from 'react'
import {useCreateProductMutation} from '../../../../entities/product'
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
	const [tagIdsText, setTagIdsText] = useState('')
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

	const createError = createMutation.error
		? formatMutationError(createMutation.error)
		: ''

	const handleSubmit = (event: React.FormEvent) => {
		event.preventDefault()
		const tag_ids = tagIdsText
			.split(',')
			.map(item => item.trim())
			.filter(Boolean)
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
			<div className="max-w-2xl rounded-md border p-4">
				<form
					className="space-y-6"
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
						tagIdsText={tagIdsText}
						onTagIdsTextChange={setTagIdsText}
					/>
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
								className="text-sm text-destructive"
								role="alert"
							>
								{createError}
							</p>
						)
						: null}
					<div className="flex gap-2">
						<Link
							href="/admin/products"
							className="inline-flex h-9 items-center text-sm text-muted-foreground underline-offset-4 hover:underline"
						>
							{'Отмена'}
						</Link>
						<Button
							type="submit"
							state={createMutation.isPending
								? 'loading'
								: 'default'}
						>
							{'Создать'}
						</Button>
					</div>
				</form>
			</div>
		</div>
	)
}

export {ProductCreatePageClient}
