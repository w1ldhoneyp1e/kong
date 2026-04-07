'use client'

import {useEffect, useState} from 'react'
import {
	Button,
	FormField,
	Input,
	Modal,
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '../../../shared'

type ProductDocumentKind = 'instruction' | 'reference' | 'certificate' | 'other'
type ProductDocumentSourceType = 'url' | 'file'

type ProductDocument = {
	id: string,
	title: string,
	kind: ProductDocumentKind,
	sourceType: ProductDocumentSourceType,
	url: string,
}

type ProductVariantForSku = {
	id: string,
	title?: string | null,
	sku?: string | null,
}

type ProductFormSubmitPayload = {
	title: string,
	handle?: string,
	status: string,
	material?: string | null,
	weight?: number | null,
	length?: number | null,
	width?: number | null,
	height?: number | null,
	tag_ids?: string[],
	variants?: {
		id: string,
		sku: string | null,
	}[],
	metadata?: {
		documents?: ProductDocument[],
	} & Record<string, unknown>,
}

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

function formatNumberInput(value: number | null | undefined): string {
	if (typeof value !== 'number' || Number.isNaN(value)) {
		return ''
	}

	return String(value)
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

const DEFAULT_TAGS: string[] = []
const DEFAULT_DOCUMENTS: ProductDocument[] = []

function ProductFormModal({
	open,
	title,
	submitLabel = 'Сохранить',
	onOpenChange,
	onSubmit,
	submitting,
	errorText,
	initialTitle = '',
	initialHandle = '',
	initialStatus = 'draft',
	initialMaterial,
	initialWeight,
	initialLength,
	initialWidth,
	initialHeight,
	initialTagIds = DEFAULT_TAGS,
	initialDocuments = DEFAULT_DOCUMENTS,
	initialMetadata,
	initialVariants,
}: Readonly<{
	open: boolean,
	title: string,
	submitLabel?: string,
	onOpenChange: (open: boolean) => void,
	onSubmit: (payload: ProductFormSubmitPayload) => void,
	submitting: boolean,
	errorText: string,
	initialTitle?: string,
	initialHandle?: string,
	initialStatus?: string,
	initialMaterial?: string | null,
	initialWeight?: number | null,
	initialLength?: number | null,
	initialWidth?: number | null,
	initialHeight?: number | null,
	initialTagIds?: string[],
	initialDocuments?: ProductDocument[],
	initialMetadata?: Record<string, unknown> | null,
	initialVariants?: ProductVariantForSku[],
}>) {
	const [formTitle, setFormTitle] = useState(initialTitle)
	const [formHandle, setFormHandle] = useState(initialHandle)
	const [formStatus, setFormStatus] = useState(initialStatus)
	const [formMaterial, setFormMaterial] = useState<string>(initialMaterial ?? '')
	const [formWeight, setFormWeight] = useState<string>(formatNumberInput(initialWeight))
	const [formLength, setFormLength] = useState<string>(formatNumberInput(initialLength))
	const [formWidth, setFormWidth] = useState<string>(formatNumberInput(initialWidth))
	const [formHeight, setFormHeight] = useState<string>(formatNumberInput(initialHeight))
	const [formTagIdsText, setFormTagIdsText] = useState<string>(initialTagIds.join(', '))
	const [formDocuments, setFormDocuments] = useState<ProductDocument[]>(initialDocuments)
	const [variantSkuById, setVariantSkuById] = useState<Record<string, string>>({})

	const [newDocTitle, setNewDocTitle] = useState<string>('')
	const [newDocKind, setNewDocKind] = useState<ProductDocumentKind>('instruction')
	const [newDocSourceType, setNewDocSourceType] = useState<ProductDocumentSourceType>('url')
	const [newDocUrl, setNewDocUrl] = useState<string>('')

	useEffect(() => {
		if (!open) {
			return
		}

		setFormTitle(initialTitle)
		setFormHandle(initialHandle)
		setFormStatus(initialStatus)
		setFormMaterial(initialMaterial ?? '')
		setFormWeight(formatNumberInput(initialWeight))
		setFormLength(formatNumberInput(initialLength))
		setFormWidth(formatNumberInput(initialWidth))
		setFormHeight(formatNumberInput(initialHeight))
		setFormTagIdsText(initialTagIds.join(', '))
		setFormDocuments(initialDocuments)
		setVariantSkuById(
			(initialVariants ?? []).reduce<Record<string, string>>((acc, v) => {
				acc[v.id] = v.sku ?? ''
				return acc
			}, {}),
		)

		setNewDocTitle('')
		setNewDocKind('instruction')
		setNewDocSourceType('url')
		setNewDocUrl('')
	}, [
		open,
		initialTitle,
		initialHandle,
		initialStatus,
		initialMaterial,
		initialWeight,
		initialLength,
		initialWidth,
		initialHeight,
		initialTagIds,
		initialDocuments,
		initialVariants,
	])

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()
		const tag_ids = formTagIdsText
			.split(',')
			.map(s => s.trim())
			.filter(Boolean)

		const docs = formDocuments.map(doc => ({
			id: doc.id,
			title: doc.title.trim(),
			kind: doc.kind,
			sourceType: doc.sourceType,
			url: doc.url.trim(),
		})).filter(doc => doc.title.length > 0 && doc.url.length > 0)

		const metadataBase: ProductFormSubmitPayload['metadata'] = {
			...(initialMetadata ?? {}),
		}
		metadataBase.documents = docs

		const variants = (initialVariants ?? []).map(v => ({
			id: v.id,
			sku: (variantSkuById[v.id] ?? '').trim() || null,
		}))

		onSubmit({
			title: formTitle.trim(),
			handle: formHandle.trim() || undefined,
			status: formStatus,
			material: formMaterial.trim() || null,
			weight: parseNumberOrNull(formWeight),
			length: parseNumberOrNull(formLength),
			width: parseNumberOrNull(formWidth),
			height: parseNumberOrNull(formHeight),
			tag_ids,
			metadata: metadataBase,
			variants: variants.length > 0
				? variants
				: undefined,
		})
	}

	const variantsForSku = initialVariants ?? []

	return (
		<Modal
			open={open}
			onOpenChange={onOpenChange}
			disabled={submitting}
			className="max-w-md"
			ariaLabelledBy="product-form-title"
		>
			<h2
				id="product-form-title"
				className="mb-4 text-lg font-semibold"
			>
				{title}
			</h2>
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
						htmlFor="product-title"
					>
						<Input
							id="product-title"
							value={formTitle}
							onChange={e => {
								setFormTitle(e.target.value)
							}}
							required={true}
							disabled={submitting}
						/>
					</FormField>
					<FormField
						label="Handle (URL)"
						htmlFor="product-handle"
					>
						<Input
							id="product-handle"
							value={formHandle}
							onChange={e => {
								setFormHandle(e.target.value)
							}}
							disabled={submitting}
						/>
					</FormField>
					<FormField
						label="Статус"
						htmlFor="product-status"
					>
						<Select
							value={formStatus}
							onValueChange={setFormStatus}
							disabled={submitting}
						>
							<SelectTrigger id="product-status">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								{STATUS_OPTIONS.map(opt => (
									<SelectItem
										key={opt.value}
										value={opt.value}
									>
										{opt.label}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</FormField>
				</section>
				{errorText
					? (
						<p
							className="text-sm text-destructive"
							role="alert"
						>
							{errorText}
						</p>
					)
					: null}
				<section className="space-y-4">
					<h3 className="text-sm font-medium text-muted-foreground">
						{'Характеристики'}
					</h3>
					<FormField
						label="Материал"
						htmlFor="product-material"
					>
						<Input
							id="product-material"
							value={formMaterial}
							onChange={e => {
								setFormMaterial(e.target.value)
							}}
							disabled={submitting}
						/>
					</FormField>
					<div className="grid gap-4 sm:grid-cols-2">
						<FormField
							label="Вес"
							htmlFor="product-weight"
						>
							<Input
								id="product-weight"
								type="number"
								step="any"
								value={formWeight}
								onChange={e => {
									setFormWeight(e.target.value)
								}}
								disabled={submitting}
							/>
						</FormField>
						<div />
					</div>
					<div className="grid gap-4 sm:grid-cols-3">
						<FormField
							label="Длина"
							htmlFor="product-length"
						>
							<Input
								id="product-length"
								type="number"
								step="any"
								value={formLength}
								onChange={e => {
									setFormLength(e.target.value)
								}}
								disabled={submitting}
							/>
						</FormField>
						<FormField
							label="Ширина"
							htmlFor="product-width"
						>
							<Input
								id="product-width"
								type="number"
								step="any"
								value={formWidth}
								onChange={e => {
									setFormWidth(e.target.value)
								}}
								disabled={submitting}
							/>
						</FormField>
						<FormField
							label="Высота"
							htmlFor="product-height"
						>
							<Input
								id="product-height"
								type="number"
								step="any"
								value={formHeight}
								onChange={e => {
									setFormHeight(e.target.value)
								}}
								disabled={submitting}
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
						htmlFor="product-tags"
					>
						<Input
							id="product-tags"
							value={formTagIdsText}
							onChange={e => {
								setFormTagIdsText(e.target.value)
							}}
							disabled={submitting}
						/>
					</FormField>
				</section>
				<section className="space-y-3">
					<h3 className="text-sm font-medium text-muted-foreground">
						{'Документы'}
					</h3>
					<div className="rounded-md border p-3">
						{formDocuments.length > 0
							? (
								<ul className="mb-3 space-y-2 text-sm">
									{formDocuments.map(doc => (
										<li
											key={doc.id}
											className="flex items-start justify-between gap-3"
										>
											<div className="min-w-0">
												<div className="font-medium">
													{doc.title}
												</div>
												<div className="text-xs text-muted-foreground">
													{`${doc.kind} / ${doc.sourceType}: ${doc.url}`}
												</div>
											</div>
											<Button
												type="button"
												variant="outline"
												size="sm"
												disabled={submitting}
												onClick={() => {
													setFormDocuments(d => d.filter(x => x.id !== doc.id))
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
								htmlFor="doc-title"
							>
								<Input
									id="doc-title"
									value={newDocTitle}
									onChange={e => setNewDocTitle(e.target.value)}
									disabled={submitting}
								/>
							</FormField>
							<FormField
								label="Тип"
								htmlFor="doc-kind"
							>
								<Select
									value={newDocKind}
									onValueChange={value => {
										setNewDocKind(value as ProductDocumentKind)
									}}
									disabled={submitting}
								>
									<SelectTrigger id="doc-kind">
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										{DOCUMENT_KIND_OPTIONS.map(opt => (
											<SelectItem
												key={opt.value}
												value={opt.value}
											>
												{opt.label}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</FormField>
							<FormField
								label="Источник"
								htmlFor="doc-source-type"
							>
								<Select
									value={newDocSourceType}
									onValueChange={value => {
										setNewDocSourceType(value as ProductDocumentSourceType)
									}}
									disabled={submitting}
								>
									<SelectTrigger id="doc-source-type">
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										{DOCUMENT_SOURCE_TYPE_OPTIONS.map(opt => (
											<SelectItem
												key={opt.value}
												value={opt.value}
											>
												{opt.label}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</FormField>
							<FormField
								label="URL"
								htmlFor="doc-url"
							>
								<Input
									id="doc-url"
									value={newDocUrl}
									onChange={e => setNewDocUrl(e.target.value)}
									disabled={submitting}
								/>
							</FormField>
						</div>
						<div className="mt-3 flex justify-end">
							<Button
								type="button"
								variant="outline"
								disabled={submitting
										|| newDocTitle.trim().length === 0
										|| newDocUrl.trim().length === 0}
								onClick={() => {
									const id = (globalThis.crypto as {randomUUID?: () => string} | undefined)
										?.randomUUID?.()
											?? `${Date.now()}_${Math.random()}`

									setFormDocuments(d => [
										...d,
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
				{variantsForSku.length > 0
					? (
						<section className="space-y-3">
							<h3 className="text-sm font-medium text-muted-foreground">
								{'Варианты (SKU)'}
							</h3>
							<div className="rounded-md border p-3">
								<ul className="space-y-2 text-sm">
									{variantsForSku.map(variant => (
										<li
											key={variant.id}
											className="flex items-center justify-between gap-3"
										>
											<div className="min-w-0">
												<div className="truncate font-medium">
													{variant.title ?? 'Вариант'}
												</div>
												<div className="font-mono text-xs text-muted-foreground">
													{variant.id}
												</div>
											</div>
											<div className="w-44">
												<Input
													value={variantSkuById[variant.id] ?? ''}
													onChange={e => {
														const nextValue = e.target.value
														setVariantSkuById(s => ({
															...s,
															[variant.id]: nextValue,
														}))
													}}
													disabled={submitting}
												/>
											</div>
										</li>
									))}
								</ul>
							</div>
						</section>
					)
					: null}
				<div className="flex justify-end gap-2 pt-2">
					<Button
						type="button"
						variant="outline"
						disabled={submitting}
						onClick={() => {
							onOpenChange(false)
						}}
					>
						{'Отмена'}
					</Button>
					<Button
						type="submit"
						state={submitting
							? 'loading'
							: 'default'}
					>
						{submitLabel}
					</Button>
				</div>
			</form>
		</Modal>
	)
}

export {ProductFormModal}
