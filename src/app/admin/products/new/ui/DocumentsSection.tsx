'use client'

import {Plus} from 'lucide-react'
import {type ProductDocumentKind, type ProductDocumentSourceType} from '../types'
import {type ProductCreateVm} from '../viewmodel'
import {DocumentAttachmentCard} from './DocumentAttachmentCard'
import {UploadDocumentPopup} from './UploadDocumentPopup'

type DocumentsSectionProps = {
	documents: ProductCreateVm['documents'],
}

function DocumentsSection({
	documents,
}: DocumentsSectionProps) {
	const kindLabel = (kind: ProductDocumentKind) =>
		documents.kindOptions.find(option => option.value === kind)?.label ?? kind

	const sourceLabel = (source: ProductDocumentSourceType) =>
		documents.sourceTypeOptions.find(option => option.value === source)?.label ?? source

	return (
		<section className="space-y-3">
			<h3 className="text-sm font-medium text-muted-foreground">
				{'Документы'}
			</h3>
			<div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
				{documents.items.map(document => (
					<DocumentAttachmentCard
						key={document.id}
						document={document}
						kindLabel={kindLabel(document.kind)}
						sourceLabel={sourceLabel(document.sourceType)}
						disabled={documents.disabled}
						onRemove={() => {
							documents.onRemove(document.id)
						}}
					/>
				))}
				<button
					type="button"
					disabled={documents.disabled}
					onClick={documents.onOpenModal}
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
			<UploadDocumentPopup />
		</section>
	)
}

export {DocumentsSection}
