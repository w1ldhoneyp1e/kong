'use client'

import {Plus} from 'lucide-react'
import {useState} from 'react'
import {
	type ProductDocument,
	type ProductDocumentKind,
	type ProductDocumentSourceType,
} from '../types'
import {ProductDocumentAttachmentCard} from './documentAttachmentPresentation'
import {ProductCreateDocumentModal} from './ProductCreateDocumentModal'

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
	const [addModalOpen, setAddModalOpen] = useState(false)

	const kindLabel = (kind: ProductDocumentKind) =>
		documentKindOptions.find(option => option.value === kind)?.label ?? kind

	const sourceLabel = (source: ProductDocumentSourceType) =>
		documentSourceTypeOptions.find(option => option.value === source)?.label ?? source

	const canSubmitNew
		= newDocTitle.trim().length > 0 && newDocUrl.trim().length > 0

	const handleConfirmAdd = () => {
		if (!canSubmitNew) {
			return
		}

		onAddDocument()
		setAddModalOpen(false)
	}

	return (
		<section className="space-y-3">
			<h3 className="text-sm font-medium text-muted-foreground">
				{'Документы'}
			</h3>
			<div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
				{documents.map(document => (
					<ProductDocumentAttachmentCard
						key={document.id}
						document={document}
						kindLabel={kindLabel(document.kind)}
						sourceLabel={sourceLabel(document.sourceType)}
						disabled={disabled}
						onRemove={() => {
							onRemoveDocument(document.id)
						}}
					/>
				))}
				<button
					type="button"
					disabled={disabled}
					onClick={() => {
						setAddModalOpen(true)
					}}
					className="flex min-h-[7.5rem] flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-muted-foreground/30 bg-muted/15 p-3 text-muted-foreground transition-colors hover:border-muted-foreground/45 hover:bg-muted/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
				>
					<span
						className="flex size-10 items-center justify-center rounded-full border-2 border-dashed border-muted-foreground/40 bg-background"
						aria-hidden={true}
					>
						<Plus className="size-5 stroke-[1.75]" />
					</span>
					<span className="text-center text-xs font-medium leading-tight">
						{'Добавить'}
					</span>
				</button>
			</div>
			<ProductCreateDocumentModal
				open={addModalOpen}
				disabled={disabled}
				newDocTitle={newDocTitle}
				newDocKind={newDocKind}
				newDocSourceType={newDocSourceType}
				newDocUrl={newDocUrl}
				documentKindOptions={documentKindOptions}
				documentSourceTypeOptions={documentSourceTypeOptions}
				onOpenChange={setAddModalOpen}
				onNewDocTitleChange={onNewDocTitleChange}
				onNewDocKindChange={onNewDocKindChange}
				onNewDocSourceTypeChange={onNewDocSourceTypeChange}
				onNewDocUrlChange={onNewDocUrlChange}
				onConfirm={handleConfirmAdd}
			/>
		</section>
	)
}

export {ProductCreateDocumentsSection}
