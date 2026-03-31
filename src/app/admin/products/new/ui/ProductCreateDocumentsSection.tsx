import {
	Button,
	FormField,
	Input,
} from '../../../../../shared'
import {
	type ProductDocument,
	type ProductDocumentKind,
	type ProductDocumentSourceType,
} from '../types'

function ProductCreateDocumentsSection({
	disabled,
	documents,
	newDocTitle,
	newDocKind,
	newDocSourceType,
	newDocUrl,
	documentKindOptions,
	documentSourceTypeOptions,
	onNewDocTitleChange,
	onNewDocKindChange,
	onNewDocSourceTypeChange,
	onNewDocUrlChange,
	onAddDocument,
	onRemoveDocument,
}: Readonly<{
	disabled: boolean,
	documents: ProductDocument[],
	newDocTitle: string,
	newDocKind: ProductDocumentKind,
	newDocSourceType: ProductDocumentSourceType,
	newDocUrl: string,
	documentKindOptions: {
		value: ProductDocumentKind,
		label: string,
	}[],
	documentSourceTypeOptions: {
		value: ProductDocumentSourceType,
		label: string,
	}[],
	onNewDocTitleChange: (value: string) => void,
	onNewDocKindChange: (value: ProductDocumentKind) => void,
	onNewDocSourceTypeChange: (value: ProductDocumentSourceType) => void,
	onNewDocUrlChange: (value: string) => void,
	onAddDocument: () => void,
	onRemoveDocument: (id: string) => void,
}>) {
	return (
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
										disabled={disabled}
										onClick={() => {
											onRemoveDocument(document.id)
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
								onNewDocTitleChange(event.target.value)
							}}
							disabled={disabled}
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
								onNewDocKindChange(event.target.value as ProductDocumentKind)
							}}
							disabled={disabled}
						>
							{documentKindOptions.map(option => (
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
								onNewDocSourceTypeChange(event.target.value as ProductDocumentSourceType)
							}}
							disabled={disabled}
						>
							{documentSourceTypeOptions.map(option => (
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
								onNewDocUrlChange(event.target.value)
							}}
							disabled={disabled}
						/>
					</FormField>
				</div>
				<div className="mt-3 flex justify-end">
					<Button
						type="button"
						variant="outline"
						disabled={disabled
							|| newDocTitle.trim().length === 0
							|| newDocUrl.trim().length === 0}
						onClick={onAddDocument}
					>
						{'Добавить документ'}
					</Button>
				</div>
			</div>
		</section>
	)
}

export {ProductCreateDocumentsSection}
