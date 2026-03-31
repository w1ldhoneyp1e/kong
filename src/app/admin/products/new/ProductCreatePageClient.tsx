'use client'

import {useRouter} from 'next/navigation'
import {useState} from 'react'
import {useCreateProductMutation} from '../../../../entities/product'
import {
	Button,
	EntityPageHeader,
	FormField,
	Input,
	Link,
} from '../../../../shared'

type ProductDocumentKind = 'instruction' | 'reference' | 'certificate' | 'other'
type ProductDocumentSourceType = 'url' | 'file'

type ProductDocument = {
	id: string,
	title: string,
	kind: ProductDocumentKind,
	sourceType: ProductDocumentSourceType,
	url: string,
}

const STATUS_OPTIONS = [
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
	const [documents, setDocuments] = useState<ProductDocument[]>([])
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
					<section className="space-y-4">
						<h3 className="text-sm font-medium text-muted-foreground">
							{'Основное'}
						</h3>
						<FormField
							label="Название"
							htmlFor="create-product-title"
						>
							<Input
								id="create-product-title"
								value={title}
								onChange={event => {
									setTitle(event.target.value)
								}}
								required={true}
								disabled={createMutation.isPending}
							/>
						</FormField>
						<FormField
							label="Handle (URL)"
							htmlFor="create-product-handle"
						>
							<Input
								id="create-product-handle"
								value={handle}
								onChange={event => {
									setHandle(event.target.value)
								}}
								disabled={createMutation.isPending}
							/>
						</FormField>
						<FormField
							label="Статус"
							htmlFor="create-product-status"
						>
							<select
								id="create-product-status"
								className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
								value={status}
								onChange={event => {
									setStatus(event.target.value)
								}}
								disabled={createMutation.isPending}
							>
								{STATUS_OPTIONS.map(option => (
									<option
										key={option.value}
										value={option.value}
									>
										{option.label}
									</option>
								))}
							</select>
						</FormField>
					</section>
					<section className="space-y-4">
						<h3 className="text-sm font-medium text-muted-foreground">
							{'Характеристики'}
						</h3>
						<p className="text-xs text-muted-foreground">
							{'Материал, вес и габариты не обязательны на этапе создания.'}
						</p>
						<FormField
							label="Материал"
							htmlFor="create-product-material"
						>
							<Input
								id="create-product-material"
								value={material}
								onChange={event => {
									setMaterial(event.target.value)
								}}
								disabled={createMutation.isPending}
							/>
						</FormField>
						<div className="grid gap-4 sm:grid-cols-2">
							<FormField
								label="Вес"
								htmlFor="create-product-weight"
							>
								<Input
									id="create-product-weight"
									type="number"
									step="any"
									value={weight}
									onChange={event => {
										setWeight(event.target.value)
									}}
									disabled={createMutation.isPending}
								/>
							</FormField>
							<div />
						</div>
						<div className="grid gap-4 sm:grid-cols-3">
							<FormField
								label="Длина"
								htmlFor="create-product-length"
							>
								<Input
									id="create-product-length"
									type="number"
									step="any"
									value={length}
									onChange={event => {
										setLength(event.target.value)
									}}
									disabled={createMutation.isPending}
								/>
							</FormField>
							<FormField
								label="Ширина"
								htmlFor="create-product-width"
							>
								<Input
									id="create-product-width"
									type="number"
									step="any"
									value={width}
									onChange={event => {
										setWidth(event.target.value)
									}}
									disabled={createMutation.isPending}
								/>
							</FormField>
							<FormField
								label="Высота"
								htmlFor="create-product-height"
							>
								<Input
									id="create-product-height"
									type="number"
									step="any"
									value={height}
									onChange={event => {
										setHeight(event.target.value)
									}}
									disabled={createMutation.isPending}
								/>
							</FormField>
						</div>
					</section>
					<section className="space-y-4">
						<h3 className="text-sm font-medium text-muted-foreground">
							{'Теги'}
						</h3>
						<FormField
							label="ID тегов (через запятую)"
							htmlFor="create-product-tag-ids"
						>
							<Input
								id="create-product-tag-ids"
								value={tagIdsText}
								onChange={event => {
									setTagIdsText(event.target.value)
								}}
								disabled={createMutation.isPending}
							/>
						</FormField>
					</section>
					<section className="space-y-3">
						<h3 className="text-sm font-medium text-muted-foreground">
							{'Документы'}
						</h3>
						<div className="rounded-md border p-3">
							{documents.length > 0
								? (
									<ul className="mb-3 space-y-2 text-sm">
										{documents.map(document => (
											<li
												key={document.id}
												className="flex items-start justify-between gap-3"
											>
												<div className="min-w-0">
													<div className="font-medium">
														{document.title}
													</div>
													<div className="text-xs text-muted-foreground">
														{`${document.kind} / ${document.sourceType}: ${document.url}`}
													</div>
												</div>
												<Button
													type="button"
													variant="outline"
													size="sm"
													disabled={createMutation.isPending}
													onClick={() => {
														setDocuments(items =>
															items.filter(item => item.id !== document.id))
													}}
												>
													{'Удалить'}
												</Button>
											</li>
										))}
									</ul>
								)
								: (
									<p className="text-sm text-muted-foreground">
										{'Пока нет документов'}
									</p>
								)}
							<div className="grid gap-4 sm:grid-cols-2">
								<FormField
									label="Название"
									htmlFor="create-doc-title"
								>
									<Input
										id="create-doc-title"
										value={newDocTitle}
										onChange={event => {
											setNewDocTitle(event.target.value)
										}}
										disabled={createMutation.isPending}
									/>
								</FormField>
								<FormField
									label="Тип"
									htmlFor="create-doc-kind"
								>
									<select
										id="create-doc-kind"
										className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
										value={newDocKind}
										onChange={event => {
											setNewDocKind(event.target.value as ProductDocumentKind)
										}}
										disabled={createMutation.isPending}
									>
										{DOCUMENT_KIND_OPTIONS.map(option => (
											<option
												key={option.value}
												value={option.value}
											>
												{option.label}
											</option>
										))}
									</select>
								</FormField>
								<FormField
									label="Источник"
									htmlFor="create-doc-source-type"
								>
									<select
										id="create-doc-source-type"
										className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
										value={newDocSourceType}
										onChange={event => {
											setNewDocSourceType(event.target.value as ProductDocumentSourceType)
										}}
										disabled={createMutation.isPending}
									>
										{DOCUMENT_SOURCE_TYPE_OPTIONS.map(option => (
											<option
												key={option.value}
												value={option.value}
											>
												{option.label}
											</option>
										))}
									</select>
								</FormField>
								<FormField
									label="URL"
									htmlFor="create-doc-url"
								>
									<Input
										id="create-doc-url"
										value={newDocUrl}
										onChange={event => {
											setNewDocUrl(event.target.value)
										}}
										disabled={createMutation.isPending}
									/>
								</FormField>
							</div>
							<div className="mt-3 flex justify-end">
								<Button
									type="button"
									variant="outline"
									disabled={createMutation.isPending
										|| newDocTitle.trim().length === 0
										|| newDocUrl.trim().length === 0}
									onClick={() => {
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
									}}
								>
									{'Добавить документ'}
								</Button>
							</div>
						</div>
					</section>
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
